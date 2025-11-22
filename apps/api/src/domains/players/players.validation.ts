import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { insertPlayersSchema, selectPlayersSchema, updatePlayersSchema } from "@/infrastructure/database/schema";

export const createPlayersRoute = createRoute({
  tags: ["Players"],
  method: "post",
  path: "/players",
  request: {
    body: jsonContentRequired(
      insertPlayersSchema.omit({ userId: true }),
      "The player to create",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPlayersSchema, "Player created"),
  },
});

export const updatePlayersRoute = createRoute({
  tags: ["Players"],
  method: "patch",
  path: "/players/{id}",
  request: {
    params: z.object({
      id: z.string(),
    }),
    body: jsonContentRequired(
      updatePlayersSchema,
      "The player to update",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectPlayersSchema, "Player update"),
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
export type UpdatePlayersRoute = typeof updatePlayersRoute;
export type GetAllPlayersRoute = typeof getAllPlayersRoute;
