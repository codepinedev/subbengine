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
