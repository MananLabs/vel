import { Injectable, Logger } from '@nestjs/common';
import { db } from '../../database/db';
import { usageEvents } from '../../database/schema';

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

const ALL_TILE_TYPES = [
  'ai-chat', 'consensus', 'terminal', 'research', 'docs',
  'slides', 'website', 'sheets', 'cadam', 'swarm', 'workflow',
] as const;

type TileType = typeof ALL_TILE_TYPES[number];

function isTileType(value: string): value is TileType {
  return ALL_TILE_TYPES.includes(value as TileType);
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  async recordAIUsage(event: AIUsageEvent): Promise<void> {
    try {
      const values: Record<string, unknown> = {
        userId: UUID_REGEX.test(event.userId) ? event.userId : undefined,
        eventType: 'ai_inference',
        model: event.model,
        tileType: isTileType(event.tileType) ? event.tileType : undefined,
        workspaceId: UUID_REGEX.test(event.workspaceId) ? event.workspaceId : undefined,
        tokensIn: event.tokensIn,
        tokensOut: event.tokensOut,
        latencyMs: event.latencyMs,
        metadata: { timestamp: Date.now() },
      };

      const cleanedValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== undefined)
      );

      await db.insert(usageEvents).values(cleanedValues as typeof usageEvents.$inferInsert);
    } catch (err) {
      this.logger.error(`Failed to record analytics: ${err}`);
    }
  }

  async recordEvent(event: GenericEvent): Promise<void> {
    try {
      const values: Record<string, unknown> = {
        userId: event.userId && UUID_REGEX.test(event.userId) ? event.userId : undefined,
        eventType: event.eventType,
        model: event.model,
        tileType: event.tileType && isTileType(event.tileType) ? event.tileType : undefined,
        workspaceId: event.workspaceId && UUID_REGEX.test(event.workspaceId) ? event.workspaceId : undefined,
        tokensIn: event.tokensIn,
        tokensOut: event.tokensOut,
        latencyMs: event.latencyMs,
        metadata: event.metadata || { timestamp: Date.now() },
      };

      const cleanedValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== undefined)
      );

      await db.insert(usageEvents).values(cleanedValues as typeof usageEvents.$inferInsert);
    } catch (err) {
      this.logger.error(`Failed to record event: ${err}`);
    }
  }
}
