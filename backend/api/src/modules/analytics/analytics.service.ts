import { Injectable, Logger } from '@nestjs/common';
import { UsageEventsRepository } from './usage-events.repository';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface AIUsageEvent {
  userId: string;
  model: string;
  tileType: string;
  workspaceId: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
}

interface GenericEvent {
  userId: string;
  eventType: string;
  model?: string;
  tileType?: string;
  workspaceId?: string;
  tokensIn?: number;
  tokensOut?: number;
  latencyMs?: number;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly repo: UsageEventsRepository) {}

  async recordAIUsage(event: AIUsageEvent): Promise<void> {
    await this.repo.create({
      userId: UUID_REGEX.test(event.userId) ? event.userId : null,
      eventType: 'ai_inference',
      model: event.model,
      tileType: event.tileType || null,
      workspaceId: UUID_REGEX.test(event.workspaceId) ? event.workspaceId : null,
      tokensIn: event.tokensIn,
      tokensOut: event.tokensOut,
      latencyMs: event.latencyMs,
      metadata: { timestamp: Date.now() },
    });
  }

  async recordEvent(event: GenericEvent): Promise<void> {
    await this.repo.create({
      userId: event.userId && UUID_REGEX.test(event.userId) ? event.userId : null,
      eventType: event.eventType,
      model: event.model || null,
      tileType: event.tileType || null,
      workspaceId: event.workspaceId && UUID_REGEX.test(event.workspaceId) ? event.workspaceId : null,
      tokensIn: event.tokensIn || null,
      tokensOut: event.tokensOut || null,
      latencyMs: event.latencyMs || null,
      metadata: event.metadata || { timestamp: Date.now() },
    });
  }
}
