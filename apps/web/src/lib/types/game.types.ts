import type { ApiKey } from './api-key.types'
import type { User } from './user.types'

export interface Game {
  id: string
  icon: string
  name: string
  description: string
  userId: string
  createdAt: Date
  updatedAt: Date
  createdBy: User
  apiKeys: Array<ApiKey>
}

export interface GameToCreate {
  icon: string
  name: string
  description: string
  apiKeyName: string
}
