import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  insertGamesSchema,
  selectGamesSchema,
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
export type GetAllGamesRoute = typeof getAllGamesRoute;
