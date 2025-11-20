import type { ApiKeyService } from "../apiKeys/api-key.service";
import type { CacheService, QueueService } from "../shared/interfaces";
import type { GamesRepository } from "./games.repository";

export class GameService {
  constructor(
    private gameRepository: GamesRepository,
    private cacheService: CacheService,
    private queueService: QueueService,
    private apiKeyService: ApiKeyService,
  ) { }

  // TODO: Implement update player metadata for updating player information only
  async updateGame(data: {
    playerId: string;
    username: string;
    avatarUrl: string;
  }) {
    console.log(data);
  }

  async createGame(data: {
    name: string;
    description: string;
    icon: string;
    userId: string;
    apiKeyName: string;
  }) {
    let createdGame;

    try {
      createdGame = await this.gameRepository.create(data);
      await this.apiKeyService.createApiKey({
        name: data.apiKeyName,
        userId: data.userId,
        gameId: createdGame.id,
      });
      return createdGame;
    }
    catch (error) {
      console.error(error);
      throw new Error("Failed to create game");
    }
  }

  async getAllGames(userId: string) {
    const games = await this.gameRepository.findMany(userId);
    return games;
  }
}
