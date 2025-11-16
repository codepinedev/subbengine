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

export interface Game {
  id: string;
  icon: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date;
}
