import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: 'src',
    include: ['**/*.spec.ts', '**/*.test.ts'],
    env: {
      JWT_SECRET: 'test-jwt-secret-at-least-32-chars-long!!',
      JWT_REFRESH_SECRET: 'test-refresh-secret-at-least-32-chars!!',
      DATABASE_URL: 'postgresql://localhost:5432/test',
      REDIS_URL: 'redis://localhost:6379',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/*.test.ts',
        'src/main.ts',
      ],
      thresholds: {
        statements: 50,
        branches: 40,
        functions: 40,
        lines: 50,
      },
    },
  },
  resolve: {
    alias: {
      '@vel-ai/shared': path.resolve(__dirname, '../../packages/shared'),
    },
  },
});
