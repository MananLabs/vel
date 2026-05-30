import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from '../../common/encryption';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly repo: UsersRepository) {}

  async findById(userId: string) {
    return this.repo.getUserById(userId);
  }

  async findByEmail(email: string) {
    return this.repo.getUserByEmail(email);
  }

  async create(data: { email: string; name?: string; avatarUrl?: string }) {
    return this.repo.createUser({
      id: uuidv4(),
      email: data.email,
      name: data.name || '',
      plan: 'free',
      credits: 100,
      emailVerified: false,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
      failedLoginAttempts: 0,
      accountLockedUntil: null,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
    });
  }

  async update(userId: string, data: { email?: string; name?: string; avatarUrl?: string }) {
    const fields: Record<string, unknown> = {};
    if (data.email) fields.email = data.email;
    if (data.name) fields.name = data.name;
    if (Object.keys(fields).length === 0) return;
    await this.repo.updateUser(userId, fields);
  }

  async delete(userId: string) {
    await this.repo.deleteUser(userId);
  }

  async completeOnboarding(userId: string) {
    await this.repo.updateUser(userId, { updatedAt: new Date().toISOString() });
  }

  async updateByokKeys(userId: string, keys: { openaiKey?: string | null; anthropicKey?: string | null }): Promise<void> {
    const fields: Record<string, unknown> = {};
    if (keys.openaiKey !== undefined) {
      fields.byokOpenaiKey = keys.openaiKey ? encrypt(keys.openaiKey) : null;
    }
    if (keys.anthropicKey !== undefined) {
      fields.byokAnthropicKey = keys.anthropicKey ? encrypt(keys.anthropicKey) : null;
    }
    if (Object.keys(fields).length === 0) return;
    await this.repo.updateUser(userId, fields);
  }
}
