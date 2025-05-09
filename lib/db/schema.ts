import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, boolean, real } from 'drizzle-orm/pg-core';
import { finished } from 'stream';

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

export const usersRelation = relations(users, ({one, many}) => ({
  wallets: one(wallets, {
    fields: [users.id],
    references: [wallets.userId]
  }),
  for: many(wagers, {relationName: 'for'}),
  against: many(wagers, {relationName: 'against'}),
  comments: many(comments),
  replies: many(replies),
}))

// Wallet Schema
export const wallets = pgTable('wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  provider: text('provider').notNull(),
  publicKey: text('public_key').notNull().unique(),
  solanaBalance: real('solana_balance'),
  isMainWallet: boolean('is_main_wallet').notNull().default(false),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
});

export const walletsRelations = relations(wallets, ({ one }) => ({
	owner: one(users, { fields: [wallets.userId], references: [users.id] }),
}));

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id),
  hubId: integer('hub_id').references(() => hubs.id),
    createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const commentsRelations = relations(comments, ({ one, many }) => ({
	author: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
  hub: one(hubs, {
    fields: [comments.hubId],
    references: [hubs.id]
  }),
  replies: many(replies),
}));

export const replies = pgTable('replies', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  commentId: integer('comment_id').references(() => comments.id),
  userId: integer('user_id').references(() => users.id),
    createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const repliesRelations = relations(replies, ({ one }) => ({
	author: one(users, {
		fields: [replies.userId],
		references: [users.id],
	}),
  comments: one(comments, {
    fields: [replies.commentId],
    references: [comments.id]
  })
}));

export const hubs = pgTable('hubs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  isGameFinished: boolean('is_game_finished').default(false),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const hubsRelations = relations(hubs, ({one, many}) => ({
  teams: one(teams, {
    fields: [hubs.id],
    references: [teams.hubId], // make sure this matches your foreign key
  }),
  comments: many(comments),
  wagers: many(wagers),
}))

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  hubId: integer('hub_id').references(() => hubs.id),
  home: text('home').notNull(),
  away: text('away').notNull(),
  startTime: text('start_time').notNull(),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export const teamsRelations = relations(teams, ({ one }) => ({
	owner: one(hubs, { fields: [teams.hubId], references: [hubs.id] }),
}));

export const wagers = pgTable('wagers', {
  id: serial('id').primaryKey(),
  for: integer('for').references(() => users.id),
  against: integer('against').references(() => users.id),
  hubId: integer('hub_id').references(() => hubs.id),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
  isOpen: boolean('is_open').default(true),
  amount: integer('amount').notNull(),
  condition: text('condition').notNull(),
})

export const wagersRelations = relations(wagers, ({ one }) => ({
	owner: one(hubs, { fields: [wagers.hubId], references: [hubs.id] }),
  for: one(users, {fields: [wagers.for], references: [users.id], relationName: 'for'}),
  against: one(users, {fields: [wagers.against], references: [users.id], relationName: 'against'})
}));

// Token Schema
// export const tokens = pgTable('tokens', {
//   id: text('id').primaryKey(),
//   walletId: text('wallet_id').notNull(),
//   mintAddress: text('mint_address').notNull(),
//   tokenName: text('token_name'),
//   symbol: text('symbol'),
//   balance: real('balance'),
//   decimals: integer('decimals'),
//   createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
//   updatedAt: text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
// });
