import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { insertLeaderboardsSchema, selectLeaderboardsSchema, selectPlayersSchema } from "@/infrastructure/database/schema";

export const listLeaderboardsRoute = createRoute({
  tags: ["Leaderboard"],
  method: "get",
  path: "/leaderboards",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectLeaderboardsSchema), "Leaderboards List"),
  },
});

export const getLeaderboardRoute = createRoute({
  tags: ["Leaderboard"],
  method: "get",
  path: "/leaderboards/{leaderboardId}",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectLeaderboardsSchema, "Leaderboard"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(z.object({ error: z.string() }), "Leaderboard not found"),
  },
});

export const createLeaderboardRoute = createRoute({
  tags: ["Leaderboard"],
  method: "post",
  path: "/leaderboards",
  request: {
    body: jsonContentRequired(
      insertLeaderboardsSchema,
      "The leaderboard to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectLeaderboardsSchema, "Leaderboard created"),
  },
});

export const getTopPlayersRoute = createRoute({
  tags: ["Leaderboard"],
  method: "get",
  path: "/leaderboards/{leaderboardId}/players",
  request: {
    params: z.object({
      leaderboardId: z.string(),
    }),
    query: z.object({
      limit: z.coerce.number().optional(),
      offset: z.coerce.number().optional(),
      sort: z.enum(["asc", "desc"]).optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectPlayersSchema), "Leaderboard Players List"),
  },
});

export const getPlayerRoute = createRoute({
  tags: ["Leaderboard"],
  method: "get",
  path: "/leaderboards/{leaderboardId}/players/{playerId}",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPlayersSchema, "Leaderboard Player"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(z.object({ error: z.string() }), "Resource not found"),
  },
});

const ParamsSchema = z.object({
  leaderboardId: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: "leaderboardId",
        in: "path",
      },
    }),
});

export const submitScoreRoute = createRoute({
  tags: ["Leaderboard"],
  method: "post",
  path: "/leaderboards/{leaderboardId}/score",
  request: {
    params: ParamsSchema,
    body: jsonContentRequired(z.array(z.object({
      playerId: z.string(),
      score: z.number(),
      metadata: z.object({
        username: z.string(),
        avatarUrl: z.string(),
      }),
    })), "Leaderboard Score"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(z.object({
      score: z.number(),
      rank: z.number(),
    })), "Leaderboard Score"),
  },
});

// Export route types
export type ListLeaderboardsRoute = typeof listLeaderboardsRoute;
export type GetLeaderboardRoute = typeof getLeaderboardRoute;
export type CreateLeaderboardRoute = typeof createLeaderboardRoute;
export type GetTopPlayersRoute = typeof getTopPlayersRoute;
export type GetPlayerRoute = typeof getPlayerRoute;
export type SubmitScoreRoute = typeof submitScoreRoute;
