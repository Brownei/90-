import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, boolean, real } from 'drizzle-orm/pg-core';

// User Schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: boolean('email_verified').default(false), // Using text for datetime
  image: text('image'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const usersRelation = relations(users, ({one}) => ({
  wallets: one(wallets)
}))

// Wallet Schema
export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  provider: text('provider').notNull(),
  publicKey: text('public_key').notNull().unique(),
  solanaBalance: real('solana_balance'),
  isMainWallet: boolean('is_main_wallet').notNull().default(false),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const walletsRelations = relations(wallets, ({ one }) => ({
	user: one(users, { fields: [wallets.userId], references: [users.id] }),
}));

// Token Schema
export const tokens = pgTable('tokens', {
  id: text('id').primaryKey(),
  walletId: text('wallet_id').notNull(),
  mintAddress: text('mint_address').notNull(),
  tokenName: text('token_name'),
  symbol: text('symbol'),
  balance: real('balance'),
  decimals: integer('decimals'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

// Define relationships in Drizzle using indexes (SQLite doesn't support FK constraints directly)
// The relationships are implied in the application code 
