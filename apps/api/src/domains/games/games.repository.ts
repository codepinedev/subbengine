import { and, eq } from "drizzle-orm";

import db from "@/infrastructure/database";
import { games } from "@/infrastructure/database/schema";

import type { Repository } from "../shared/interfaces";
import type { Game } from "./games.types";

export class GamesRepository implements Repository<Game, string> {
  constructor(private database = db) { }

  async findById(id: string): Promise<Game | null> {
    const result = await this.database.query.games.findFirst({
      where: eq(games.id, id),
    });
    return result || null;
  }

  async findMany(userId?: string): Promise<Game[]> {
    return this.database.query.games.findMany({
      where: userId ? eq(games.userId, userId) : undefined,
      with: {
        createdBy: true,
        apiKeys: true,
      },
    });
  }

  async create(data: Partial<Game>): Promise<Game> {
    if (!data.userId)
      throw new Error(`User not found.`);

    const [inserted] = await this.database
      .insert(games)
      .values({
        icon: data.icon || "",
        name: data.name || "",
        description: data.description || "",
        userId: data.userId || "",
      })
      .returning();
    if (!inserted)
      throw new Error(`Failed to insert a new game`);

    return inserted;
  }

  async update(id: string, data: Partial<Game>): Promise<Game> {
    if (!data.userId)
      throw new Error(`User not found.`);

    const [updated] = await this.database
      .update(games)
      .set(data)
      .where(and(eq(games.id, id), eq(games.userId, data.userId)))
      .returning();

    if (!updated)
      throw new Error("Failed to update a game");

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(games).where(eq(games.id, id));
  }
}
