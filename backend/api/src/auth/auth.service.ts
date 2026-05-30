import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UsersRepository } from '../modules/users/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';

const SESSION_TTL = 604800;
const REFRESH_TTL = 2592000;

interface TokenPayload {
  sub: string;
  email: string;
  plan: string;
  iat: number;
  exp: number;
  jti: string;
}

interface SessionData {
  userId: string;
  email: string;
  plan: string;
  createdAt: number;
  lastActivity: number;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly usersRepository: UsersRepository,
  ) {}

  private get jwtSecret(): string {
    const secret = process.env['JWT_SECRET'];
    if (!secret || secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters');
    }
    return secret;
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async signToken(payload: {
    userId: string;
    email: string;
    plan: string;
  }): Promise<{ accessToken: string; refreshToken: string; expiresAt: number }> {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;
    const jti = uuidv4();

    const headerObj = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
    const bodyObj = JSON.stringify({
      sub: payload.userId,
      email: payload.email,
      plan: payload.plan,
      iat: now,
      exp,
      jti,
    });

    const header = Buffer.from(headerObj).toString('base64url').replace(/=+$/, '');
    const body = Buffer.from(bodyObj).toString('base64url').replace(/=+$/, '');
    const sigInput = `${header}.${body}.${this.jwtSecret}`;
    const sigHash = createHash('sha256').update(sigInput).digest();
    const signature = sigHash.toString('base64url').replace(/=+$/, '');

    const accessToken = `${header}.${body}.${signature}`;
    const refreshToken = uuidv4() + '-' + randomBytes(32).toString('hex');
    const refreshHash = this.hashToken(refreshToken);

    const sessionData: SessionData = {
      userId: payload.userId,
      email: payload.email,
      plan: payload.plan,
      createdAt: now,
      lastActivity: now,
    };

    await Promise.all([
      this.redis.set(this.redis.sessionKey(payload.userId), JSON.stringify(sessionData), SESSION_TTL),
      this.redis.set(`vel:refresh:${refreshHash}`, payload.userId, REFRESH_TTL),
    ]);

    return { accessToken, refreshToken, expiresAt: exp };
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Invalid token format');
    }

    const headerPart = parts[0];
    const bodyPart = parts[1];
    const signaturePart = parts[2];

    if (!headerPart || !bodyPart || !signaturePart) {
      throw new UnauthorizedException('Invalid token format');
    }

    const sigInput = `${headerPart}.${bodyPart}.${this.jwtSecret}`;
    const sigHash = createHash('sha256').update(sigInput).digest();
    const expectedSig = sigHash.toString('base64url').replace(/=+$/, '');

    try {
      const sigBuffer = Buffer.from(signaturePart, 'base64url');
      const expectedBuffer = Buffer.from(expectedSig, 'base64url');
      if (
        sigBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(sigBuffer, expectedBuffer)
      ) {
        throw new UnauthorizedException('Invalid token signature');
      }
    } catch {
      throw new UnauthorizedException('Invalid token signature');
    }

    const decodedBody = Buffer.from(bodyPart, 'base64url').toString();
    const payload = JSON.parse(decodedBody) as TokenPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('Token expired');
    }

    const session = await this.redis.get<string>(this.redis.sessionKey(payload.sub));
    if (!session) {
      throw new UnauthorizedException('Session invalidated');
    }

    return payload;
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }> {
    const refreshHash = this.hashToken(refreshToken);
    const userId = await this.redis.get<string>(`vel:refresh:${refreshHash}`);

    if (!userId) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      await this.redis.del(`vel:refresh:${refreshHash}`);
      throw new UnauthorizedException('User not found');
    }

    await this.redis.del(`vel:refresh:${refreshHash}`);

    return this.signToken({
      userId: user.id,
      email: user.email,
      plan: user.plan,
    });
  }

  async invalidateSession(userId: string): Promise<void> {
    await this.redis.del(this.redis.sessionKey(userId));
  }

  async validateSession(userId: string): Promise<SessionData | null> {
    const session = await this.redis.get<string>(this.redis.sessionKey(userId));
    if (!session) return null;

    const data = JSON.parse(session) as SessionData;
    data.lastActivity = Math.floor(Date.now() / 1000);
    await this.redis.set(this.redis.sessionKey(userId), JSON.stringify(data), SESSION_TTL);

    return data;
  }
}
