import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import type { PlayerService } from "./players.service";
import type {
  CreatePlayersRoute,
  GetAllPlayersRoute,
} from "./players.validation";

export class PlayersController {
  constructor(private playerService: PlayerService) {}

  create: AppRouteHandler<CreatePlayersRoute> = async (c) => {
    const playerData = c.req.valid("json");

    const player = await this.playerService.createPlayer(playerData);
    return c.json(player, HttpStatusCodes.OK);
  };

  list: AppRouteHandler<GetAllPlayersRoute> = async (c) => {
    const players = await this.playerService.getAllPlayers();
    return c.json(players, HttpStatusCodes.OK);
  };
}
