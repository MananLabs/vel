// ═══════════════════════════════════════════════════════════
// VEL AI — Workspace Service
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { db } from '../../database/db';
import { workspaces } from '../../database/schema';
import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  async findAllByUser(userId: string) {
    return db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, userId))
      .orderBy(desc(workspaces.lastOpenedAt));
  }

  async findById(id: string, userId: string) {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, id), eq(workspaces.userId, userId)));

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    // Update last opened
    await db
      .update(workspaces)
      .set({ lastOpenedAt: new Date() })
      .where(eq(workspaces.id, id));

    return workspace;
  }

  async create(
    userId: string,
    data: { name: string; description?: string; templateId?: string },
  ) {
    const shareToken = uuidv4().replace(/-/g, '').slice(0, 16);

    const [workspace] = await db
      .insert(workspaces)
      .values({
        userId,
        name: data.name,
        description: data.description || null,
        templateId: data.templateId || null,
        shareToken,
        canvasState: {
          nodes: [],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 0.85 },
        },
        contextGraph: { connections: [] },
      })
      .returning();

    return workspace;
  }

  async update(
    id: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      canvasState?: unknown;
      contextGraph?: unknown;
      tileCount?: number;
    },
  ) {
    const [workspace] = await db
      .update(workspaces)
      .set({
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.canvasState !== undefined && { canvasState: data.canvasState }),
        ...(data.contextGraph !== undefined && { contextGraph: data.contextGraph }),
        ...(data.tileCount !== undefined && { tileCount: data.tileCount }),
        updatedAt: new Date(),
      })
      .where(and(eq(workspaces.id, id), eq(workspaces.userId, userId)))
      .returning();

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    return workspace;
  }

  async delete(id: string, userId: string) {
    const result = await db
      .delete(workspaces)
      .where(and(eq(workspaces.id, id), eq(workspaces.userId, userId)))
      .returning();

    if (!result.length) {
      throw new NotFoundException('Workspace not found');
    }

    return { deleted: true };
  }

  async findByShareToken(shareToken: string) {
    const [workspace] = await db
      .select()
      .from(workspaces)
      .where(
        and(
          eq(workspaces.shareToken, shareToken),
          eq(workspaces.isPublic, true),
        ),
      );
    return workspace || null;
  }
}
