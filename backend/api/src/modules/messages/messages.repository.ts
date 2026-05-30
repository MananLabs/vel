import { Injectable, Logger } from '@nestjs/common';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDbService } from '../../database/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

export interface MessageRecord {
  id: string;
  tileId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  tokensIn: number;
  tokensOut: number;
  model: string | null;
  latencyMs: number | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

@Injectable()
export class MessagesRepository {
  private readonly logger = new Logger(MessagesRepository.name);
  private readonly tableName: string;

  constructor(private readonly db: DynamoDbService) {
    this.tableName = this.db.getTableNames().messages;
  }

  async create(tileId: string, data: { role: 'user' | 'assistant' | 'system'; content: string; tokensIn?: number; tokensOut?: number; model?: string; latencyMs?: number; metadata?: Record<string, unknown> }): Promise<MessageRecord> {
    const item: MessageRecord = {
      id: uuidv4(),
      tileId,
      role: data.role,
      content: data.content,
      tokensIn: data.tokensIn || 0,
      tokensOut: data.tokensOut || 0,
      model: data.model || null,
      latencyMs: data.latencyMs || null,
      metadata: data.metadata || null,
      createdAt: new Date().toISOString(),
    };
    await this.db.getClient().send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findByTile(tileId: string, limit = 100): Promise<MessageRecord[]> {
    const { Items } = await this.db.getClient().send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'tileId-createdAt-index',
      KeyConditionExpression: 'tileId = :tid',
      ExpressionAttributeValues: { ':tid': tileId },
      ScanIndexForward: true,
      Limit: limit,
    }));
    return (Items as MessageRecord[]) ?? [];
  }

  async findById(id: string): Promise<MessageRecord | null> {
    const { Item } = await this.db.getClient().send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    return (Item as MessageRecord) ?? null;
  }

  async update(id: string, fields: Partial<Pick<MessageRecord, 'content' | 'metadata'>>): Promise<MessageRecord> {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    const expression = 'SET ' + keys.map((k, i) => `#f${i} = :v${i}`).join(', ');
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    keys.forEach((k, i) => { names[`#f${i}`] = k; values[`:v${i}`] = fields[k]; });
    const { Attributes } = await this.db.getClient().send(new UpdateCommand({
      TableName: this.tableName, Key: { id }, UpdateExpression: expression,
      ExpressionAttributeNames: names, ExpressionAttributeValues: values, ReturnValues: 'ALL_NEW',
    }));
    return Attributes as MessageRecord;
  }

  async delete(id: string): Promise<void> {
    await this.db.getClient().send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }

  async deleteAllByTile(tileId: string): Promise<void> {
    const messages = await this.findByTile(tileId, 1000);
    for (const msg of messages) {
      await this.db.getClient().send(new DeleteCommand({ TableName: this.tableName, Key: { id: msg.id } }));
    }
  }

  async getRecentByTile(tileId: string, limit = 10): Promise<MessageRecord[]> {
    const { Items } = await this.db.getClient().send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'tileId-createdAt-index',
      KeyConditionExpression: 'tileId = :tid',
      ExpressionAttributeValues: { ':tid': tileId },
      ScanIndexForward: false,
      Limit: limit,
    }));
    return ((Items as MessageRecord[]) ?? []).reverse();
  }
}
