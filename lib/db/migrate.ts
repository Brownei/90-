import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

async function main() {
  console.log('Migration started...');
  
  const client = createClient({
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  });
  
  const db = drizzle(client);
  
  // This will run the migrations in the migrations folder
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  
  console.log('Migration completed successfully');
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 