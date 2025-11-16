import type { Game } from './game.types'

export enum LeaderboardStatus {
  ARCHIVED = 'archived',
  ACTIVE = 'active',
}

export interface Leaderboard {
  id: string
  name: string
  game: Game
  icon: string
  userId: string
  status: LeaderboardStatus
  playerCount?: number
  createdAt: Date
  updatedAt: Date
}

export type LeaderboardCreated = Omit<Leaderboard, 'createdAt' | 'updatedAt'>
export type LeaderboardToCreate = Omit<
  Leaderboard,
  'createdAt' | 'updatedAt' | 'id' | 'userId' | 'status' | 'game'
> & {
  gameId: string
}

export type LeaderboardPlayer = {
  id: string
  username: string
  score: number
  rank: number
  avatarUrl: string
  leaderboardId: string
  createdAt: Date
  updatedAt: Date
}

export type UpdateScoreRequest = {
  leaderboardId: string
  playerId: string
  score: number
  metadata: {
    username: string
    avatarUrl: string
  }
}

export type UpdateScoreResponse = {
  rank: number
  score: number
}
