import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  describe('when Redis is not configured', () => {
    beforeEach(() => {
      service = new RedisService();
    });

    it('get returns null', async () => {
      await expect(service.get('key')).resolves.toBeNull();
    });

    it('set does nothing when client is null', async () => {
      await expect(service.set('key', 'value')).resolves.toBeUndefined();
    });

    it('incrWithTTL returns 0 when client is null', async () => {
      await expect(service.incrWithTTL('key', 60)).resolves.toBe(0);
    });
  });

  describe('when Redis is configured', () => {
    let mockClient: Record<string, ReturnType<typeof vi.fn>>;

    beforeEach(() => {
      mockClient = {
        get: vi.fn(),
        set: vi.fn(),
        setex: vi.fn(),
        incr: vi.fn(),
        expire: vi.fn(),
        del: vi.fn(),
      };
      service = new RedisService();
      (service as any).client = mockClient;
    });

    it('get returns value from client', async () => {
      mockClient.get.mockResolvedValue('stored-value');
      const result = await service.get('my-key');
      expect(result).toBe('stored-value');
      expect(mockClient.get).toHaveBeenCalledWith('my-key');
    });

    it('set works with basic key-value', async () => {
      await service.set('key', 'value');
      expect(mockClient.set).toHaveBeenCalledWith('key', 'value');
    });

    it('set with ttl uses setex', async () => {
      await service.set('key', 'value', 3600);
      expect(mockClient.setex).toHaveBeenCalledWith('key', 3600, 'value');
    });

    it('incrWithTTL calls incr and expire on first increment', async () => {
      mockClient.incr.mockResolvedValue(1);
      await service.incrWithTTL('key', 60);
      expect(mockClient.incr).toHaveBeenCalledWith('key');
      expect(mockClient.expire).toHaveBeenCalledWith('key', 60);
    });

    it('incrWithTTL does not call expire on subsequent increments', async () => {
      mockClient.incr.mockResolvedValue(3);
      await service.incrWithTTL('key', 60);
      expect(mockClient.incr).toHaveBeenCalledWith('key');
      expect(mockClient.expire).not.toHaveBeenCalled();
    });
  });

  describe('key builders', () => {
    beforeEach(() => {
      service = new RedisService();
    });

    it('sessionKey returns vel:session:u1', () => {
      expect(service.sessionKey('u1')).toBe('vel:session:u1');
    });

    it('rateLimitSecKey returns vel:rl:sec:u1', () => {
      expect(service.rateLimitSecKey('u1')).toBe('vel:rl:sec:u1');
    });

    it('rateLimitMinKey returns vel:rl:min:u1', () => {
      expect(service.rateLimitMinKey('u1')).toBe('vel:rl:min:u1');
    });

    it('contextKey returns vel:ctx:w1:t1', () => {
      expect(service.contextKey('w1', 't1')).toBe('vel:ctx:w1:t1');
    });

    it('creditLockKey returns vel:creditlock:u1:req1', () => {
      expect(service.creditLockKey('u1', 'req1')).toBe('vel:creditlock:u1:req1');
    });

    it('streamStateKey returns vel:stream:t1:m1', () => {
      expect(service.streamStateKey('t1', 'm1')).toBe('vel:stream:t1:m1');
    });

    it('consensusKey returns vel:consensus:t1', () => {
      expect(service.consensusKey('t1')).toBe('vel:consensus:t1');
    });
  });
});
