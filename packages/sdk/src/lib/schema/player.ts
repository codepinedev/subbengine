export interface Player {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  username: string;
  score: number;
  rank: number;
  avatarUrl: string | null;
  leaderboardId: string;
}

export interface CreatePlayerResponse {
  id: string;
  username: string;
  score: number;
  rank: number;
  avatarurl: string;
  leaderboardId: string;
  createdAt: Date;
  updatedAt: Date;
}
