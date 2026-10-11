import { QueryClient } from '@tanstack/react-query'
import { isRetryable } from '@/lib/api-error'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => failureCount < 2 && isRetryable(error),
      retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 4000) + Math.random() * 250,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})
