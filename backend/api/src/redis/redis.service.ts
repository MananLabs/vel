import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Redis } from '@upstash/redis';

export class RedisNotConfiguredError extends Error {
  constructor() {
    super('Redis not configured');
    this.name = 'RedisNotConfiguredError';
  }
}

@Injectable()
export class RedisService implements OnModuleInit {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  onModuleInit(): void {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      this.logger.warn('Redis not configured — running without cache');
      return;
    }
    this.client = new Redis({ url, token });
    this.logger.log('Redis client initialized');
  }

  contextKey(workspaceId: string, tileId: string): string {
    return `vel:ctx:${workspaceId}:${tileId}`;
  }

  sessionKey(userId: string): string {
    return `vel:session:${userId}`;
  }

  rateLimitSecKey(userId: string): string {
    return `vel:rl:sec:${userId}`;
  }

  rateLimitMinKey(userId: string): string {
    return `vel:rl:min:${userId}`;
  }

  creditLockKey(userId: string, requestId: string): string {
    return `vel:creditlock:${userId}:${requestId}`;
  }

  streamStateKey(tileId: string, messageId: string): string {
    return `vel:stream:${tileId}:${messageId}`;
  }

  consensusKey(tileId: string): string {
    return `vel:consensus:${tileId}`;
  }

  private get isAvailable(): boolean {
    return this.client !== null;
  }

  private assertAvailable(): void {
    if (!this.isAvailable) {
      throw new RedisNotConfiguredError();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable) return null;
    return this.client!.get<T>(key);
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!this.isAvailable) return;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.client!.setex(key, ttlSeconds, serialized);
    } else {
      await this.client!.set(key, serialized);
    }
  }

  async setNX(key: string, value: unknown, ttlSeconds: number): Promise<boolean> {
    if (!this.isAvailable) return false;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    const result = await this.client!.set(key, serialized, {
      nx: true,
      ex: ttlSeconds,
    });
    return result === 'OK';
  }

  async del(key: string): Promise<void> {
    if (!this.isAvailable) return;
    await this.client!.del(key);
  }

  async incr(key: string): Promise<number> {
    if (!this.isAvailable) return 0;
    return this.client!.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    if (!this.isAvailable) return;
    await this.client!.expire(key, seconds);
  }

  async incrWithTTL(key: string, ttlSeconds: number): Promise<number> {
    if (!this.isAvailable) return 0;
    const count = await this.client!.incr(key);
    if (count === 1) {
      await this.client!.expire(key, ttlSeconds);
    }
    return count;
  }

  async setContext(workspaceId: string, tileId: string, content: string): Promise<void> {
    const truncated = this.truncateToTokenBudget(content, 1500);
    await this.set(this.contextKey(workspaceId, tileId), truncated, 86400);
  }

  async getContext(workspaceId: string, tileId: string): Promise<string | null> {
    if (!this.isAvailable) return null;
    return this.client!.get<string>(this.contextKey(workspaceId, tileId));
  }

  private truncateToTokenBudget(text: string, maxTokens: number): string {
    const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.slice(-maxChars);
  }
}
