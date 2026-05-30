import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { WorkspacesRepository, WorkspaceRecord } from './workspaces.repository';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  constructor(private readonly repo: WorkspacesRepository) {}

  async findAllByUser(userId: string) {
    return this.repo.findAllByUser(userId);
  }

  async findById(id: string, userId: string) {
    const workspace = await this.repo.findById(id);
    if (!workspace || workspace.userId !== userId) {
      throw new NotFoundException('Workspace not found');
    }
    await this.repo.update(id, { lastOpenedAt: new Date().toISOString() });
    return workspace;
  }

  async create(userId: string, data: { name: string; description?: string; templateId?: string }) {
    return this.repo.create(userId, data);
  }

  async update(id: string, userId: string, data: { name?: string; description?: string; canvasState?: unknown; contextGraph?: unknown; tileCount?: number }) {
    const workspace = await this.repo.findById(id);
    if (!workspace || workspace.userId !== userId) {
      throw new NotFoundException('Workspace not found');
    }
    const fields: Partial<Omit<WorkspaceRecord, 'id' | 'userId' | 'createdAt'>> = {};
    if (data.name !== undefined) fields.name = data.name;
    if (data.description !== undefined) fields.description = data.description;
    if (data.canvasState !== undefined) fields.canvasState = data.canvasState;
    if (data.contextGraph !== undefined) fields.contextGraph = data.contextGraph;
    if (data.tileCount !== undefined) fields.tileCount = data.tileCount;
    if (Object.keys(fields).length === 0) return workspace;
    return this.repo.update(id, fields);
  }

  async delete(id: string, userId: string) {
    const workspace = await this.repo.findById(id);
    if (!workspace || workspace.userId !== userId) {
      throw new NotFoundException('Workspace not found');
    }
    await this.repo.delete(id);
    return { deleted: true };
  }

  async verifyOwnership(workspaceId: string, userId: string): Promise<boolean> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(workspaceId)) return true;
    try {
      const workspace = await this.repo.findById(workspaceId);
      return !!workspace && workspace.userId === userId;
    } catch {
      return false;
    }
  }
}
