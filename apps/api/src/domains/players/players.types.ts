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
