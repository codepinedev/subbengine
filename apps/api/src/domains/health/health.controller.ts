import type { AppRouteHandler } from "@/lib/types";

import type { HealthService } from "./health.service";
import type { HealthRoute } from "./health.validation";

export class HealthController {
  constructor(
    private healthService: HealthService,
  ) { }

  health: AppRouteHandler<HealthRoute> = async (c) => {
    const health = await this.healthService.checkHealth();
    return c.json(health);
  };
}
