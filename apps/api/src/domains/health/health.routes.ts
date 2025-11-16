import { createRouter } from "@/lib/create-app";

import type { HealthController } from "./health.controller";

import { health } from "./health.validation";

export function createHealthRoutes(healthController: HealthController) {
  return createRouter().openapi(health, healthController.health);
}
