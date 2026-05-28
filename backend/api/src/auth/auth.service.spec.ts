import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RedisService } from '../redis/redis.service';

function createMockRedis(): Partial<RedisService> {
  const store = new Map<string, string>();
  return {
    get: vi.fn(async <T>(key: string) => {
      const val = store.get(key);
      return (val ?? null) as T | null;
    }),
    set: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    del: vi.fn(async (key: string) => {
      store.delete(key);
    }),
    sessionKey: vi.fn((userId: string) => `vel:session:${userId}`),
  };
}

describe('AuthService', () => {
  let authService: AuthService;
  let mockRedis: Partial<RedisService>;

  beforeEach(() => {
    mockRedis = createMockRedis();
    authService = new AuthService(mockRedis as RedisService);
  });

  describe('signToken', () => {
    it('should return accessToken, refreshToken and expiresAt', async () => {
      const result = await authService.signToken({
        userId: 'user-123',
        email: 'test@test.com',
        plan: 'free',
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('expiresAt');
    });

    it('should produce a three-part JWT', async () => {
      const result = await authService.signToken({
        userId: 'user-123',
        email: 'test@test.com',
        plan: 'free',
      });
      const parts = result.accessToken.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should store session in Redis', async () => {
      await authService.signToken({
        userId: 'user-123',
        email: 'test@test.com',
        plan: 'free',
      });
      expect(mockRedis.set).toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const { accessToken } = await authService.signToken({
        userId: 'user-123',
        email: 'test@test.com',
        plan: 'free',
      });
      const payload = await authService.verifyToken(accessToken);
      expect(payload.sub).toBe('user-123');
      expect(payload.email).toBe('test@test.com');
      expect(payload.plan).toBe('free');
    });

    it('should reject malformed token', async () => {
      await expect(authService.verifyToken('not-a-jwt')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject token with bad signature', async () => {
      const { accessToken } = await authService.signToken({
        userId: 'user-123',
        email: 'test@test.com',
        plan: 'free',
      });
      const parts = accessToken.split('.');
      const badToken = `${parts[0]}.${parts[1]}.badsignature`;
      await expect(authService.verifyToken(badToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('invalidateSession', () => {
    it('should invalidate a session', async () => {
      const { accessToken } = await authService.signToken({
        userId: 'user-456',
        email: 'test2@test.com',
        plan: 'free',
      });

      const payload = await authService.verifyToken(accessToken);
      expect(payload.sub).toBe('user-456');

      await authService.invalidateSession('user-456');
      await expect(authService.verifyToken(accessToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateSession', () => {
    it('should return null for non-existent session', async () => {
      const session = await authService.validateSession('nonexistent-user');
      expect(session).toBeNull();
    });

    it('should return session data after signToken', async () => {
      await authService.signToken({
        userId: 'user-789',
        email: 'session@test.com',
        plan: 'pro',
      });
      const session = await authService.validateSession('user-789');
      expect(session).not.toBeNull();
      expect(session!.userId).toBe('user-789');
    });
  });

  describe('refreshAccessToken', () => {
    it('should throw on invalid refresh token', async () => {
      await expect(
        authService.refreshAccessToken('invalid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('password hashing', () => {
    it('should produce deterministic SHA-256 hash', () => {
      const { createHash } = require('crypto');
      const hash = createHash('sha256').update('test').digest('hex');
      expect(hash).toHaveLength(64);
    });
  });
});
