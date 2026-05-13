// ═══════════════════════════════════════════════════════════
// VEL AI — Users Service
// ═══════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { db } from '../../database/db';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async findByClerkId(clerkId: string) {
    const result = await db.execute(sql`
      SELECT * FROM users WHERE clerk_id = ${clerkId}
    `);
    const rows = Array.isArray(result) ? result : [];
    return rows[0] || null;
  }

  async createFromClerk(data: {
    clerkId: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  }) {
    const referralCode = uuidv4().slice(0, 8).toUpperCase();
    const name = data.name || null;
    const avatarUrl = data.avatarUrl || null;

    const result = await db.execute(sql`
      INSERT INTO users (clerk_id, email, name, avatar_url, referral_code, plan, credits_remaining, credits_monthly_alloc, credits_used_this_month, onboarding_complete)
      VALUES (${data.clerkId}, ${data.email}, ${name}, ${avatarUrl}, ${referralCode}, 'free', 100, 100, 0, false)
      RETURNING *
    `);

    return result[0];
  }

  async updateFromClerk(
    clerkId: string,
    data: { email?: string; name?: string; avatarUrl?: string },
  ) {
    const updates: string[] = [];
    const params: unknown[] = [];

    if (data.email) { updates.push('email = $' + (params.length + 1)); params.push(data.email); }
    if (data.name) { updates.push('name = $' + (params.length + 1)); params.push(data.name); }
    if (data.avatarUrl) { updates.push('avatar_url = $' + (params.length + 1)); params.push(data.avatarUrl); }

    if (updates.length === 0) return;

    params.push(clerkId);
    await db.execute(sql`
      UPDATE users SET ${sql.raw(updates.join(', '))}, updated_at = NOW()
      WHERE clerk_id = $${params.length}
    `);
  }

  async deleteByClerkId(clerkId: string) {
    await db.execute(sql`DELETE FROM users WHERE clerk_id = ${clerkId}`);
  }

  async completeOnboarding(userId: string) {
    await db.execute(sql`
      UPDATE users SET onboarding_complete = true, updated_at = NOW() WHERE id = ${userId}
    `);
  }
}
