import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Account Schema
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
});

// Session Schema
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  sessionToken: text('session_token').notNull().unique(),
  userId: text('user_id').notNull(),
  expires: text('expires').notNull(), // Using text for datetime
});

// User Schema
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: text('email_verified'), // Using text for datetime
  image: text('image'),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

// VerificationToken Schema
export const verificationTokens = sqliteTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: text('expires').notNull(), // Using text for datetime
});

// Wallet Schema
export const wallets = sqliteTable('wallets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  publicKey: text('public_key').notNull().unique(),
  provider: text('provider').notNull(),
  connectedAt: text('connected_at').notNull().default('CURRENT_TIMESTAMP'),
  lastSignedIn: text('last_signed_in').notNull().default('CURRENT_TIMESTAMP'),
  solanaBalance: real('solana_balance'),
  isMainWallet: integer('is_main_wallet', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

// Token Schema
export const tokens = sqliteTable('tokens', {
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