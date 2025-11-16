import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import type { GameService } from "./games.service";
import type { CreateGameRoute, GetAllGamesRoute } from "./games.validation";

export class GamesController {
  constructor(private gameService: GameService) { }

  create: AppRouteHandler<CreateGameRoute> = async (c) => {
    const userId = c.get("session")?.userId;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const gameData = c.req.valid("json");

    const gameCreated = await this.gameService.createGame({
      ...gameData,
      userId,
    });

    return c.json(gameCreated, HttpStatusCodes.OK);
  };

  list: AppRouteHandler<GetAllGamesRoute> = async (c) => {
    const userId = c.get("session")?.userId;
    if (!userId) {
      throw new Error("User not logged in");
    }

    const games = await this.gameService.getAllGames(userId);
    return c.json(games, HttpStatusCodes.OK);
  };
}
