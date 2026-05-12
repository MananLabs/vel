// ═══════════════════════════════════════════════════════════
// VEL AI — Analytics Service (PostHog)
// ═══════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { db } from '../../database/db';
import { usageEvents } from '../../database/schema';

interface AIUsageEvent {
  userId: string;
  model: string;
  tileType: string;
  workspaceId: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  async recordAIUsage(event: AIUsageEvent): Promise<void> {
    try {
      await db.insert(usageEvents).values({
        userId: event.userId,
        eventType: 'ai_inference',
        model: event.model,
        tileType: event.tileType as 'ai-chat' | 'consensus' | 'terminal' | 'research' | 'docs' | 'slides' | 'website' | 'sheets' | 'cadam' | 'swarm' | 'workflow',
        workspaceId: event.workspaceId,
        tokensIn: event.tokensIn,
        tokensOut: event.tokensOut,
        latencyMs: event.latencyMs,
        metadata: { timestamp: Date.now() },
      });
    } catch (err) {
      this.logger.error(`Failed to record analytics: ${err}`);
    }
  }
}
