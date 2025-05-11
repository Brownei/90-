import {  createTRPCRouter } from '../init';
import { gameRouter } from './games';
import { usersRouter } from './users';
import { messagesRouter } from './messages';
import { hubsRouter } from './hubs';
import { wagersRouter } from './wagers';

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  users: usersRouter,
  games: gameRouter,
  hubs: hubsRouter,
  wagers: wagersRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
