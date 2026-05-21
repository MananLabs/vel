// ═══════════════════════════════════════════════════════════
// VEL AI — Better Auth Configuration
// ═══════════════════════════════════════════════════════════

import { betterAuth } from 'better-auth';
import { dash } from '@better-auth/infra';
import { Pool } from 'pg';

function buildTrustedOrigins(): string[] {
  const origins = new Set<string>();

  // Always trust these
  origins.add('http://localhost:3000');
  origins.add('http://127.0.0.1:3000');
  origins.add('https://vel-ai-seven.vercel.app');

  // Frontend URL from env
  if (process.env.FRONTEND_URL) {
    origins.add(process.env.FRONTEND_URL);
  }

  // ALLOWED_ORIGINS from env (comma-separated)
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach(o => origins.add(o.trim()));
  }

  // Backend URL (for same-origin requests)
  if (process.env.BETTER_AUTH_URL) {
    origins.add(process.env.BETTER_AUTH_URL);
  }

  return Array.from(origins);
}

function createAuth() {
  if (!process.env.DATABASE_URL) {
    console.warn(
      '⚠️  DATABASE_URL not set — Better Auth disabled (auth routes will return 503).',
    );
    return null;
  }

  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    const trustedOrigins = buildTrustedOrigins();
    console.log('✅ Better Auth trustedOrigins:', trustedOrigins);

    return betterAuth({
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
      basePath: '/api/v1/auth',
      secret: process.env.BETTER_AUTH_SECRET,

      database: pool,

      emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        minPasswordLength: 8,
      },

      session: {
        cookieCache: {
          enabled: true,
          maxAge: 60 * 5,
        },
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
      },

      advanced: {
        crossSubDomainCookies: {
          enabled: false,
        },
        defaultCookieAttributes: {
          sameSite: 'none',
          secure: true,
        },
      },

      trustedOrigins,

      plugins: [
        dash({
          apiKey: process.env.BETTER_AUTH_API_KEY,
        }),
      ],
    });
  } catch (error) {
    console.error('❌ Failed to initialize Better Auth:', error);
    return null;
  }
}

export const auth = createAuth();

export type Session = NonNullable<typeof auth> extends { $Infer: { Session: infer S } } ? S : any;
