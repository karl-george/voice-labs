import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  health: baseProcedure.query(async () => {
    // Uncomment to see how the app is handling errors
    // throw new Error('Something went wrong!');

    // Uncomment to see Suspense loading state
    // await new Promise((resolve) => setTimeout(resolve, 5000));

    return { status: 'ok' };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
