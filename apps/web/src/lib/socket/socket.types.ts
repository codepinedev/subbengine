export interface ServerToClientEvents {
  'leaderboard:updated': (data: { leaderboardId: string }) => void
  'score:updated': (data: {
    leaderboardId: string
    playerId: string
    newScore: number
  }) => void
  'player:joined': (data: { leaderboardId: string; playerId: string; }) => void
  'player:removed': (data: { leaderboardId: string; playerId: string }) => void
}

export interface ClientToServerEvents {
  'join:leaderboard': (leaderboardId: string) => void
  'leave:leadeboard': (leaderboardId: string) => void
}
