import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { SocketService } from "@/infrastructure";

import type { CacheService, QueueService } from "../shared/interfaces";
import type { LeaderboardRepository } from "./leaderboard.repository";
import type {
  GetTopPlayersOptions,
  LeaderboardRanking,
  LeaderboardWithCount,
  SubmitScoreRequest,
  SubmitScoreResponse,
} from "./leaderboard.types";

export class LeaderboardService {
  constructor(
    private leaderboardRepository: LeaderboardRepository,
    private cacheService: CacheService,
    private queueService: QueueService,
    private socketService: SocketService,
  ) { }

  async submitScore(
    leaderboardId: string,
    request: SubmitScoreRequest,
  ): Promise<SubmitScoreResponse> {
    if (!leaderboardId) {
      throw new HTTPException(HttpStatusCodes.BAD_REQUEST, {
        message: "You forgot something important, the leaderboard ID.",
      });
    }

    const { playerId, score, metadata } = request;

    // Store score in Redis ZSET for fast ranking
    await this.cacheService.zadd(`lb:${leaderboardId}:scores`, score, playerId);

    // Store optional metadata
    if (metadata) {
      await this.cacheService.hset(`lb:${leaderboardId}:player:${playerId}`, {
        metadata: JSON.stringify(metadata),
        lastUpdated: Date.now().toString(),
      });
    }

    // Get rank (ZREVRANK = rank descending, add 1 to be human readable)
    let rank = await this.cacheService.zrevrank(
      `lb:${leaderboardId}:scores`,
      playerId,
    );

    rank = (rank ?? -1) + 1;

    // Enqueue job for database persistence
    await this.queueService.enqueue("scores", "updateScore", {
      leaderboardId,
      playerId,
      score,
      rank,
    });

    this.socketService.broadcastScoreUpdate(leaderboardId, playerId, score);

    return { score, rank, metadata };
  }

  async getTopPlayers(
    leaderboardId: string,
    options: GetTopPlayersOptions = {},
  ): Promise<LeaderboardRanking[]> {
    const { limit = 10 } = options;

    const redisResponse = await this.cacheService.zrevrange(
      `lb:${leaderboardId}:scores`,
      0,
      limit - 1,
      true, // withScores
    );

    if (redisResponse.length > 0) {
      const rankings: LeaderboardRanking[] = [];

      for (let i = 0; i < redisResponse.length; i += 2) {
        rankings.push({
          playerId: redisResponse[i] ?? "",
          score: Number(redisResponse[i + 1]),
          rank: i / 2 + 1,
        });
      }
      return rankings;
    }

    return this.rebuildLeaderboardCache(leaderboardId, { limit });
  }

  async getPlayerRank(
    leaderboardId: string,
    playerId: string,
  ): Promise<LeaderboardRanking | null> {
    const rank = await this.cacheService.zrevrank(
      `lb:${leaderboardId}:scores`,
      playerId,
    );

    if (rank === null) {
      return null;
    }

    // Get the score for this player
    const scores = await this.cacheService.zrevrange(
      `lb:${leaderboardId}:scores`,
      rank,
      rank,
      true,
    );

    if (scores.length === 0) {
      return null;
    }

    return {
      playerId,
      score: Number(scores[1]),
      rank: rank + 1, // Convert to human-readable rank
    };
  }

  async rebuildLeaderboardCache(
    leaderboardId: string,
    options: GetTopPlayersOptions = {},
  ) {
    const { limit = 10 } = options;
    // Get all players for this leaderboard from database, ordered by score DESC
    const players = await this.leaderboardRepository.getTopPlayersFromDB(
      leaderboardId,
      { limit: 1000 }, // Get more than needed to rebuild the full cache
    );

    if (players.length === 0) {
      return [];
    }

    const cacheKey = `lb:${leaderboardId}:scores`;

    await this.cacheService.delete(cacheKey);

    for (const player of players) {
      await this.cacheService.zadd(cacheKey, player.score, player.id);
    }

    const rankings: LeaderboardRanking[] = players
      .slice(0, limit)
      .map((player, index) => ({
        playerId: player.id,
        score: player.score,
        rank: index + 1,
      }));

    return rankings;
  }

  // TODO: Remove player from a leaderboard with a player_id
  // Then remove his attachment to the leaderboard => leaderboardId = null
  async removePlayerFromLeaderboard() { }

  async getAllLeaderboards(userId?: string): Promise<LeaderboardWithCount[]> {
    const leaderboards = await this.leaderboardRepository.findMany(userId);

    if (leaderboards.length === 0) {
      return [];
    }

    // Get player counts for all leaderboards
    const leaderboardIds = leaderboards.map(lb => lb.id);
    const playerCounts
      = await this.leaderboardRepository.getPlayerCountsByLeaderboardIds(
        leaderboardIds,
      );

    // Attach player counts to each leaderboard
    return leaderboards.map(lb => ({
      ...lb,
      playerCount: playerCounts.get(lb.id) || 0,
    }));
  }

  async getLeaderboardById(id: string) {
    return this.leaderboardRepository.findById(id);
  }

  async createLeaderboard(data: any) {
    return this.leaderboardRepository.create(data);
  }
}
