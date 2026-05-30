import { Injectable, Logger } from '@nestjs/common';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDbService } from '../../database/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

export interface TileRecord {
  id: string;
  workspaceId: string;
  reactFlowId: string;
  tileType: string;
  model: string | null;
  label: string | null;
  messageCount: number;
  tokensUsed: number;
  creditsUsed: number;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  createdAt: string;
}

@Injectable()
export class TilesRepository {
  private readonly logger = new Logger(TilesRepository.name);
  private readonly tableName: string;

  constructor(private readonly db: DynamoDbService) {
    this.tableName = this.db.getTableNames().tiles;
  }

  async create(workspaceId: string, data: { reactFlowId?: string; tileType: string; model?: string; label?: string; positionX: number; positionY: number; width?: number; height?: number }): Promise<TileRecord> {
    const item: TileRecord = {
      id: uuidv4(),
      workspaceId,
      reactFlowId: data.reactFlowId || uuidv4(),
      tileType: data.tileType,
      model: data.model || null,
      label: data.label || null,
      messageCount: 0,
      tokensUsed: 0,
      creditsUsed: 0,
      positionX: data.positionX,
      positionY: data.positionY,
      width: data.width || 380,
      height: data.height || 480,
      createdAt: new Date().toISOString(),
    };
    await this.db.getClient().send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findByWorkspace(workspaceId: string): Promise<TileRecord[]> {
    const { Items } = await this.db.getClient().send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'workspaceId-index',
      KeyConditionExpression: 'workspaceId = :wid',
      ExpressionAttributeValues: { ':wid': workspaceId },
    }));
    return (Items as TileRecord[]) ?? [];
  }

  async findById(id: string): Promise<TileRecord | null> {
    const { Item } = await this.db.getClient().send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    return (Item as TileRecord) ?? null;
  }

  async update(id: string, fields: Partial<Omit<TileRecord, 'id' | 'workspaceId' | 'createdAt'>>): Promise<TileRecord> {
    const keys = Object.keys(fields) as (keyof typeof fields)[];
    const expression = 'SET ' + keys.map((k, i) => `#f${i} = :v${i}`).join(', ');
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    keys.forEach((k, i) => { names[`#f${i}`] = k; values[`:v${i}`] = fields[k]; });
    const { Attributes } = await this.db.getClient().send(new UpdateCommand({
      TableName: this.tableName, Key: { id }, UpdateExpression: expression,
      ExpressionAttributeNames: names, ExpressionAttributeValues: values, ReturnValues: 'ALL_NEW',
    }));
    return Attributes as TileRecord;
  }

  async delete(id: string): Promise<void> {
    await this.db.getClient().send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }

  async incrementStats(id: string, tokensIn: number, tokensOut: number): Promise<void> {
    await this.db.getClient().send(new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'SET messageCount = messageCount + :one, tokensUsed = tokensUsed + :tokens',
      ExpressionAttributeValues: { ':one': 1, ':tokens': tokensIn + tokensOut },
    }));
  }
}
