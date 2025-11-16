import { Client, type ClientOptions } from "../core/client";
import type { Player } from "../lib/schema";

export class Leaderboard {
  private client: Client

  constructor(options: ClientOptions) {
    this.client = new Client(options)
  }

  getLeaderboards(): Promise<Leaderboard[]> {
    return this.client.request<Leaderboard[]>({
      method: 'get',
      url: '/leaderboards'
    })
  }

  getTop(leaderboardId: string, limit?: number): Promise<Player[]> {
    let url = `/leaderboards/${leaderboardId}/players`

    if (limit) url += `?limit=${limit}`

    return this.client.request<Player[]>({
      method: 'get',
      url
    })
  }
}
