// ═══════════════════════════════════════════════════════════
// VEL AI — Workspace Service
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { db } from '../../database/db';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  async findAllByUser(userId: string) {
    const result = await db.execute(sql`
      SELECT * FROM workspaces WHERE user_id = ${userId} ORDER BY last_opened_at DESC NULLS LAST
    `);
    return Array.isArray(result) ? result : [];
  }

  async findById(id: string, userId: string) {
    const result = await db.execute(sql`
      SELECT * FROM workspaces WHERE id = ${id} AND user_id = ${userId}
    `);
    const rows = Array.isArray(result) ? result : [];

    if (rows.length === 0) {
      throw new NotFoundException('Workspace not found');
    }

    await db.execute(sql`UPDATE workspaces SET last_opened_at = NOW() WHERE id = ${id}`);

    return rows[0];
  }

  async create(
    userId: string,
    data: { name: string; description?: string; templateId?: string },
  ) {
    const shareToken = uuidv4().replace(/-/g, '').slice(0, 16);
    const name = data.name || 'Untitled Workspace';
    const description = data.description || null;
    const templateId = data.templateId || null;

    const result = await db.execute(sql`
      INSERT INTO workspaces (user_id, name, description, template_id, share_token, canvas_state, context_graph, tile_count)
      VALUES (${userId}, ${name}, ${description}, ${templateId}, ${shareToken}, '{"nodes": [], "edges": [], "viewport": {"x": 0, "y": 0, "zoom": 0.85}}', '{"connections": []}', 0)
      RETURNING *
    `);

    return result[0];
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
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.name !== undefined) { updates.push('name = $' + (params.length + 1)); params.push(data.name); }
    if (data.description !== undefined) { updates.push('description = $' + (params.length + 1)); params.push(data.description); }
    if (data.canvasState !== undefined) { updates.push('canvas_state = $' + (params.length + 1)); params.push(JSON.stringify(data.canvasState)); }
    if (data.contextGraph !== undefined) { updates.push('context_graph = $' + (params.length + 1)); params.push(JSON.stringify(data.contextGraph)); }
    if (data.tileCount !== undefined) { updates.push('tile_count = $' + (params.length + 1)); params.push(data.tileCount); }

    if (updates.length === 0) {
      return this.findById(id, userId);
    }

    params.push(id, userId);
    const result = await db.execute(sql`
      UPDATE workspaces SET ${sql.raw(updates.join(', '))}, updated_at = NOW()
      WHERE id = $${params.length - 1} AND user_id = $${params.length}
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : [];
    if (rows.length === 0) {
      throw new NotFoundException('Workspace not found');
    }

    return rows[0];
  }

  async delete(id: string, userId: string) {
    const result = await db.execute(sql`
      DELETE FROM workspaces WHERE id = ${id} AND user_id = ${userId} RETURNING *
    `);
    const rows = Array.isArray(result) ? result : [];
    if (rows.length === 0) {
      throw new NotFoundException('Workspace not found');
    }

    return { deleted: true };
  }

  async findByShareToken(shareToken: string) {
    const result = await db.execute(sql`
      SELECT * FROM workspaces WHERE share_token = ${shareToken} AND is_public = true
    `);
    const rows = Array.isArray(result) ? result : [];
    return rows[0] || null;
  }

  async verifyOwnership(workspaceId: string, userId: string): Promise<boolean> {
    const result = await db.execute(sql`
      SELECT id FROM workspaces WHERE id = ${workspaceId} AND user_id = ${userId}
    `);
    const rows = Array.isArray(result) ? result : [];
    return rows.length > 0;
  }
}
