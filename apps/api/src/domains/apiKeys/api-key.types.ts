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

export interface ApiKeyLog {
  id: string;
  apiKeyId: string;
  endpoint: string | null;
  method: string | null;
  statusCode: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  errorMessage: string | null;
  createdAt: Date | null;
  updatedAt: Date;
}

export interface ApiKeyLogRequest {
  apiKeyId: string;
  statusCode?: string;
  endpoint: string | null;
  method?: string;
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
}
