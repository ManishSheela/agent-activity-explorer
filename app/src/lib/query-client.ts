import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/api/http'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const isClientError = error instanceof ApiError && error.status >= 400 && error.status < 500
        return !isClientError && failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
  },
})
