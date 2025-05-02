import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Database singleton to prevent multiple instances in development
// Similar to how Prisma client is handled
let db: ReturnType<typeof createDrizzleClient>;

function createDrizzleClient() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  });
  
  return drizzle(client, { schema });
}

// For Node.js environments, avoid creating multiple connections
// during development when hot reloading
if (process.env.NODE_ENV === 'production') {
  db = createDrizzleClient();
} else {
  // In development, create a single client instance and reuse it
  const globalWithDb = global as unknown as { db: ReturnType<typeof createDrizzleClient> };
  if (!globalWithDb.db) {
    globalWithDb.db = createDrizzleClient();
  }
  db = globalWithDb.db;
}

export { db };
export * from './schema'; 