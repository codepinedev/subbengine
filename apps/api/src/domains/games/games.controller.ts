import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import type { GameService } from "./games.service";
import type { CreateGameRoute, GetAllGamesRoute, UpdateGameRoute } from "./games.validation";

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

  update: AppRouteHandler<UpdateGameRoute> = async (c) => {
    const userId = c.get("session")?.userId;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const { id } = c.req.valid("param");

    const gameData = c.req.valid("json");

    const gameUpdated = await this.gameService.updateGame(id, { ...gameData, userId });

    return c.json(gameUpdated, HttpStatusCodes.OK);
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
