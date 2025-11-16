export interface Player {
  id: string
  username: string
  score: number
  rank: number
  avatarUrl: string
  leaderboardId: string
  createdAt: Date
  updatedAt: Date
}

export type PlayerCreated = Player
export type PlayerToCreate = Omit<Player, 'createdAt' | 'updatedAt' | 'id'>
