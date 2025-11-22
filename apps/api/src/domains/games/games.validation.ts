import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  insertGamesSchema,
  selectGamesSchema,
  updateGamesSchema,
} from "@/infrastructure/database/schema";

export const createGameRoute = createRoute({
  tags: ["Games"],
  method: "post",
  path: "/games",
  request: {
    body: jsonContentRequired(
      insertGamesSchema.extend({
        apiKeyName: z.string().min(1).max(50),
      }),
      "The game and API Key to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectGamesSchema, "Games created"),
  },
});

export const updateGameRoute = createRoute({
  tags: ["Games"],
  method: "patch",
  path: "/games/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      updateGamesSchema,
      "The game to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectGamesSchema, "Game updated"),
  },
});

export const getAllGamesRoute = createRoute({
  tags: ["Games"],
  method: "get",
  path: "/games",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectGamesSchema), "Games List"),
  },
});

// Export route types
export type CreateGameRoute = typeof createGameRoute;
export type UpdateGameRoute = typeof updateGameRoute;
export type GetAllGamesRoute = typeof getAllGamesRoute;
