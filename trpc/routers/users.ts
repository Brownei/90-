import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db, tokens, users, wallets } from "@/lib/db";
import { eq } from "drizzle-orm";
import { decryptData, encryptData } from "@/utils/utils";

export const usersRouter = createTRPCRouter({
  logout: baseProcedure
    .mutation(async ({ input, ctx }) => {
      // await ctx.deleteCookie('session')
    }),

  getEscrowAccount: baseProcedure
    .query(async () => {
      const escrowAccount = await db.select({ address: wallets.publicKey }).from(users).where(eq(users.email, 'building90plus@gmail.com')).innerJoin(wallets, eq(wallets.userId, users.id))
      // const escrowAccount = await db.select({address: wallets.publicKey}).from(users).where(eq(users.email, 'esitibrownson@gmail.com')).innerJoin(wallets, eq(wallets.userId, users.id))

      return escrowAccount
    }),

  getCurrentUser: baseProcedure
    .input(
      z.object({
        email: z.string()
      })
    ).mutation(async ({ input }) => {
      const existingUser = await db.select({ email: users.email, name: users.name, wallet: wallets.publicKey }).from(users).where(eq(users.email, input.email)).leftJoin(wallets, eq(users.id, wallets.userId))

      return existingUser[0]
    }),

  login: baseProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        balance: z.number(),
        publicKey: z.string(),
        profileImage: z.string(),
        email_verified: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, email_verified, balance, name, publicKey, profileImage } = input

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


        return token
      } else {
        const newUser = await db.insert(users).values({
          email,
          name,
          emailVerified: email_verified,
          image: profileImage,
        }).returning({ id: users.id, email: users.email, profileImage: users.image, name: users.name })

        const newWallet = await db.insert(wallets).values({
          publicKey,
          userId: newUser[0].id,
          solanaBalance: balance,
        }).returning({ id: wallets.id, publicKey: wallets.publicKey, balance: wallets.solanaBalance })

        const token = encryptData(JSON.stringify({
          id: newUser[0].id,
          email: newUser[0].email,
          name: newUser[0].name,
          profileImage: newUser[0].profileImage,
          publicKey,
          balance: newWallet[0].balance,
        }))


        return token;
      }
    }),

  getPrivateKey: baseProcedure
    .input(
      z.object({
        email: z.string(),
        provider: z.any()
      })
    )
    .query(async ({ input }) => {
      const { provider } = input
      // 4. Try to extract the private key
      if (typeof provider.request !== "function") {
        throw new Error("Provider does not support request method");
      }

      const privateKey = await provider.request({
        method: "solanaPrivateKey"
      });

      if (!privateKey || typeof privateKey !== "string") {
        throw new Error("Private key not available");
      }

      return privateKey;
    })

});

