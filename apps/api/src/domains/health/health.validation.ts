import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

export const health = createRoute({
  tags: ["Health"],
  method: "get",
  path: "/health",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.object({
      status: z.string(),
    }), "Health Status"),
  },
});

export type HealthRoute = typeof health;
