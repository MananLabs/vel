require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
require('dotenv').config({ path: '.env' });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new NestLogger('Bootstrap');

  process.on('unhandledRejection', (reason) => {
    logger.warn('Unhandled rejection (non-fatal):', reason instanceof Error ? reason.message : reason);
  });

  const { validateEnvironment } = await import('./common/env');
  const envResult = validateEnvironment();
  if (envResult.warnings.length > 0) {
    logger.warn(`Environment validation found ${envResult.warnings.length} issue(s)`);
  }

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  if (process.env.SENTRY_DSN) {
    const Sentry = await import('@sentry/node');
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),
      environment: process.env.NODE_ENV || 'development',
    });
    logger.log('Sentry initialized');
  }

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3002')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin && (allowedOrigins.includes('*') || allowedOrigins.includes(origin || ''))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Request-ID');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }));

  app.setGlobalPrefix('api/v1');

  app.use('/api/v1/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`VEL AI API running on port ${port}`);
  logger.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  logger.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  logger.warn('⚠ EMAIL VERIFICATION TEMPORARILY DISABLED');
  logger.warn('⚠ ENABLE BEFORE PRODUCTION RELEASE');
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
