import type { LeaderboardStatus } from "@/lib/utils";

export interface LeaderboardSDK {
  submitScore: (
    leaderboardId: string,
    playerId: string,
    score: number,
    metadata?: object,
  ) => Promise<{ score: number; rank: number }>;
  getTop: (
    leaderboardId: string,
    options?: { limit?: number },
  ) => Promise<Array<{ playerId: string; score: number; rank: number }>>;
  getPlayer: (
    leaderboardId: string,
    playerId: string,
  ) => Promise<{ playerId: string; score: number; rank: number }>;
}

export interface Leaderboard {
  id: string;
  name: string | null;
  gameId: string;
  userId: string;
  status: LeaderboardStatus | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface LeaderboardWithCount extends Leaderboard {
  playerCount: number;
}

export interface Player {
  id: string;
  username: string;
  score: number;
  rank: number;
  avatarUrl: string | null;
  leaderboardId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface LeaderboardRanking {
  playerId: string;
  score: number;
  rank: number;
}

export interface SubmitScoreRequest {
  playerId: string;
  score: number;
  metadata?: {
    username: string;
    avatarUrl: string;
  };
}

export interface SubmitScoreResponse {
  score: number;
  rank: number;
  metadata?: {
    username: string;
    avatarUrl: string;
  };
}

export interface GetTopPlayersOptions {
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
}

export interface LeaderboardEvents {
  SCORE_SUBMITTED: "leaderboard.score.submitted";
  RANK_UPDATED: "leaderboard.rank.updated";
  TOP_PLAYERS_UPDATED: "leaderboard.top_players.updated";
}
