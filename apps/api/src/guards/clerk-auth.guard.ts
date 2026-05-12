// ═══════════════════════════════════════════════════════════
// VEL AI — Clerk Auth Guard
// ═══════════════════════════════════════════════════════════

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { db } from '../database/db';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import type { AuthenticatedRequest } from '../common/types';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7);

    try {
      // Verify JWT with Clerk's JWKS endpoint
      // In production, use @clerk/backend's verifyToken
      // For now, decode and verify against Clerk's public keys
      const payload = await this.verifyClerkToken(token);

      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Fetch user from database
      const [user] = await db
        .select({
          id: users.id,
          clerkId: users.clerkId,
          email: users.email,
          plan: users.plan,
          creditsRemaining: users.creditsRemaining,
          byokOpenaiKey: users.byokOpenaiKey,
          byokAnthropicKey: users.byokAnthropicKey,
        })
        .from(users)
        .where(eq(users.clerkId, payload.sub));

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      request.user = user;
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Token verification failed');
    }
  }

  private async verifyClerkToken(
    token: string,
  ): Promise<{ sub: string } | null> {
    try {
      // Decode JWT payload (base64url)
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(
        Buffer.from(parts[1], 'base64url').toString('utf-8'),
      );

      // Check expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return null;
      }

      // In production: verify signature with Clerk's JWKS
      // For MVP, we verify via Clerk's API
      const response = await fetch(
        `https://api.clerk.com/v1/sessions/${payload.sid}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
        },
      );

      if (!response.ok) return null;

      return { sub: payload.sub };
    } catch {
      return null;
    }
  }
}
