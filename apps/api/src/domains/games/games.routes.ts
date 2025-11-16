import { createRouter } from "@/lib/create-app";

import type { GamesController } from "./games.controller";

import { createGameRoute, getAllGamesRoute } from "./games.validation";

export function createGamesRoutes(gamesController: GamesController) {
  return createRouter()
    .openapi(createGameRoute, gamesController.create)
    .openapi(getAllGamesRoute, gamesController.list);
}
