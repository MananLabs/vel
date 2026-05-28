import { describe, it, expect, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { PromptLimitGuard } from './prompt-limit.guard';

describe('PromptLimitGuard', () => {
  let guard: PromptLimitGuard;

  function createContext(body: any, user?: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ body, user }),
      }),
    } as unknown as ExecutionContext;
  }

  beforeEach(() => {
    guard = new PromptLimitGuard();
  });

  it('allows request under char limit', async () => {
    const context = createContext(
      { messages: [{ content: 'hello' }] },
      { id: 'u1', plan: 'free' },
    );
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('blocks request over char limit', async () => {
    const longContent = 'x'.repeat(5000);
    const context = createContext(
      { messages: [{ content: longContent }] },
      { id: 'u1', plan: 'free' },
    );
    await expect(guard.canActivate(context)).rejects.toThrow(BadRequestException);
  });

  it('returns true when no messages in body', async () => {
    const context = createContext({});
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('returns true when body is undefined', async () => {
    const context = createContext(undefined);
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
