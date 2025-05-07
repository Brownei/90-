import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { encryptData } from "@/utils/utils";

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
        profileImage: z.string(),
        email_verified: z.boolean(),
      }),
    )
    .mutation(async ({input, ctx}) => {
      const {email, email_verified, name, profileImage} = input

      const existingUser = await db.select().from(users).where(eq(users.email, input.email))

      if (existingUser[0]) {
        const token = encryptData(JSON.stringify({
          id: existingUser[0].id, 
          email: existingUser[0].email, 
          name: existingUser[0].name, 
          profileImage: existingUser[0].image
        }))
        await ctx.setCookie('session', token)
      } else {
        const newUser = await db.insert(users).values({
          email,
          name,
          emailVerified: email_verified,
          image: profileImage
        }).returning({id: users.id, email: users.email, profileImage: users.image, name: users.name})

        const token = encryptData(JSON.stringify({
        id: newUser[0].id, 
        email: newUser[0].email, 
        name: newUser[0].name,
        profileImage: newUser[0].profileImage
      }))
        await ctx.setCookie('session', token)
      }
    }),
});

