import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { Player } from "../leaderboards";
import type { LeaderboardService } from "../leaderboards/leaderboards.service";
import type { CacheService, QueueService } from "../shared/interfaces";
import type { PlayersRepository } from "./players.repository";
import type { InsertPlayerType, UpdatePlayerType } from "./players.types";

export class PlayerService {
  constructor(
    private playerRepository: PlayersRepository,
    private leaderboardService: LeaderboardService,
    private cacheService: CacheService,
    private queueService: QueueService,
  ) {}

  async updatePlayer(id: string, data: UpdatePlayerType) {
    if (!data.userId)
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED);

    const player = await this.playerRepository.update(id, data);
    return player;
  }

  async createPlayer(data: InsertPlayerType) {
    const leaderboard = await this.leaderboardService.getLeaderboardById(
      data.leaderboardId ?? "",
    );

    if (!leaderboard) {
      throw new HTTPException(HttpStatusCodes.NOT_FOUND);
    }

    const registeredPlayer = await this.playerRepository.create(data);

    this.leaderboardService.submitScore(leaderboard.id.toString(), {
      playerId: registeredPlayer.id,
      score: data.score,
      metadata: {
        username: data.username,
        avatarUrl: data.avatarUrl ?? "",
      },
    });

    return registeredPlayer;
  }

  async getAllPlayers() {
    return await this.playerRepository.findMany();
  }
}
