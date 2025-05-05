import type { Config } from 'drizzle-kit';

export default {
  dialect: 'sqlite',
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
} as Config; 
