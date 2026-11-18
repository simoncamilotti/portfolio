import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
