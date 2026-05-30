import { Injectable, Logger } from '@nestjs/common';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDbService } from '../../database/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

export interface UsageEventRecord {
  id: string;
  userId: string | null;
  eventType: string;
  model: string | null;
  tileType: string | null;
  workspaceId: string | null;
  tokensIn: number | null;
  tokensOut: number | null;
  latencyMs: number | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

@Injectable()
export class UsageEventsRepository {
  private readonly logger = new Logger(UsageEventsRepository.name);
  private readonly tableName: string;

  constructor(private readonly db: DynamoDbService) {
    this.tableName = this.db.getTableNames().usageEvents;
  }

  async create(data: Omit<UsageEventRecord, 'id' | 'createdAt'>): Promise<void> {
    const item: UsageEventRecord = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    try {
      await this.db.getClient().send(new PutCommand({ TableName: this.tableName, Item: item }));
    } catch (error: unknown) {
      this.logger.error(`Failed to record usage event: ${(error as Error).message}`);
    }
  }
}
