export interface SubmitScoreRequest {
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
