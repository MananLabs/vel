import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { MessagesRepository, MessageRecord } from './messages.repository';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(private readonly repo: MessagesRepository) {}

  async create(tileId: string, data: { role: 'user' | 'assistant' | 'system'; content: string; tokensIn?: number; tokensOut?: number; model?: string; latencyMs?: number; metadata?: Record<string, unknown> }) {
    return this.repo.create(tileId, data);
  }

  async findByTile(tileId: string, limit = 100, _offset = 0) {
    return this.repo.findByTile(tileId, limit);
  }

  async findById(id: string, _tileId: string) {
    const message = await this.repo.findById(id);
    if (!message) throw new NotFoundException('Message not found');
    return message;
  }

  async update(id: string, _tileId: string, data: { content?: string; metadata?: Record<string, unknown> }) {
    const message = await this.repo.findById(id);
    if (!message) throw new NotFoundException('Message not found');
    return this.repo.update(id, data);
  }

  async delete(id: string, _tileId: string) {
    const message = await this.repo.findById(id);
    if (!message) throw new NotFoundException('Message not found');
    await this.repo.delete(id);
    return { deleted: true };
  }

  async deleteAllByTile(tileId: string) {
    await this.repo.deleteAllByTile(tileId);
  }

  async getConversationContext(tileId: string, lookbackMessages = 10) {
    return this.repo.getRecentByTile(tileId, lookbackMessages);
  }
}
