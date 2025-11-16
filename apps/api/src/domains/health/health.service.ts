import db from "@/infrastructure/database";
import { redis } from "@/infrastructure/redis";

export class HealthService {
  constructor(
  ) { }

  async checkHealth() {
    const redisOk = await redis.ping().then(() => true).catch(() => false);
    const pgOk = await db.execute("SELECT 1").then(() => true).catch(() => false);
    return {
      redis: redisOk ? "🟢" : "🔴",
      postgres: pgOk ? "🟢" : "🔴",
      uptime: process.uptime(),
      status: "ok",
    };
  }
}
