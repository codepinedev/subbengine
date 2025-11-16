import type { ApiKeyStatus } from "@/lib/utils";

export interface ApiKey {
  id: string;
  name: string;
  status: ApiKeyStatus | null;
  gameId: string;
  userId: string;
  expireAt: Date | null;
  lastUsedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date;
}

export interface CreateApiKeyRequest {
  name: string;
  gameId: string;
  userId: string;
}
