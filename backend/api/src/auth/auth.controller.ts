import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { db } from '../database/db';
import { users } from '../database/schema';
import type { AuthenticatedRequest } from '../common/types';
import { IsString, IsEmail, MinLength } from 'class-validator';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  name!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, name, password } = dto;
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .then((rows) => rows[0]);

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const passwordHash = await this.hashPassword(password);
    const userId = uuidv4();
    const referralCode = uuidv4().slice(0, 8).toUpperCase();

    await db.insert(users).values({
      id: userId,
      email,
      name: name || null,
      passwordHash,
      referralCode,
      plan: 'free',
      creditsRemaining: 100,
      creditsMonthlyAlloc: 100,
    });

    const tokens = await this.authService.signToken({ userId, email, plan: 'free' });

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      user: { id: userId, email, name, plan: 'free' },
      ...tokens,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        plan: users.plan,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, dto.email));

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = await this.verifyPassword(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.authService.signToken({
      userId: user.id,
      email: user.email,
      plan: user.plan,
    });

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      ...tokens,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshAccessToken(dto.refreshToken);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.invalidateSession(req.user.id);
    res.clearCookie('access_token', COOKIE_OPTIONS);
    res.clearCookie('refresh_token', COOKIE_OPTIONS);
    return { success: true };
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@Req() req: AuthenticatedRequest) {
    return { user: req.user };
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 3600000,
    });
    res.cookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 2592000000,
      path: '/api/v1/auth/refresh',
    });
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = randomBytes(16).toString('hex');
      scrypt(password, salt, 64, (err, key) => {
        if (err) reject(err);
        else resolve(`scrypt:${salt}:${key.toString('hex')}`);
      });
    });
  }

  private verifyPassword(password: string, hash: string): Promise<boolean> {
    const parts = hash.split(':');
    if (parts.length !== 3 || parts[0] !== 'scrypt') {
      return Promise.resolve(false);
    }
    const [, salt, key] = parts;
    return new Promise((resolve) => {
      scrypt(password, salt!, 64, (err, derivedKey) => {
        if (err) resolve(false);
        else resolve(timingSafeEqual(derivedKey, Buffer.from(key!, 'hex')));
      });
    });
  }
}
