import { drizzle } from 'drizzle-orm/postgres-js';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let db: PostgresJsDatabase<typeof schema>;

if (process.env.DATABASE_URL) {
  const client = postgres(process.env.DATABASE_URL, {
    prepare: false,
    ssl: 'require',
  });
  db = drizzle(client, { schema });
} else {
  db = new Proxy(
    {} as PostgresJsDatabase<typeof schema>,
    {
      get(_target, prop) {
        if (prop === 'then') return undefined;
        return (..._args: unknown[]) => {
          throw new Error(
            'Database not configured. Set DATABASE_URL',
          );
        };
      },
    },
  ) as unknown as PostgresJsDatabase<typeof schema>;
}

export { db };
export type DB = PostgresJsDatabase<typeof schema>;
