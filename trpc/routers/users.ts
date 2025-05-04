import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";

export const usersRouter = createTRPCRouter({
  createANewUser: baseProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        profileImage: z.string(),
        email_verified: z.boolean(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.name}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof usersRouter;

