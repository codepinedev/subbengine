import { Client, type ClientOptions } from "../core/client";
import type { CreatePlayerResponse } from "../lib/schema/player";
import type { SubmitScoreResponse } from "../lib/schema/score";

export class Player {
  private client: Client

  constructor(options: ClientOptions) {
    this.client = new Client(options)
  }

  create(leaderboardId: string, username: string, avatarUrl: string, rank: number, score: number): Promise<CreatePlayerResponse> {

    return this.client.request({
      method: 'post', url: `/players`, data: {
        leaderboardId,
        username,
        avatarUrl,
        rank,
        score
      }
    })
  }

  // TODO: Possibly add ability to submit multiple scores? It's already implemented in the API 
  submitScore(leaderboardId: string, playerId: string, score: number, metadata?: {
    username: string;
    avatarUrl: string;
  }): Promise<SubmitScoreResponse> {
    const payload = [{
      playerId, score, metadata
    }]
    return this.client.request({ method: 'post', url: `/leaderboards/${leaderboardId}/score`, data: payload })
  }
}
