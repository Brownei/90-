import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
// import { twitterRouter } from './twitter';
import { gameRouter } from './games';
import { usersRouter } from './users';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  users: usersRouter,
  games: gameRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
