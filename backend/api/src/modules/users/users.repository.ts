import { Injectable, Logger } from '@nestjs/common';
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  ConditionalCheckFailedException,
  DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { DynamoDbService } from '../../database/dynamodb.service';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  plan: string;
  credits: number;
  passwordHash?: string;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpiresAt: string | null;
  failedLoginAttempts: number;
  accountLockedUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export type CreateUserInput = Omit<UserRecord, 'updatedAt'>;

@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);
  private readonly tableName: string;

  constructor(private readonly db: DynamoDbService) {
    this.tableName = this.db.getTableNames().users;
  }

  async createUser(input: CreateUserInput): Promise<UserRecord> {
    try {
      await this.db.getClient().send(
        new PutCommand({
          TableName: this.tableName,
          Item: input,
          ConditionExpression: 'attribute_not_exists(id)',
        }),
      );
      return input;
    } catch (error: unknown) {
      if (error instanceof ConditionalCheckFailedException) {
        throw new Error(`User with id ${input.id} already exists`);
      }
      this.logger.error(`Failed to create user: ${(error as Error).message}`);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<UserRecord | null> {
    const { Item } = await this.db.getClient().send(
      new GetCommand({ TableName: this.tableName, Key: { id: userId } }),
    );
    return (Item as UserRecord) ?? null;
  }

  // TODO: Replace ScanCommand with QueryCommand on a GSI (email-index) for production scale.
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const { Items } = await this.db.getClient().send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: { ':email': email },
        Limit: 1,
      }),
    );
    return (Items?.[0] as UserRecord) ?? null;
  }

  async getUserByVerificationToken(token: string): Promise<UserRecord | null> {
    const { Items } = await this.db.getClient().send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'emailVerificationToken = :token',
        ExpressionAttributeValues: { ':token': token },
        Limit: 1,
      }),
    );
    return (Items?.[0] as UserRecord) ?? null;
  }

  async updateUser(userId: string, fields: Partial<Omit<UserRecord, 'id'>>): Promise<UserRecord> {
    const updates = { ...fields, updatedAt: new Date().toISOString() };
    const keys = Object.keys(updates) as (keyof typeof updates)[];

    const expression = 'SET ' + keys.map((k, i) => `#f${i} = :v${i}`).join(', ');
    const names: Record<string, string> = {};
    const values: Record<string, unknown> = {};
    keys.forEach((k, i) => {
      names[`#f${i}`] = k;
      values[`:v${i}`] = updates[k];
    });

    const { Attributes } = await this.db.getClient().send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id: userId },
        UpdateExpression: expression,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      }),
    );
    return Attributes as UserRecord;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.db.getClient().send(
      new DeleteCommand({ TableName: this.tableName, Key: { id: userId } }),
    );
  }

  async userExists(userId: string): Promise<boolean> {
    const { Item } = await this.db.getClient().send(
      new GetCommand({ TableName: this.tableName, Key: { id: userId }, ProjectionExpression: 'id' }),
    );
    return Item !== undefined;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.db.getClient().send(new DescribeTableCommand({ TableName: this.tableName }));
      return true;
    } catch (error: unknown) {
      this.logger.error(`Users table health check failed: ${(error as Error).message}`);
      return false;
    }
  }
}
