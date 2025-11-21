import { createRouter } from "@/lib/create-app";

import type { ApiKeyController } from "./api-key.controller";

import {
  createApiKeyRoute,
  getAllApiKeyLogsRoute,
  getAllApiKeysRoute,
  getApiKeyCallStatsRoute,
  getApiKeysByGameRoute,
  revokeApiKeyRoute,
} from "./api-key.validation";

export function createApiKeyRoutes(apiKeyController: ApiKeyController) {
  return createRouter()
    .openapi(createApiKeyRoute, apiKeyController.create)
    .openapi(getAllApiKeysRoute, apiKeyController.listAll)
    .openapi(getApiKeysByGameRoute, apiKeyController.listByGame)
    .openapi(getApiKeyCallStatsRoute, apiKeyController.getApiCallStats)
    .openapi(getAllApiKeyLogsRoute, apiKeyController.listAllApiKeyLogs)
    .openapi(revokeApiKeyRoute, apiKeyController.revoke);
}
