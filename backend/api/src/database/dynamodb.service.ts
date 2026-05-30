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
  private readonly client: DynamoDBDocumentClient | null;
  private readonly tables: TableNames;
  private readonly configured: boolean;

  constructor() {
    const region = process.env['AWS_REGION'];

    if (!region) {
      this.logger.warn('DynamoDB not configured — AWS_REGION missing. DynamoDB operations disabled.');
      this.client = null;
      this.configured = false;
      this.tables = {
        users: '',
        workspaces: '',
        conversations: '',
        messages: '',
        tiles: '',
        creditTransactions: '',
        usageEvents: '',
      };
      return;
    }

    // If explicit keys are provided, use them; otherwise rely on default credential chain
    // (shared credentials file, EC2 instance role, ECS task role, etc.)
    const accessKey = process.env['AWS_ACCESS_KEY_ID'];
    const secretKey = process.env['AWS_SECRET_ACCESS_KEY'];

    const clientConfig: ConstructorParameters<typeof DynamoDBClient>[0] = { region };
    if (accessKey && secretKey && !accessKey.startsWith('your-')) {
      clientConfig.credentials = { accessKeyId: accessKey, secretAccessKey: secretKey };
    }

    const baseClient = new DynamoDBClient(clientConfig);

    this.client = DynamoDBDocumentClient.from(baseClient, {
      marshallOptions: { removeUndefinedValues: true, convertClassInstanceToMap: true },
      unmarshallOptions: { wrapNumbers: false },
    });

    this.tables = {
      users: process.env['DYNAMODB_USERS_TABLE'] || 'vel-ai-users',
      workspaces: process.env['DYNAMODB_WORKSPACES_TABLE'] || 'vel-ai-workspaces',
      conversations: process.env['DYNAMODB_CONVERSATIONS_TABLE'] || 'vel-ai-conversations',
      messages: process.env['DYNAMODB_MESSAGES_TABLE'] || 'vel-ai-messages',
      tiles: process.env['DYNAMODB_TILES_TABLE'] || 'vel-ai-tiles',
      creditTransactions: process.env['DYNAMODB_CREDIT_TRANSACTIONS_TABLE'] || 'vel-ai-credit-transactions',
      usageEvents: process.env['DYNAMODB_USAGE_EVENTS_TABLE'] || 'vel-ai-usage-events',
    };

    this.configured = true;
    this.logger.log(`Initialized DynamoDB client in region ${region}`);
  }

  async onModuleInit(): Promise<void> {
    if (!this.configured) return;
    const healthy = await this.healthCheck();
    if (!healthy) {
      this.logger.warn('DynamoDB health check failed — operations may fail at runtime');
    } else {
      this.logger.log('DynamoDB connection verified');
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }

  getClient(): DynamoDBDocumentClient {
    if (!this.client) {
      throw new Error('DynamoDB is not configured. Set AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY.');
    }
    return this.client;
  }

  getTableNames(): TableNames {
    return this.tables;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.send(new ListTablesCommand({ Limit: 1 }));
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`DynamoDB health check failed: ${message}`);
      return false;
    }
  }
}
