import { eq } from "drizzle-orm";

import db from "@/infrastructure/database";
import { players } from "@/infrastructure/database/schema";

import type { Repository } from "../shared/interfaces";
import type { Player } from "./players.types";

export class PlayersRepository implements Repository<Player, string> {
  constructor(private database = db) { }

  async findById(id: string): Promise<Player | null> {
    const result = await this.database.query.players.findFirst({
      where: eq(players.id, id),
    });
    return result || null;
  }

  async findMany(): Promise<Player[]> {
    return this.database.query.players.findMany();
  }

  async create(data: Partial<Player>): Promise<Player> {
    const [inserted] = await this.database
      .insert(players)
      .values({
        username: data.username ?? "",
        score: data.score ?? 0,
        rank: data.rank ?? 0,
        leaderboardId: data.leaderboardId ?? "",
        avatarUrl: data.avatarUrl ?? "",
      })
      .returning();
    return inserted;
  }

  async update(id: string, data: Partial<Player>): Promise<Player> {
    const [updated] = await this.database
      .update(players)
      .set({ ...data, score: 0, rank: 0 })
      .where(eq(players.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(players).where(eq(players.id, id));
  }
}
