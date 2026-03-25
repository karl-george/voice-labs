/* eslint-disable @typescript-eslint/no-explicit-any */
import 'server-only'; // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy, TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});
// If your router is on a separate server, pass a client:
// createTRPCOptionsProxy({
//   client: createTRPCClient({
//     links: [httpLink({ url: '...' })],
//   }),
//   queryClient: getQueryClient,
/**
 * Wraps children in a hydration boundary that embeds the server's React Query cache for client hydration.
 *
 * @param props.children - React nodes to render inside the hydration boundary
 * @returns A React element containing `props.children` with the query client's dehydrated state applied
 */

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
}

/**
 * Initiates prefetch of the specified tRPC query into the request-scoped QueryClient.
 *
 * @param queryOptions - tRPC/TanStack query options; if `queryKey[1]?.type` is `"infinite"`, performs an infinite prefetch, otherwise performs a standard prefetch
 */
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(queryOptions: T) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
