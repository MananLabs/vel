import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { UsersRepository } from '../users/users.repository';
import { CreditTransactionsRepository } from './credit-transactions.repository';
import { getModel } from '@vel-ai/shared/types/models';

type CreditTxReason = 'ai_inference' | 'consensus_mode' | 'research_agent' | 'monthly_allocation' | 'top_up' | 'referral' | 'admin_grant' | 'refund';

@Injectable()
export class CreditsService {
  private readonly logger = new Logger(CreditsService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly usersRepo: UsersRepository,
    private readonly txRepo: CreditTransactionsRepository,
  ) {}

  async reserveCredits(userId: string, requestId: string, modelId: string): Promise<number> {
    const model = getModel(modelId);
    if (!model) throw new ForbiddenException('Unknown model');

    const estimatedCredits = model.creditsPerMessage;
    const lockKey = this.redis.creditLockKey(userId, requestId);

    const locked = await this.redis.setNX(lockKey, { credits: estimatedCredits, modelId }, 30);
    if (!locked) throw new ForbiddenException('Request already in flight');

    const user = await this.usersRepo.getUserById(userId);
    if (!user || user.credits < estimatedCredits) {
      await this.redis.del(lockKey);
      throw new ForbiddenException('Insufficient credits');
    }

    return estimatedCredits;
  }

  async finalizeDeduction(userId: string, requestId: string, modelId: string, tokensIn: number, tokensOut: number): Promise<void> {
    const model = getModel(modelId);
    const creditsToDeduct = model?.creditsPerMessage || 5;

    const user = await this.usersRepo.getUserById(userId);
    if (user) {
      await this.usersRepo.updateUser(userId, { credits: user.credits - creditsToDeduct });
    }

    await this.txRepo.create({
      userId,
      amount: -creditsToDeduct,
      reason: 'ai_inference',
      modelUsed: modelId,
      tokensIn,
      tokensOut,
      requestId,
    });

    await this.redis.del(this.redis.creditLockKey(userId, requestId));
  }

  async releaseReservation(userId: string, requestId: string): Promise<void> {
    await this.redis.del(this.redis.creditLockKey(userId, requestId));
  }

  async getBalance(userId: string): Promise<number> {
    const user = await this.usersRepo.getUserById(userId);
    return user?.credits ?? 0;
  }

  async addCredits(userId: string, amount: number, reason: CreditTxReason): Promise<void> {
    const user = await this.usersRepo.getUserById(userId);
    if (user) {
      await this.usersRepo.updateUser(userId, { credits: user.credits + amount });
    }
    await this.txRepo.create({ userId, amount, reason, modelUsed: null, tokensIn: null, tokensOut: null, requestId: null });
  }
}
