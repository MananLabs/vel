import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

interface TableNames {
  users: string;
  workspaces: string;
  conversations: string;
  messages: string;
  tiles: string;
  creditTransactions: string;
  usageEvents: string;
}

@Injectable()
export class DynamoDbService implements OnModuleInit {
  private readonly logger = new Logger(DynamoDbService.name);
  private readonly client: DynamoDBDocumentClient;
  private readonly tables: TableNames;

  constructor() {
    const region = this.requireEnv('AWS_REGION');
    this.requireEnv('AWS_ACCESS_KEY_ID');
    this.requireEnv('AWS_SECRET_ACCESS_KEY');

    const baseClient = new DynamoDBClient({ region });

    this.client = DynamoDBDocumentClient.from(baseClient, {
      marshallOptions: { removeUndefinedValues: true, convertClassInstanceToMap: true },
      unmarshallOptions: { wrapNumbers: false },
    });

    this.tables = {
      users: this.requireEnv('DYNAMODB_USERS_TABLE'),
      workspaces: this.requireEnv('DYNAMODB_WORKSPACES_TABLE'),
      conversations: this.requireEnv('DYNAMODB_CONVERSATIONS_TABLE'),
      messages: this.requireEnv('DYNAMODB_MESSAGES_TABLE'),
      tiles: this.requireEnv('DYNAMODB_TILES_TABLE'),
      creditTransactions: this.requireEnv('DYNAMODB_CREDIT_TRANSACTIONS_TABLE'),
      usageEvents: this.requireEnv('DYNAMODB_USAGE_EVENTS_TABLE'),
    };

    this.logger.log(`Initialized DynamoDB client in region ${region}`);
  }

  async onModuleInit(): Promise<void> {
    const healthy = await this.healthCheck();
    if (!healthy) {
      throw new Error('DynamoDB health check failed during startup');
    }
    this.logger.log('DynamoDB connection verified');
  }

  getClient(): DynamoDBDocumentClient {
    return this.client;
  }

  getTableNames(): TableNames {
    return this.tables;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.send(new ListTablesCommand({ Limit: 1 }));
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`DynamoDB health check failed: ${message}`);
      return false;
    }
  }

  private requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
}
