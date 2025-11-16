// Common interfaces used across domains

export interface Repository<T, ID = string | number> {
  findById: (id: ID) => Promise<T | null>;
  findMany: (options?: any) => Promise<T[]>;
  create: (data: T) => Promise<T>;
  update: (id: ID, data: Partial<T>) => Promise<T>;
  delete: (id: ID) => Promise<void>;
}

export interface CacheService {
  get: <T>(key: string) => Promise<T | null>;
  set: (key: string, value: any, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
  zadd: (key: string, score: number, member: string) => Promise<void>;
  zrevrange: (key: string, start: number, stop: number, withScores?: boolean) => Promise<string[]>;
  zrevrank: (key: string, member: string) => Promise<number | null>;
  hset: (key: string, data: Record<string, any>) => Promise<void>;
}

export interface QueueService {
  enqueue: (queueName: string, jobName: string, data: any) => Promise<void>;
}

export interface DomainEvent {
  eventType: string;
  aggregateId: string;
  payload: any;
  timestamp: Date;
  version: number;
}
