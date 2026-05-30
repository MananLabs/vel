import { Injectable, Logger } from '@nestjs/common';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDbService } from '../../database/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

export interface CreditTransactionRecord {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  modelUsed: string | null;
  tokensIn: number | null;
  tokensOut: number | null;
  requestId: string | null;
  createdAt: string;
}

@Injectable()
export class CreditTransactionsRepository {
  private readonly logger = new Logger(CreditTransactionsRepository.name);
  private readonly tableName: string;

  constructor(private readonly db: DynamoDbService) {
    this.tableName = this.db.getTableNames().creditTransactions;
  }

  async create(data: Omit<CreditTransactionRecord, 'id' | 'createdAt'>): Promise<CreditTransactionRecord> {
    const item: CreditTransactionRecord = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
    await this.db.getClient().send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async findByUser(userId: string, limit = 50): Promise<CreditTransactionRecord[]> {
    const { Items } = await this.db.getClient().send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'userId-createdAt-index',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: { ':uid': userId },
      ScanIndexForward: false,
      Limit: limit,
    }));
    return (Items as CreditTransactionRecord[]) ?? [];
  }
}
