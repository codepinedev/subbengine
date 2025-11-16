import { createRouter } from "@/lib/create-app";

import type { LeaderboardController } from "./leaderboard.controller";

import {
  createLeaderboardRoute,
  getLeaderboardRoute,
  getPlayerRoute,
  getTopPlayersRoute,
  listLeaderboardsRoute,
  submitScoreRoute,
} from "./leaderboard.validation";

export function createLeaderboardRoutes(leaderboardController: LeaderboardController) {
  return createRouter()
    .openapi(listLeaderboardsRoute, leaderboardController.list)
    .openapi(getLeaderboardRoute, leaderboardController.get)
    .openapi(createLeaderboardRoute, leaderboardController.create)
    .openapi(getTopPlayersRoute, leaderboardController.topPlayers)
    .openapi(getPlayerRoute, leaderboardController.player)
    .openapi(submitScoreRoute, leaderboardController.score);
}
