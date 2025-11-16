import { ApiKeyController } from "@/domains/apiKeys/apikey.controller";
import { ApiKeyRepository } from "@/domains/apiKeys/apikey.repository";
import { ApiKeyService } from "@/domains/apiKeys/apikey.service";
import { GamesController, GameService, GamesRepository } from "@/domains/games";
import { HealthService } from "@/domains/health";
import { HealthController } from "@/domains/health/health.controller";
import {
  LeaderboardController,
  LeaderboardRepository,
  LeaderboardService,
} from "@/domains/leaderboards";
import {
  PlayersController,
  PlayerService,
  PlayersRepository,
} from "@/domains/players";
import {
  BullMQService,
  RedisCacheService,
  SocketService,
} from "@/infrastructure";
import db from "@/infrastructure/database";

const leaderboardRepository = new LeaderboardRepository(db);
const playerRepository = new PlayersRepository(db);
const gameRepository = new GamesRepository(db);
const apiKeyRepository = new ApiKeyRepository(db);

const cacheService = new RedisCacheService();
const queueService = new BullMQService();
const socketService = new SocketService();
const apiKeyService = new ApiKeyService(apiKeyRepository);
const gameService = new GameService(
  gameRepository,
  cacheService,
  queueService,
  apiKeyService,
);
const healthService = new HealthService();
const leaderboardService = new LeaderboardService(
  leaderboardRepository,
  cacheService,
  queueService,
  socketService,
);
const playerService = new PlayerService(
  playerRepository,
  leaderboardService,
  cacheService,
  queueService,
);

const gamesController = new GamesController(gameService);
const apiKeyController = new ApiKeyController(apiKeyService);
const leaderboardController = new LeaderboardController(
  leaderboardService,
  leaderboardRepository,
);
const playersController = new PlayersController(playerService);
const healthController = new HealthController(healthService);

export const container = {
  // Infrastructure
  cacheService,
  queueService,
  socketService,
  // Repositories
  leaderboardRepository,
  playerRepository,
  gameRepository,
  // Services
  leaderboardService,
  healthService,
  playerService,
  gameService,
  apiKeyService,
  // Controllers
  apiKeyController,
  gamesController,
  leaderboardController,
  playersController,
  healthController,
} as const;
