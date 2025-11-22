import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import db from "@/infrastructure/database";
import { players } from "@/infrastructure/database/schema";

import type { Repository } from "../shared/interfaces";
import type { InsertPlayerType, Player, UpdatePlayerType } from "./players.types";

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

  async create(data: InsertPlayerType): Promise<Player> {
    const [inserted] = await this.database
      .insert(players)
      .values(data)
      .returning();

    if (!inserted)
      throw new HTTPException(HttpStatusCodes.BAD_REQUEST, { message: "Failed to insert resource" });

    return inserted;
  }

  async update(id: string, data: UpdatePlayerType): Promise<Player> {
    const [updated] = await this.database
      .update(players)
      .set({ ...data, score: 0, rank: 0 })
      .where(and(eq(players.id, id), eq(players.userId, data.userId as string)))
      .returning();

    if (!updated)
      throw new HTTPException(HttpStatusCodes.BAD_REQUEST, { message: "Failed to update resource" });

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(players).where(eq(players.id, id));
  }
}
