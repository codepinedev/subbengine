import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { insertPlayersSchema, selectPlayersSchema } from "@/infrastructure/database/schema";

export const createPlayersRoute = createRoute({
  tags: ["Players"],
  method: "post",
  path: "/players",
  request: {
    body: jsonContentRequired(
      insertPlayersSchema,
      "The player to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPlayersSchema, "Player created"),
  },
});

export const getAllPlayersRoute = createRoute({
  tags: ["Players"],
  method: "get",
  path: "/players",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectPlayersSchema), "Players List"),
  },
});

// Export route types
export type CreatePlayersRoute = typeof createPlayersRoute;
export type GetAllPlayersRoute = typeof getAllPlayersRoute;
