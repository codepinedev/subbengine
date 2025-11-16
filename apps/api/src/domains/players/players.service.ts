import type { LeaderboardService } from "../leaderboards/leaderboards.service";
import type { CacheService, QueueService } from "../shared/interfaces";
import type { PlayersRepository } from "./players.repository";

export class PlayerService {
  constructor(
    private playerRepository: PlayersRepository,
    private leaderboardService: LeaderboardService,
    private cacheService: CacheService,
    private queueService: QueueService,
  ) {}

  // TODO: Implement update player metadata for updating player information only
  async updatePlayerMetadata(data: {
    playerId: string;
    username: string;
    avatarUrl: string;
  }) {
    console.log(data);
  }

  async createPlayer(data: any) {
    const leaderboard = await this.leaderboardService.getLeaderboardById(
      data.leaderboardId,
    );

    if (!leaderboard) {
      throw new Error("Leaderboard not found");
    }

    const registredPlayer = await this.playerRepository.create(data);

    this.leaderboardService.submitScore(leaderboard.id.toString(), {
      playerId: registredPlayer.id,
      score: data.score,
      metadata: {
        username: data.username,
        avatarUrl: data.avatarUrl ?? "",
      },
    });

    return registredPlayer;
  }

  async getAllPlayers() {
    return await this.playerRepository.findMany();
  }
}
