import {
  Controller, Post, Get, Body, Query, Req, Res,
  HttpCode, HttpStatus, UnauthorizedException, ForbiddenException,
  BadRequestException, UseGuards, Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersRepository } from '../modules/users/users.repository';
import { EmailService } from '../modules/email/email.service';
import type { AuthenticatedRequest } from '../common/types';
import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,128}$/;

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(PASSWORD_REGEX, { message: 'Password must contain uppercase, lowercase, number and special character.' })
  password!: string;

  @IsString()
  @MinLength(1)
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

const COMMON_PASSWORDS = new Set([
  'password', 'password1', '12345678', '123456789', '1234567890',
  'qwerty123', 'admin123', 'letmein1', 'welcome1', 'monkey123',
  'dragon123', 'master123', 'qwerty12', 'login123', 'abc12345',
  'password123', 'admin1234', 'iloveyou1', 'sunshine1', 'princess1',
  'football1', 'charlie1', 'shadow123', 'michael1', 'qwerty1234',
]);

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const VERIFICATION_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    if (COMMON_PASSWORDS.has(dto.password.toLowerCase())) {
      throw new BadRequestException('This password is too common. Please choose a stronger password.');
    }

    const existingUser = await this.usersRepository.getUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const passwordHash = await this.hashPassword(dto.password);
    const userId = uuidv4();
    const verificationToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_MS).toISOString();

    this.logger.log(`[SIGNUP] User email: ${dto.email}`);
    this.logger.log(`[SIGNUP] Verification token generated (length: ${verificationToken.length})`);

    await this.usersRepository.createUser({
      id: userId,
      email: dto.email,
      name: dto.name,
      plan: 'free',
      credits: 100,
      passwordHash,
      // TEMPORARILY DISABLED FOR DEVELOPMENT
      // RE-ENABLE BEFORE PRODUCTION LAUNCH
      emailVerified: true,
      emailVerificationToken: verificationToken,
      emailVerificationExpiresAt: expiresAt,
      failedLoginAttempts: 0,
      accountLockedUntil: null,
      lastLoginAt: null,
      createdAt: new Date().toISOString(),
    });

    // TEMPORARILY DISABLED FOR DEVELOPMENT
    // RE-ENABLE BEFORE PRODUCTION LAUNCH
    // this.logger.log(`[SIGNUP] Sending verification email to ${dto.email}`);
    // await this.emailService.sendVerificationEmail(dto.email, verificationToken);

    return { success: true, message: 'Account created successfully.' };
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    if (!token) throw new BadRequestException('Token required');

    const user = await this.usersRepository.getUserByVerificationToken(token);
    if (!user) throw new BadRequestException('Invalid or expired verification link');

    if (user.emailVerificationExpiresAt && new Date(user.emailVerificationExpiresAt) < new Date()) {
      throw new BadRequestException('Verification link has expired. Please register again.');
    }

    await this.usersRepository.updateUser(user.id, {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null,
    });

    const frontendUrl = process.env['FRONTEND_URL'] || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/sign-in?verified=true`);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersRepository.getUserByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check account lockout
    if (user.accountLockedUntil && new Date(user.accountLockedUntil) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.accountLockedUntil).getTime() - Date.now()) / 60000);
      throw new ForbiddenException(`Account locked. Try again in ${minutesLeft} minutes.`);
    }

    // Verify password
    const valid = await this.verifyPassword(dto.password, user.passwordHash);
    if (!valid) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      const updates: Record<string, unknown> = { failedLoginAttempts: attempts };
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        updates.accountLockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
      }
      await this.usersRepository.updateUser(user.id, updates);
      throw new UnauthorizedException('Invalid email or password');
    }

    // TEMPORARILY DISABLED FOR DEVELOPMENT
    // RE-ENABLE BEFORE PRODUCTION LAUNCH
    // if (!user.emailVerified) {
    //   throw new ForbiddenException('Please verify your email address before signing in.');
    // }

    // Reset failed attempts and update last login
    await this.usersRepository.updateUser(user.id, {
      failedLoginAttempts: 0,
      accountLockedUntil: null,
      lastLoginAt: new Date().toISOString(),
    });

    const tokens = await this.authService.signToken({ userId: user.id, email: user.email, plan: user.plan });
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
      ...tokens,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.refreshAccessToken(dto.refreshToken);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    return tokens;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
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
    res.cookie('access_token', accessToken, { ...COOKIE_OPTIONS, maxAge: 3600000 });
    res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTIONS, maxAge: 2592000000, path: '/api/v1/auth/refresh' });
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
    if (parts.length !== 3 || parts[0] !== 'scrypt') return Promise.resolve(false);
    const [, salt, key] = parts;
    return new Promise((resolve) => {
      scrypt(password, salt!, 64, (err, derivedKey) => {
        if (err) resolve(false);
        else resolve(timingSafeEqual(derivedKey, Buffer.from(key!, 'hex')));
      });
    });
  }
}
