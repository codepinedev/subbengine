import { and, eq, gte, sql } from "drizzle-orm";

import db from "@/infrastructure/database";
import { apiKeyLogs, apiKeys } from "@/infrastructure/database/schema";

import type { Repository } from "../shared/interfaces";
import type { ApiKey, ApiKeyLog, ApiKeyLogRequest } from "./api-key.types";

export class ApiKeyRepository implements Repository<ApiKey, string> {
  constructor(private database = db) {}

  async findById(id: string): Promise<ApiKey | null> {
    const result = await this.database.query.apiKeys.findFirst({
      where: eq(apiKeys.id, id),
    });
    return result || null;
  }

  async findMany(userId: string): Promise<ApiKey[]> {
    return this.database.query.apiKeys.findMany({
      where: eq(apiKeys.userId, userId),
    });
  }

  async findByGameId(gameId: string): Promise<ApiKey[]> {
    return this.database.query.apiKeys.findMany({
      where: eq(apiKeys.gameId, gameId),
    });
  }

  async create(data: Partial<ApiKey>): Promise<ApiKey> {
    const [inserted] = await this.database
      .insert(apiKeys)
      .values({
        id: data.id || crypto.randomUUID(),
        name: data.name || "",
        gameId: data.gameId || "",
        userId: data.userId || "",
      })
      .returning();

    if (!inserted)
      throw new Error(`Failed to create an API Key`);

    return inserted;
  }

  async update(id: string, data: Partial<ApiKey>): Promise<ApiKey> {
    const [updated] = await this.database
      .update(apiKeys)
      .set(data)
      .where(eq(apiKeys.id, id))
      .returning();

    if (!updated)
      throw new Error(`API Key with id ${id} not found`);

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(apiKeys).where(eq(apiKeys.id, id));
  }

  async getApiKeyStatsForUser(userId: string): Promise<{ apiCallsToday: number }> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const result = await this.database.select({ count: sql<number>`count(*)` })
      .from(apiKeyLogs)
      .innerJoin(apiKeys, eq(apiKeyLogs.apiKeyId, apiKeys.id))
      .where(
        and(
          eq(apiKeys.userId, userId),
          gte(apiKeyLogs.createdAt, startOfDay),
        ),
      );

    return {
      apiCallsToday: Number(result[0]?.count ?? 0),
    };
  }

  async getLogs(id: string): Promise<Array<ApiKeyLog>> {
    return await this.database.query.apiKeyLogs.findMany({ where: eq(apiKeyLogs.apiKeyId, id) });
  }

  async logApiKey(data: ApiKeyLogRequest): Promise<ApiKeyLog> {
    const [inserted] = await this.database
      .insert(apiKeyLogs)
      .values(data)
      .returning();

    if (!inserted)
      throw new Error(`Failed to insert a new key log`);

    return inserted;
  }
}
