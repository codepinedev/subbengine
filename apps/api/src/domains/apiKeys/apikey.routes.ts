import { createRouter } from "@/lib/create-app";

import type { ApiKeyController } from "./apikey.controller";

import {
  createApiKeyRoute,
  getAllApiKeysRoute,
  getApiKeysByGameRoute,
  revokeApiKeyRoute,
} from "./apikey.validation";

export function createApiKeyRoutes(apiKeyController: ApiKeyController) {
  return createRouter()
    .openapi(createApiKeyRoute, apiKeyController.create)
    .openapi(getAllApiKeysRoute, apiKeyController.listAll)
    .openapi(getApiKeysByGameRoute, apiKeyController.listByGame)
    .openapi(revokeApiKeyRoute, apiKeyController.revoke);
}
