import { Logger } from '@nestjs/common';

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  minLength?: number;
  secret: boolean;
}

const REQUIRED_ENV_VARS: EnvVar[] = [
  { name: 'AWS_REGION', required: false, description: 'AWS region for DynamoDB', secret: false },
  { name: 'AWS_ACCESS_KEY_ID', required: false, description: 'AWS access key', secret: true },
  { name: 'AWS_SECRET_ACCESS_KEY', required: false, description: 'AWS secret key', secret: true },
  { name: 'JWT_SECRET', required: true, description: 'JWT signing secret (min 32 chars)', minLength: 32, secret: true },
  { name: 'ENCRYPTION_KEY', required: true, description: 'AES encryption key', minLength: 32, secret: true },
  { name: 'OPENROUTER_API_KEY', required: false, description: 'OpenRouter API key', secret: true },
  { name: 'UPSTASH_REDIS_REST_URL', required: false, description: 'Upstash Redis URL', secret: false },
  { name: 'UPSTASH_REDIS_REST_TOKEN', required: false, description: 'Upstash Redis token', secret: true },
  { name: 'STRIPE_SECRET_KEY', required: false, description: 'Stripe secret key', secret: true },
  { name: 'STRIPE_WEBHOOK_SECRET', required: false, description: 'Stripe webhook secret', secret: true },
  { name: 'R2_ACCOUNT_ID', required: false, description: 'Cloudflare R2 account ID', secret: false },
  { name: 'R2_ACCESS_KEY_ID', required: false, description: 'Cloudflare R2 access key', secret: true },
  { name: 'R2_SECRET_ACCESS_KEY', required: false, description: 'Cloudflare R2 secret key', secret: true },
  { name: 'SENTRY_DSN', required: false, description: 'Sentry DSN', secret: false },
  { name: 'FRONTEND_URL', required: false, description: 'Frontend URL for CORS', secret: false },
];

export function validateEnvironment(): { valid: boolean; warnings: string[] } {
  const logger = new Logger('EnvValidation');
  const warnings: string[] = [];

  if (process.env.NODE_ENV !== 'production') {
    logger.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
  }

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.name];

    if (envVar.required && !value) {
      const msg = `Missing required env var: ${envVar.name} (${envVar.description})`;
      warnings.push(msg);
      logger.warn(msg);
      continue;
    }

    if (value && envVar.minLength && value.length < envVar.minLength) {
      const msg = `${envVar.name} is too short (min ${envVar.minLength} chars, got ${value.length})`;
      warnings.push(msg);
      logger.warn(msg);
    }

    if (value && envVar.secret && envVar.name !== 'JWT_SECRET' && envVar.name !== 'ENCRYPTION_KEY') {
      const prefix = value.substring(0, 8);
      logger.debug(`${envVar.name}=${prefix}...`);
    }
  }

  return { valid: warnings.length === 0, warnings };
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

export function getEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export function getEnvInt(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
}
