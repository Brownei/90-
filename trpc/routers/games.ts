import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { externalFootballApi, formatDate, getTomorrowDate } from '@/utils/utils';
// import { twitterRouter } from './twitter';

export const gameRouter = createTRPCRouter({
  popularLeagues: baseProcedure
    .query(async (opts) => {
      return await externalFootballApi('football-popular-leagues')
    }),

  liveMatches: baseProcedure
    .query(async () => {
      const allLiveGames = await externalFootballApi('football-current-live')
      const filteredGames = allLiveGames.data.response.live.filter((game: any) => game.leagueid === 47 || game.leagueid === 87 || game.leagueid === 42)

      return filteredGames;
    }),

  getAllFixtures: baseProcedure
    .query(async () => {
      const allFixtures = []
      const [premierLeagueGames, championsGames, laligaGames] = await Promise.all([
         externalFootballApi('football-get-all-matches-by-league?leagueid=47'),
        externalFootballApi('football-get-all-matches-by-league?leagueid=42'),
        externalFootballApi('football-get-all-matches-by-league?leagueid=87')
      ])

      const filteredPremierLeagueGames = premierLeagueGames.data.response.matches.filter((match: any) => match.status.started === false)
      const filteredUCLGames = championsGames.data.response.matches.filter((match: any) => match.status.started === false)
      const filteredLaLigaGames = laligaGames.data.response.matches.filter((match: any) => match.status.started === false)

      allFixtures.push(...filteredPremierLeagueGames, ...filteredUCLGames, ...filteredLaLigaGames)

      return allFixtures;
  }),

  getFixturesForPremierLeague: baseProcedure
    .query(async () => {
      const games = await externalFootballApi('football-get-all-matches-by-league?leagueid=47')
      const filteredGames = games.data.response.matches.filter((match: any) => match.status.started === false)

      return filteredGames;
    }),

  getFixturesForLaLiga: baseProcedure
    .query(async () => {
      const games = await externalFootballApi('football-get-all-matches-by-league?leagueid=87')
      const filteredGames = games.data.response.matches.filter((match: any) => match.status.started === false)

      return filteredGames;

    }),

  getFixturesForUCL: baseProcedure
    .query(async () => {
      const games = await externalFootballApi('football-get-all-matches-by-league?leagueid=42')
      const filteredGames = games.data.response.matches.filter((match: any) => match.status.started === false)

      return filteredGames;
    }),

});
export type AppRouter = typeof gameRouter;
