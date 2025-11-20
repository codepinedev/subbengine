import { ApiKeyStatus } from "@/lib/utils";

import type { ApiKeyRepository } from "./api-key.repository";
import type { ApiKey, CreateApiKeyRequest } from "./api-key.types";

export class ApiKeyService {
  constructor(private apiKeyRepository: ApiKeyRepository) { }

  async createApiKey(data: CreateApiKeyRequest): Promise<ApiKey> {
    const apiKeyValue = this.generateApiKey(data.name);

    return this.apiKeyRepository.create({
      id: apiKeyValue,
      name: data.name,
      gameId: data.gameId,
      status: ApiKeyStatus.ENABLED,
      userId: data.userId,
    });
  }

  async getApiKeysByGameId(gameId: string): Promise<ApiKey[]> {
    return this.apiKeyRepository.findByGameId(gameId);
  }

  async getAllApiKeys(userId: string): Promise<ApiKey[]> {
    return this.apiKeyRepository.findMany(userId);
  }

  async getApiKeyById(id: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findById(id);
  }

  async revokeApiKey(id: string): Promise<ApiKey> {
    return this.apiKeyRepository.update(id, {
      status: ApiKeyStatus.REVOKED,
    });
  }

  async updateApiKeyName(id: string, name: string): Promise<ApiKey> {
    return this.apiKeyRepository.update(id, { name });
  }

  async deleteApiKey(id: string): Promise<void> {
    return this.apiKeyRepository.delete(id);
  }

  async updateLastUsed(id: string): Promise<ApiKey> {
    return this.apiKeyRepository.update(id, {
      lastUsedAt: new Date(),
    });
  }

  private generateApiKey(prefix: string): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const randomString = Array.from(randomBytes)
      .map((b) => {
        return b.toString(16).padStart(2, "0");
      })
      .join("");

    const timestamp = Date.now().toString().slice(-6);

    return `${prefix}_${randomString}_${timestamp}`;
  }
}
