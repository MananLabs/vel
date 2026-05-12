// ═══════════════════════════════════════════════════════════
// VEL AI — Users Service
// ═══════════════════════════════════════════════════════════

import { Injectable, Logger } from '@nestjs/common';
import { db } from '../../database/db';
import { users } from '../../database/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  async findByClerkId(clerkId: string) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId));
    return user || null;
  }

  async createFromClerk(data: {
    clerkId: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  }) {
    const referralCode = uuidv4().slice(0, 8).toUpperCase();

    const [user] = await db
      .insert(users)
      .values({
        clerkId: data.clerkId,
        email: data.email,
        name: data.name || null,
        avatarUrl: data.avatarUrl || null,
        referralCode,
      })
      .returning();

    return user;
  }

  async updateFromClerk(
    clerkId: string,
    data: { email?: string; name?: string; avatarUrl?: string },
  ) {
    await db
      .update(users)
      .set({
        ...(data.email && { email: data.email }),
        ...(data.name && { name: data.name }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
        updatedAt: new Date(),
      })
      .where(eq(users.clerkId, clerkId));
  }

  async deleteByClerkId(clerkId: string) {
    await db.delete(users).where(eq(users.clerkId, clerkId));
  }

  async completeOnboarding(userId: string) {
    await db
      .update(users)
      .set({ onboardingComplete: true, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}
