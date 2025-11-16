import { createRouter } from "@/lib/create-app";

import type { PlayersController } from "./players.controller";

import { createPlayersRoute, getAllPlayersRoute } from "./players.validation";

export function createPlayerRoutes(playerController: PlayersController) {
  return createRouter()
    .openapi(createPlayersRoute, playerController.create)
    .openapi(getAllPlayersRoute, playerController.list);
}
