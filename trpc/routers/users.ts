import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db, users, wallets } from "@/lib/db";
import { eq } from "drizzle-orm";
import { encryptData } from "@/utils/utils";
import { PublicKey } from "@solana/web3.js";

export const usersRouter = createTRPCRouter({
  logout: baseProcedure
    .mutation(async ({input, ctx}) => {
      await ctx.deleteCookie('session')
  }),

  login: baseProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        encryptedProvider: z.string(),
        balance: z.number(),
        publicKey: z.string(),
        profileImage: z.string(),
        email_verified: z.boolean(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {email, email_verified, balance, name, encryptedProvider, publicKey, profileImage} = input

      const existingUser = await db.select().from(users).where(eq(users.email, input.email)).leftJoin(wallets, eq(users.id, wallets.userId))

      if (existingUser[0]) {
        const token = encryptData(JSON.stringify({
          id: existingUser[0].users.id, 
          email: existingUser[0].users.email, 
          name: existingUser[0].users.name, 
          profileImage: existingUser[0].users.image,
          publicKey: existingUser[0].wallets?.publicKey,
          balance: existingUser[0].wallets?.solanaBalance,
        }))
        await ctx.setCookie('session', token)

        return token
      } else {
        const newUser = await db.insert(users).values({
          email,
          name,
          emailVerified: email_verified,
          image: profileImage,
        }).returning({id: users.id, email: users.email, profileImage: users.image, name: users.name})

        const newWallet = await db.insert(wallets).values({
          publicKey: publicKey.toString(),
          userId: newUser[0].id,
          isMainWallet: false,
          provider: encryptedProvider,
          solanaBalance: balance,
        }).returning({id: wallets.id, publicKey: wallets.publicKey, provider: wallets.provider, balance: wallets.solanaBalance})

        const token = encryptData(JSON.stringify({
          id: newUser[0].id, 
          email: newUser[0].email, 
          name: newUser[0].name,
          profileImage: newUser[0].profileImage,
          publicKey,
          balance: newWallet[0].balance,
        }))

        await ctx.setCookie('session', token)

        return token;
      }
    }),
});

