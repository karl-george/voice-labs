'use client';

// ^-- to make sure we can mount the Provider from a server component
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { createTRPCContext } from '@trpc/tanstack-react-query';
import { useState } from 'react';
import { makeQueryClient } from './query-client';
import type { AppRouter } from './routers/_app';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
/**
 * Selects an environment-appropriate React Query client for use by the app.
 *
 * @returns A `QueryClient` instance; a newly created instance when running on the server, or a shared singleton instance when running in the browser.
 */
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

/**
 * Compute the full URL for the tRPC HTTP endpoint used by the client.
 *
 * On the browser this returns a relative path; on the server it uses the
 * `APP_URL` environment variable when available, otherwise falls back to
 * `http://localhost:3000`.
 *
 * @returns The full URL string for the tRPC endpoint, e.g. `'/api/trpc'` or `'https://example.com/api/trpc'`.
 */
function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.APP_URL) return process.env.APP_URL;
    return 'http://localhost:3000';
  })();
  return `${base}/api/trpc`;
}

/**
 * Provides React Query and tRPC context to its descendant components.
 *
 * Wraps the supplied children with a QueryClientProvider and the module's TRPCProvider so hooks and clients from React Query and tRPC are available to the subtree.
 *
 * @returns A React element that wraps `props.children` with the required QueryClient and tRPC providers.
 */
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          // transformer: superjson, <-- if you use a data transformer
          url: getUrl(),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}