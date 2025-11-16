import { eq } from "drizzle-orm";

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
    const [inserted] = await this.database
      .insert(games)
      .values({
        icon: data.icon || "",
        name: data.name || "",
        description: data.description || "",
        userId: data.userId || "",
      })
      .returning();
    return inserted;
  }

  async update(id: string, data: Partial<Game>): Promise<Game> {
    const [updated] = await this.database
      .update(games)
      .set({
        icon: data.icon || "",
        name: data.name || "",
        description: data.description || "",
        userId: data.userId || "",
      })
      .where(eq(games.id, id))
      .returning();
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(games).where(eq(games.id, id));
  }
}
