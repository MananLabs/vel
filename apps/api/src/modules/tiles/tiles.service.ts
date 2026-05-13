// ═══════════════════════════════════════════════════════════
// VEL AI — Tiles Service (Tile CRUD + Persistence)
// ═══════════════════════════════════════════════════════════

import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { db } from '../../database/db';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TilesService {
  private readonly logger = new Logger(TilesService.name);

  async create(
    workspaceId: string,
    data: {
      reactFlowId?: string;
      tileType: string;
      model?: string;
      label?: string;
      positionX: number;
      positionY: number;
      width?: number;
      height?: number;
    },
  ) {
    const id = uuidv4();
    const reactFlowId = data.reactFlowId || uuidv4();
    const width = data.width || 380;
    const height = data.height || 480;

    const result = await db.execute(sql`
      INSERT INTO tiles (id, workspace_id, react_flow_id, tile_type, model, label, position_x, position_y, width, height, message_count, tokens_used, credits_used)
      VALUES (${id}, ${workspaceId}, ${reactFlowId}, ${data.tileType}, ${data.model || null}, ${data.label || null}, ${data.positionX}, ${data.positionY}, ${width}, ${height}, 0, 0, 0)
      RETURNING *
    `);

    return result[0];
  }

  async findByWorkspace(workspaceId: string) {
    const result = await db.execute(sql`
      SELECT * FROM tiles WHERE workspace_id = ${workspaceId} ORDER BY created_at DESC
    `);
    return Array.isArray(result) ? result : [];
  }

  async findById(id: string, workspaceId: string) {
    const result = await db.execute(sql`
      SELECT * FROM tiles WHERE id = ${id} AND workspace_id = ${workspaceId}
    `);
    const rows = Array.isArray(result) ? result : [];
    if (rows.length === 0) {
      throw new NotFoundException('Tile not found');
    }
    return rows[0];
  }

  async update(
    id: string,
    workspaceId: string,
    data: {
      label?: string;
      model?: string;
      positionX?: number;
      positionY?: number;
      width?: number;
      height?: number;
      messageCount?: number;
      tokensUsed?: number;
      creditsUsed?: number;
    },
  ) {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.label !== undefined) { updates.push('label = $' + (params.length + 1)); params.push(data.label); }
    if (data.model !== undefined) { updates.push('model = $' + (params.length + 1)); params.push(data.model); }
    if (data.positionX !== undefined) { updates.push('position_x = $' + (params.length + 1)); params.push(data.positionX); }
    if (data.positionY !== undefined) { updates.push('position_y = $' + (params.length + 1)); params.push(data.positionY); }
    if (data.width !== undefined) { updates.push('width = $' + (params.length + 1)); params.push(data.width); }
    if (data.height !== undefined) { updates.push('height = $' + (params.length + 1)); params.push(data.height); }
    if (data.messageCount !== undefined) { updates.push('message_count = $' + (params.length + 1)); params.push(data.messageCount); }
    if (data.tokensUsed !== undefined) { updates.push('tokens_used = $' + (params.length + 1)); params.push(data.tokensUsed); }
    if (data.creditsUsed !== undefined) { updates.push('credits_used = $' + (params.length + 1)); params.push(data.creditsUsed); }

    if (updates.length === 0) {
      return this.findById(id, workspaceId);
    }

    params.push(id, workspaceId);
    const result = await db.execute(sql`
      UPDATE tiles SET ${sql.raw(updates.join(', '))}
      WHERE id = $${params.length - 1} AND workspace_id = $${params.length}
      RETURNING *
    `);
    const rows = Array.isArray(result) ? result : [];
    if (rows.length === 0) {
      throw new NotFoundException('Tile not found');
    }
    return rows[0];
  }

  async delete(id: string, workspaceId: string) {
    const result = await db.execute(sql`
      DELETE FROM tiles WHERE id = ${id} AND workspace_id = ${workspaceId} RETURNING *
    `);
    const rows = Array.isArray(result) ? result : [];
    if (rows.length === 0) {
      throw new NotFoundException('Tile not found');
    }

    await db.execute(sql`DELETE FROM messages WHERE tile_id = ${id}`);

    return { deleted: true };
  }

  async getTileMessages(tileId: string, limit = 50) {
    const result = await db.execute(sql`
      SELECT * FROM messages WHERE tile_id = ${tileId} ORDER BY created_at DESC LIMIT ${limit}
    `);
    return Array.isArray(result) ? result : [];
  }

  async addMessage(
    tileId: string,
    data: {
      role: 'user' | 'assistant' | 'system';
      content: string;
      tokensIn?: number;
      tokensOut?: number;
      model?: string;
      latencyMs?: number;
    },
  ) {
    const id = uuidv4();
    const tokensIn = data.tokensIn || 0;
    const tokensOut = data.tokensOut || 0;

    const result = await db.execute(sql`
      INSERT INTO messages (id, tile_id, role, content, tokens_in, tokens_out, model, latency_ms)
      VALUES (${id}, ${tileId}, ${data.role}, ${data.content}, ${tokensIn}, ${tokensOut}, ${data.model || null}, ${data.latencyMs || null})
      RETURNING *
    `);

    await db.execute(sql`
      UPDATE tiles SET message_count = message_count + 1, tokens_used = tokens_used + ${tokensIn + tokensOut} WHERE id = ${tileId}
    `);

    return result[0];
  }
}