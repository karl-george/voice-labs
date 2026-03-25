import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';

/**
 * Create a preconfigured TanStack QueryClient for the application.
 *
 * The client uses a 30-second default query stale time and a dehydrate policy that
 * dehydrates a query when the default policy applies or when the query's state is `'pending'`.
 * Commented placeholders exist for custom serialization and deserialization hooks.
 *
 * @returns A new configured QueryClient instance.
 */

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
}
