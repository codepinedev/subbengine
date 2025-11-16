import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Logger } from "pino";

import type { auth } from "@/lib/auth";

import type { ApiKey } from "../apiKeys/apikey.types";

export interface AppBindings {
  Variables: {
    logger: Logger;
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
    apiKey?: ApiKey;
    gameId?: string;
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
