import { HTTPException } from "hono/http-exception";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import type { PlayerService } from "./players.service";
import type {
  CreatePlayersRoute,
  GetAllPlayersRoute,
  UpdatePlayersRoute,
} from "./players.validation";

export class PlayersController {
  constructor(private playerService: PlayerService) {}

  create: AppRouteHandler<CreatePlayersRoute> = async (c) => {
    const session = c.get("session");

    if (!session)
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED);

    const playerData = c.req.valid("json");

    c.var.logger.info("Creating a player");
    const player = await this.playerService.createPlayer({ ...playerData, userId: session.userId });
    return c.json(player, HttpStatusCodes.OK);
  };

  update: AppRouteHandler<UpdatePlayersRoute> = async (c) => {
    const session = c.get("session");
    if (!session)
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED);

    const { id } = c.req.valid("param");
    const data = c.req.valid("json");

    const player = await this.playerService.updatePlayer(id, { ...data, userId: session.userId });
    return c.json(player, HttpStatusCodes.OK);
  };

  list: AppRouteHandler<GetAllPlayersRoute> = async (c) => {
    const players = await this.playerService.getAllPlayers();
    return c.json(players, HttpStatusCodes.OK);
  };
}
