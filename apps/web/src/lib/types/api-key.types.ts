export enum ApiKeyStatus {
  ENABLED = 'enabled',
  REVOKED = 'revoked',
}

export interface ApiKey {
  id: string
  name: string
  key: string
  status: ApiKeyStatus
  gameId: string
  expireAt: Date
  lastUsedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface ApiKeyLog{
  id: string;
  apiKeyId: string;
  endpoint: string | null;
  method: string | null;
  statusCode: number | null;
  responseTime: number | null;
  ipAddress: string | null;
  userAgent: string | null;
  errorMessage: string | null;
  createdAt: Date | null;
  updatedAt: Date;
}
