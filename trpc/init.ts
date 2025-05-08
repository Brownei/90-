import { initTRPC } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createTRPCContext = cache(async ({ req }: FetchCreateContextFnOptions) => {
  return {
    req,
    // 👇 you can return res-like helpers here
    setCookie: async (name: string, value: string) => {
      const session = await cookies()
      session.set(name, value, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        expires: 60 * 60 * 24 * 7, // 7 days
      });
    },
    deleteCookie: async (name: string) => {
      const session = await cookies()
      const currentSession = session.get(name)?.value as string
      if(currentSession !== undefined) {
        session.delete(name)
      }
    },
  }
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
