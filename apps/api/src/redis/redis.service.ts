// ═══════════════════════════════════════════════════════════
// VEL AI — Upstash Redis Service
// ═══════════════════════════════════════════════════════════

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client!: Redis;

  onModuleInit(): void {
    this.client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  // ── Key builders ─────────────────────────────────────────

  contextKey(workspaceId: string, tileId: string): string {
    return `ctx:${workspaceId}:${tileId}`;
  }

  sessionKey(userId: string): string {
    return `session:${userId}`;
  }

  rateLimitSecKey(userId: string): string {
    return `rl:sec:${userId}`;
  }

  rateLimitMinKey(userId: string): string {
    return `rl:min:${userId}`;
  }

  creditLockKey(userId: string, requestId: string): string {
    return `creditlock:${userId}:${requestId}`;
  }

  streamStateKey(tileId: string, messageId: string): string {
    return `stream:${tileId}:${messageId}`;
  }

  consensusKey(tileId: string): string {
    return `consensus:${tileId}`;
  }

  // ── Core operations ──────────────────────────────────────

  async get<T>(key: string): Promise<T | null> {
    return this.client.get<T>(key);
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  async setNX(
    key: string,
    value: unknown,
    ttlSeconds: number,
  ): Promise<boolean> {
    const result = await this.client.set(key, JSON.stringify(value), {
      nx: true,
      ex: ttlSeconds,
    });
    return result === 'OK';
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  async incrWithTTL(key: string, ttlSeconds: number): Promise<number> {
    const count = await this.client.incr(key);
    if (count === 1) {
      await this.client.expire(key, ttlSeconds);
    }
    return count;
  }

  // ── Context management ───────────────────────────────────

  async setContext(
    workspaceId: string,
    tileId: string,
    content: string,
  ): Promise<void> {
    const truncated = this.truncateToTokenBudget(content, 1500);
    await this.set(this.contextKey(workspaceId, tileId), truncated, 86400);
  }

  async getContext(
    workspaceId: string,
    tileId: string,
  ): Promise<string | null> {
    return this.client.get<string>(this.contextKey(workspaceId, tileId));
  }

  private truncateToTokenBudget(text: string, maxTokens: number): string {
    const maxChars = maxTokens * 4;
    if (text.length <= maxChars) return text;
    return text.slice(-maxChars);
  }
}
