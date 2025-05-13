// Note: Removed server-only import as it's being used from client components
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { cache } from 'react';
import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
import { cookies, headers } from 'next/headers';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.

export const getQueryClient = cache(makeQueryClient);
const syncCaller = appRouter.createCaller({});

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  syncCaller,
  getQueryClient,
);
