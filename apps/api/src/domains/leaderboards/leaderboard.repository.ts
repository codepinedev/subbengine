import { desc, eq, inArray, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import db from "@/infrastructure/database";
import { leaderboards, players } from "@/infrastructure/database/schema";
import { LeaderboardStatus } from "@/lib/utils";

import type { SelectPlayerType } from "../players";
import type { Repository } from "../shared/interfaces";
import type { Leaderboard, Player } from "./leaderboard.types";

export class LeaderboardRepository implements Repository<Leaderboard, string> {
  constructor(private database = db) { }

  async findById(id: string): Promise<Leaderboard | null> {
    const result = await this.database.query.leaderboards.findFirst({
      where: eq(leaderboards.id, id),
      with: {
        createdBy: true,
        game: true,
      },
    });

    return result || null;
  }

  async findMany(userId: string): Promise<Leaderboard[]> {
    return this.database.query.leaderboards.findMany({
      where: (leaderboard, { eq, and }) =>
        and(
          eq(leaderboard.status, LeaderboardStatus.ACTIVE),
          eq(leaderboard.userId, userId),
        ),
      with: { createdBy: true, game: true },
    });
  }

  async create(data: Leaderboard): Promise<Leaderboard> {
    const [inserted] = await this.database
      .insert(leaderboards)
      .values(data)
      .returning();

    if (!inserted)
      throw new Error("Failed to insert a new leaderboard");

    return inserted;
  }

  async update(id: string, data: Partial<Leaderboard>): Promise<Leaderboard> {
    const [updated] = await this.database
      .update(leaderboards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leaderboards.id, id))
      .returning();

    if (!updated)
      throw new Error("Failed to updated a leaderboard");

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(leaderboards).where(eq(leaderboards.id, id));
  }

  // Leaderboard-specific methods
  async getTopPlayersFromDB(
    leaderboardId: string,
    options: { limit?: number; offset?: number } = {},
  ): Promise<Player[]> {
    const { limit = 10, offset = 0 } = options;

    return this.database.query.players.findMany({
      where: eq(players.leaderboardId, leaderboardId),
      orderBy: [desc(players.score)],
      limit,
      offset,
    });
  }

  async getPlayersWithDetails(playerIds: string[]): Promise<SelectPlayerType[]> {
    if (playerIds.length === 0) {
      return [];
    }

    return this.database.query.players.findMany({
      where: inArray(players.id, playerIds),
      orderBy: [desc(players.score)],
    });
  }

  async getPlayerById(playerId: string): Promise<SelectPlayerType> {
    const result = await this.database.query.players.findFirst({
      where: eq(players.id, playerId),
    });

    if (!result) {
      throw new HTTPException(HttpStatusCodes.NOT_FOUND, { message: "Resource not found" });
    }

    return result;
  }

  async updatePlayerScore(
    playerId: string,
    score: number,
    rank: number,
  ): Promise<void> {
    await this.database
      .update(players)
      .set({
        score,
        rank,
        updatedAt: new Date(),
      })
      .where(eq(players.id, playerId));
  }

  async getPlayerCountsByLeaderboardIds(
    leaderboardIds: string[],
  ): Promise<Map<string, number>> {
    if (leaderboardIds.length === 0) {
      return new Map();
    }

    const result = await this.database
      .select({
        leaderboardId: players.leaderboardId,
        count: sql<number>`count(*)::int`,
      })
      .from(players)
      .where(inArray(players.leaderboardId, leaderboardIds))
      .groupBy(players.leaderboardId);

    return new Map(
      result.map((r) => {
        return [r.leaderboardId, r.count];
      }),
    );
  }
}
