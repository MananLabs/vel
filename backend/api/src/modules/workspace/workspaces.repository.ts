import { Injectable, Logger } from '@nestjs/common';
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import { DynamoDbService } from '../../database/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

export interface WorkspaceRecord {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  canvasState: unknown;
  contextGraph: unknown;
  templateId: string | null;
  isPublic: boolean;
  shareToken: string | null;
  tileCount: number;
  lastOpenedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class WorkspacesRepository {
  private readonly logger = new Logger(WorkspacesRepository.name);
  private readonly tableName: string;

  constructor(private readonly db: DynamoDbService) {
    this.tableName = this.db.getTableNames().workspaces;
  }

  async create(userId: string, data: { name: string; description?: string; templateId?: string }): Promise<WorkspaceRecord> {
    const now = new Date().toISOString();
    const item: WorkspaceRecord = {
      id: uuidv4(),
      userId,
      name: data.name || 'Untitled Workspace',
      description: data.description || null,
      canvasState: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 0.85 } },
      contextGraph: { connections: [] },
      templateId: data.templateId || null,
      isPublic: false,
      shareToken: uuidv4().replace(/-/g, '').slice(0, 16),
      tileCount: 0,
      lastOpenedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    await this.db.getClient().send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findById(id: string): Promise<WorkspaceRecord | null> {
    const { Item } = await this.db.getClient().send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    return (Item as WorkspaceRecord) ?? null;
  }

  async findAllByUser(userId: string): Promise<WorkspaceRecord[]> {
    const { Items } = await this.db.getClient().send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
    }));
    return ((Items as WorkspaceRecord[]) ?? []).sort((a, b) => (b.lastOpenedAt ?? '').localeCompare(a.lastOpenedAt ?? ''));
  }

  async update(id: string, fields: Partial<Omit<WorkspaceRecord, 'id' | 'userId' | 'createdAt'>>): Promise<WorkspaceRecord> {
    const updates = { ...fields, updatedAt: new Date().toISOString() };
    const keys = Object.keys(updates) as (keyof typeof updates)[];
    const expression = 'SET ' + keys.map((k, i) => `#f${i} = :v${i}`).join(', ');
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    keys.forEach((k, i) => { names[`#f${i}`] = k; values[`:v${i}`] = updates[k]; });

    const { Attributes } = await this.db.getClient().send(new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: expression,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW',
    }));
    return Attributes as WorkspaceRecord;
  }

  async delete(id: string): Promise<void> {
    await this.db.getClient().send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }
}
