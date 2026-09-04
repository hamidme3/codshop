import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || '';

// Connection pool configuration for Next.js 15
let client: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  if (!connectionString) {
    return null;
  }

  try {
    // In production, max 10 connections per server container
    client = postgres(connectionString, {
      max: process.env.NODE_ENV === 'production' ? 10 : 2,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    dbInstance = drizzle(client, { schema });
    return dbInstance;
  } catch (err) {
    console.warn('[Database] Failed to connect to PostgreSQL. Operating in fallback mode.', err);
    return null;
  }
}

export async function isDbConnected(): Promise<boolean> {
  const db = getDb();
  if (!db || !client) return false;
  try {
    await client`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export { schema };
