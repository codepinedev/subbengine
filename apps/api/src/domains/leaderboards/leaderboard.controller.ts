import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "../shared/types";
import type { LeaderboardRepository } from "./leaderboard.repository";
import type { SubmitScoreResponse } from "./leaderboard.types";
import type {
  CreateLeaderboardRoute,
  GetLeaderboardRoute,
  GetPlayerRoute,
  GetTopPlayersRoute,
  ListLeaderboardsRoute,
  SubmitScoreRoute,
} from "./leaderboard.validation";
import type { LeaderboardService } from "./leaderboards.service";

export class LeaderboardController {
  constructor(
    private leaderboardService: LeaderboardService,
    private leaderboardRepository: LeaderboardRepository,
  ) { }

  /**
   * List all leaderboards for a user
   */
  list: AppRouteHandler<ListLeaderboardsRoute> = async (c) => {
    const userId = c.get("apiKey")?.userId || c.get("session")?.userId;

    c.var.logger.info("Listing leaderboards");

    const leaderboards
      = await this.leaderboardService.getAllLeaderboards(userId);

    return c.json(leaderboards, HttpStatusCodes.OK);
  };

  /**
   * Get a leaderboard by id
   */
  get: AppRouteHandler<GetLeaderboardRoute> = async (c) => {
    const leaderboardId = c.req.param("leaderboardId");
    const userId = c.get("apiKey")?.userId || c.get("session")?.userId;

    c.var.logger.info({ leaderboardId }, "Getting leaderboard");

    const leaderboard
      = await this.leaderboardService.getLeaderboardById(leaderboardId, userId);

    return c.json(leaderboard, HttpStatusCodes.OK);
  };

  /**
   * Create a leaderboard
   */
  create: AppRouteHandler<CreateLeaderboardRoute> = async (c) => {
    const leaderboardData = c.req.valid("json");
    const user = c.get("session");

    if (!user)
      throw new HTTPException(HttpStatusCodes.NOT_FOUND);

    c.var.logger.info({ leaderboardData }, "Creating leaderboard");
    const leaderboard = await this.leaderboardService.createLeaderboard({
      ...leaderboardData,
      userId: user.userId,
    });
    return c.json(leaderboard, HttpStatusCodes.OK);
  };

  /**
   * Get the top players for a leaderboard
   */
  topPlayers: AppRouteHandler<GetTopPlayersRoute> = async (c) => {
    const userId = c.get("apiKey")?.userId || c.get("session")?.userId;
    const { leaderboardId } = c.req.valid("param");
    const { limit, offset, sort } = c.req.valid("query");

    c.var.logger.info(
      { leaderboardId, limit, offset, sort },
      "Getting top players",
    );

    await this.leaderboardService.getLeaderboardById(leaderboardId, userId);

    const topRankings = await this.leaderboardService.getTopPlayers(
      leaderboardId,
      { limit, offset, sort },
    );

    if (topRankings.length === 0) {
      return c.json([]);
    }

    const playerIds = topRankings.map(ranking => ranking.playerId);
    const playersWithDetails
      = await this.leaderboardRepository.getPlayersWithDetails(playerIds);

    const result = topRankings
      .map((ranking) => {
        const playerDetails = playersWithDetails.find(
          p => p.id === ranking.playerId,
        );
        if (!playerDetails)
          return null;

        return {
          id: playerDetails.id,
          username: playerDetails.username,
          score: ranking.score,
          rank: ranking.rank,
          avatarUrl: playerDetails.avatarUrl,
          leaderboardId: playerDetails.leaderboardId,
          userId: playerDetails.userId,
          createdAt: playerDetails.createdAt?.toISOString() || null,
          updatedAt: playerDetails.updatedAt?.toISOString() || null,
        };
      })
      .filter(
        (player): player is NonNullable<typeof player> => player !== null,
      );

    return c.json(result);
  };

  /**
   * Get a player by id
   */
  player: AppRouteHandler<GetPlayerRoute> = async (c) => {
    const leaderboardId = Number(c.req.param("leaderboardId"));
    const playerId = c.req.param("playerId");

    c.var.logger.info({ leaderboardId, playerId }, "Getting player");

    const playerRanking = await this.leaderboardService.getPlayerRank(
      leaderboardId.toString(),
      playerId,
    );

    const playerDetails = await this.leaderboardRepository.getPlayerById(playerId);



    return c.json(
      {
        id: playerDetails.id,
        username: playerDetails.username,
        score: playerRanking.score,
        rank: playerRanking.rank,
        avatarUrl: playerDetails.avatarUrl,
        leaderboardId: playerDetails.leaderboardId,
        userId: playerDetails.userId,
        createdAt: playerDetails.createdAt?.toISOString() || null,
        updatedAt: playerDetails.updatedAt?.toISOString() || null,
      },
      HttpStatusCodes.OK,
    );
  };

  /**
   * Submit a score for a leaderboard
   */
  score: AppRouteHandler<SubmitScoreRoute> = async (c) => {
    const leaderboardId = c.req.param("leaderboardId");
    const requestData = c.req.valid("json");

    const results: SubmitScoreResponse[] = [];

    for (const request of requestData) {
      const result = await this.leaderboardService.submitScore(
        leaderboardId,
        request,
      );
      c.var.logger.info(
        {
          leaderboardId,
          playerId: request.playerId,
          score: request.score,
          rank: result.rank,
        },
        "Score submitted successfully",
      );

      results.push(result);
    }

    return c.json(results);
  };
}
