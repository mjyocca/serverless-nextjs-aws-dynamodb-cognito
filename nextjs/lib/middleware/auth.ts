import type { Middleware, SWRHook } from 'swr';

export const authMiddleware: Middleware = (useSWRNext: SWRHook) => {
  return (key, fetcher, config) => {
    // Before hook runs...

    // Handle the next middleware, or the `useSWR` hook if this is the last one.
    const swr = useSWRNext(key, fetcher, config);

    // After hook runs...
    return swr;
  };
};
