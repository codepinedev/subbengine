import { container } from "@/container/container";
import indexRoute from "@/domains/index.routes";

import { createApiKeyRoutes } from "./domains/apiKeys/apikey.routes";
import { createGamesRoutes } from "./domains/games";
import { createHealthRoutes } from "./domains/health";
import { createLeaderboardRoutes } from "./domains/leaderboards";
import { createPlayerRoutes } from "./domains/players";
import { auth } from "./lib/auth";
import configureOpenAPI from "./lib/configure-open-api";
import { createApp } from "./lib/create-app";
import { createApiKeyAuthMiddleware } from "./middlewares/api-key-auth";

const app = createApp();

configureOpenAPI(app);

const allRoutes = [
  indexRoute,
  createLeaderboardRoutes(container.leaderboardController),
  createHealthRoutes(container.healthController),
  createPlayerRoutes(container.playersController),
  createGamesRoutes(container.gamesController),
  createApiKeyRoutes(container.apiKeyController),
];

const sdkRoutes = [
  createLeaderboardRoutes(container.leaderboardController),
  createHealthRoutes(container.healthController),
  createPlayerRoutes(container.playersController),
  createApiKeyRoutes(container.apiKeyController),
];

allRoutes.forEach((route) => {
  app.route("/api/v1", route);
});

// SDK Configuration
const apiKeyAuthMiddleware = createApiKeyAuthMiddleware(
  container.apiKeyService,
);

app.use("/sdk-api/v1/*", apiKeyAuthMiddleware);

sdkRoutes.forEach((route) => {
  app.route("/sdk-api/v1", route);
});

app.use("/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

export default app;
