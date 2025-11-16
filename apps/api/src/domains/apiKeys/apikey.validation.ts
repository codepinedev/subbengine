import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  insertApiKeysSchema,
  selectApiKeysSchema,
} from "@/infrastructure/database/schema";

export const createApiKeyRoute = createRoute({
  tags: ["API Keys"],
  method: "post",
  path: "/api-keys",
  request: {
    body: jsonContentRequired(insertApiKeysSchema, "The API key to create"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectApiKeysSchema, "API Key created"),
  },
});

export const getApiKeysByGameRoute = createRoute({
  tags: ["API Keys"],
  method: "get",
  path: "/api-keys/game/{gameId}",
  request: {
    params: z.object({
      gameId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectApiKeysSchema),
      "API Keys list",
    ),
  },
});

export const revokeApiKeyRoute = createRoute({
  tags: ["API Keys"],
  method: "patch",
  path: "/api-keys/{id}/revoke",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectApiKeysSchema, "API Key revoked"),
  },
});

export const getAllApiKeysRoute = createRoute({
  tags: ["API Keys"],
  method: "get",
  path: "/api-keys",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectApiKeysSchema),
      "All API Keys",
    ),
  },
});

// Export route types
export type CreateApiKeyRoute = typeof createApiKeyRoute;
export type GetApiKeysByGameRoute = typeof getApiKeysByGameRoute;
export type RevokeApiKeyRoute = typeof revokeApiKeyRoute;
export type GetAllApiKeysRoute = typeof getAllApiKeysRoute;
