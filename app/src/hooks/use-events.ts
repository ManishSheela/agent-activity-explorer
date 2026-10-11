import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getAgents, getEvent, getEvents } from '@/api/events'
import type { EventFilters } from '@/types/event'

export function useEvents(filters: EventFilters) {
  return useInfiniteQuery({
    queryKey: ['events', filters],
    queryFn: ({ pageParam, signal }) => getEvents(filters, pageParam, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: ({ signal }) => getEvent(id, signal),
  })
}

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: ({ signal }) => getAgents(signal),
  })
}
