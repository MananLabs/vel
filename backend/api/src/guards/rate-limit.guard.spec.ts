import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HttpException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';
import { RedisService } from '../redis/redis.service';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let mockRedis: Partial<RedisService>;

  function createContext(user: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    mockRedis = {
      incrWithTTL: vi.fn().mockResolvedValue(1),
      rateLimitSecKey: vi.fn((id: string) => `vel:rl:sec:${id}`),
      rateLimitMinKey: vi.fn((id: string) => `vel:rl:min:${id}`),
    };
    guard = new RateLimitGuard(mockRedis as RedisService);
  });

  it('allows request when under limit', async () => {
    const context = createContext({ id: 'u1', plan: 'free' });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(mockRedis.incrWithTTL).toHaveBeenCalledTimes(2);
  });

  it('throws when rate exceeded (per-second)', async () => {
    mockRedis.incrWithTTL = vi.fn().mockResolvedValue(999);
    const context = createContext({ id: 'u1', plan: 'free' });
    await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
  });

  it('returns true when user is not authenticated', async () => {
    const context = createContext(undefined);
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(mockRedis.incrWithTTL).not.toHaveBeenCalled();
  });
});
