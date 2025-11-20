import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import type { ApiKeyService } from "./api-key.service";
import type {
  CreateApiKeyRoute,
  GetAllApiKeysRoute,
  GetApiKeysByGameRoute,
  RevokeApiKeyRoute,
} from "./api-key.validation";

export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) { }

  create: AppRouteHandler<CreateApiKeyRoute> = async (c) => {
    const userId = c.get("session")?.userId;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const apiKeyData = c.req.valid("json");

    const apiKey = await this.apiKeyService.createApiKey({ ...apiKeyData, userId });

    return c.json(apiKey, HttpStatusCodes.OK);
  };

  listByGame: AppRouteHandler<GetApiKeysByGameRoute> = async (c) => {
    const userId = c.get("session")?.userId;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const { gameId } = c.req.valid("param");

    const apiKeys = await this.apiKeyService.getApiKeysByGameId(gameId);

    return c.json(apiKeys, HttpStatusCodes.OK);
  };

  revoke: AppRouteHandler<RevokeApiKeyRoute> = async (c) => {
    const userId = c.get("session")?.userId;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const { id } = c.req.valid("param");

    const apiKey = await this.apiKeyService.revokeApiKey(id);

    return c.json(apiKey, HttpStatusCodes.OK);
  };

  listAll: AppRouteHandler<GetAllApiKeysRoute> = async (c) => {
    const userId = c.get("session")?.userId;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const apiKeys = await this.apiKeyService.getAllApiKeys(userId);

    return c.json(apiKeys, HttpStatusCodes.OK);
  };
}
