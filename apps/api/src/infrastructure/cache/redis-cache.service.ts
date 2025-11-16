import type { CacheService } from "@/domains/shared/interfaces";

import { redis } from "@/infrastructure/redis";

export class RedisCacheService implements CacheService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await redis.setex(key, ttl, serialized);
    }
    else {
      await redis.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  async zadd(key: string, score: number, member: string): Promise<void> {
    await redis.zadd(key, score, member);
  }

  async zrevrange(
    key: string,
    start: number,
    stop: number,
    withScores = false,
  ): Promise<string[]> {
    if (withScores) {
      return redis.zrevrange(key, start, stop, "WITHSCORES");
    }
    return redis.zrevrange(key, start, stop);
  }

  async zrevrank(key: string, member: string): Promise<number | null> {
    return redis.zrevrank(key, member);
  }

  async hset(key: string, data: Record<string, any>): Promise<void> {
    await redis.hset(key, data);
  }
}
