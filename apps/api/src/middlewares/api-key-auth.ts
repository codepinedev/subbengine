import type { Context, Next } from "hono";

import type { ApiKeyService } from "@/domains/apiKeys/api-key.service";
import type { ApiKey } from "@/domains/apiKeys/api-key.types";

import { ApiKeyStatus } from "@/lib/utils";

function extractApiKey(c: Context): string | null {
  const authHeader = c.req.header("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const apiKeyHeader = c.req.header("X-API-Key");
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  const queryParam = c.req.query("api_key");
  if (queryParam) {
    return queryParam;
  }

  return null;
}

function validateApiKey(c: Context, key: ApiKey) {
  c.var.logger.info(key);

  if (key.status === ApiKeyStatus.REVOKED) {
    return { valid: false, error: "API key has been revoked" };
  }

  if (key.expireAt && new Date() > key.expireAt) {
    return { valid: false, error: "API key has expired" };
  }

  return { valid: true, key };
}

export function createApiKeyAuthMiddleware(apiKeyService: ApiKeyService) {
  return async (c: Context, next: Next) => {
    const apiKey = extractApiKey(c);

    if (!apiKey) {
      return c.json({ error: "API key required" }, 401);
    }

    // Use the injected service
    const key = await apiKeyService.getApiKeyById(apiKey);

    if (!key) {
      return c.json({ error: "Invalid API key" }, 401);
    }

    const result = validateApiKey(c, key);

    if (!result.valid) {
      return c.json({ error: result.error }, 401);
    }

    if (!result.valid) {
      return c.json({ error: result.error }, 401);
    }

    c.set("apiKey", key);
    c.set("gameId", key.gameId);

    apiKeyService.updateLastUsed(apiKey).catch(console.error);
    apiKeyService.logApiKey(apiKey).catch(console.error);
    return next();
  };
}
