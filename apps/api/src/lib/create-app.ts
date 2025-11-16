import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import { pinoLogger } from "@/middlewares/pino-logger";

import type { AppBindings } from "./types";

import { auth } from "./auth";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export function createApp() {
  const app = createRouter();

  app.use(
    "/*",
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );

  app.use("/api/v1/*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", session.user);
    c.set("session", session.session);
    return next();
  });

  app.onError(onError);
  app.use(serveEmojiFavicon("😶‍🌫️"));
  app.use(pinoLogger());

  app.notFound(notFound);
  return app;
}
