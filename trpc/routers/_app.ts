import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { externalApiForMatches, formatDate, getTomorrowDate } from '@/utils/utils';


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

  matches: baseProcedure
    .query(async () => {
      const today = formatDate(new Date())
      const tomorrow = getTomorrowDate()
      try {
        const res = await externalApiForMatches(`https://api.football-data.org/v4/competitions/PL/matches/?season=2025&dateFrom=${today}&dateTo=${tomorrow}`)
        console.log(res)
      } catch (err) {
        console.error('Error executing scraper:', err);
        return {
          matches: [],
          count: 0,
          error: 'Failed to fetch matches'
        };
      }
    })
});
// export type definition of API
export type AppRouter = typeof appRouter;
