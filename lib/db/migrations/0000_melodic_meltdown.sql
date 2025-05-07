CREATE TABLE "tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_id" text NOT NULL,
	"mint_address" text NOT NULL,
	"token_name" text,
	"symbol" text,
	"balance" real,
	"decimals" integer,
	"created_at" text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	"updated_at" text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"email_verified" boolean DEFAULT false,
	"image" text,
	"created_at" text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	"updated_at" text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"provider" text NOT NULL,
	"public_key" text NOT NULL,
	"solana_balance" real,
	"is_main_wallet" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	"updated_at" text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	CONSTRAINT "wallets_public_key_unique" UNIQUE("public_key")
);
--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;