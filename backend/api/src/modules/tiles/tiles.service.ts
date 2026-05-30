import { Injectable, NotFoundException, Logger, Inject, forwardRef } from '@nestjs/common';
import { TilesRepository } from './tiles.repository';
import { MessagesRepository } from '../messages/messages.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TilesService {
  private readonly logger = new Logger(TilesService.name);

  constructor(
    private readonly repo: TilesRepository,
    @Inject(forwardRef(() => MessagesRepository))
    private readonly messagesRepo: MessagesRepository,
  ) {}

  async create(workspaceId: string, data: { reactFlowId?: string; tileType: string; model?: string; label?: string; positionX: number; positionY: number; width?: number; height?: number }) {
    return this.repo.create(workspaceId, data);
  }

  async findByWorkspace(workspaceId: string) {
    return this.repo.findByWorkspace(workspaceId);
  }

  async findById(id: string, _workspaceId: string) {
    const tile = await this.repo.findById(id);
    if (!tile) throw new NotFoundException('Tile not found');
    return tile;
  }

  async update(id: string, _workspaceId: string, data: { label?: string; model?: string; positionX?: number; positionY?: number; width?: number; height?: number; messageCount?: number; tokensUsed?: number; creditsUsed?: number }) {
    const tile = await this.repo.findById(id);
    if (!tile) throw new NotFoundException('Tile not found');
    if (Object.keys(data).length === 0) return tile;
    return this.repo.update(id, data);
  }

  async resolveWorkspaceId(tileId: string): Promise<string> {
    const tile = await this.repo.findById(tileId);
    if (!tile) throw new NotFoundException('Tile not found');
    return tile.workspaceId;
  }

  async delete(id: string, _workspaceId: string) {
    const tile = await this.repo.findById(id);
    if (!tile) throw new NotFoundException('Tile not found');
    await this.messagesRepo.deleteAllByTile(id);
    await this.repo.delete(id);
    return { deleted: true };
  }

  async getTileMessages(tileId: string, limit = 50) {
    return this.messagesRepo.getRecentByTile(tileId, limit);
  }

  async addMessage(tileId: string, data: { role: 'user' | 'assistant' | 'system'; content: string; tokensIn?: number; tokensOut?: number; model?: string; latencyMs?: number }) {
    const message = await this.messagesRepo.create(tileId, data);
    await this.repo.incrementStats(tileId, data.tokensIn || 0, data.tokensOut || 0);
    return message;
  }
}
