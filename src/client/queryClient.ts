import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      gcTime: 120_000,
      refetchOnWindowFocus: false,
    },
  },
});
