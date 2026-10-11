import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getAgents, getEvent, getEvents } from './api'
import type { EventFilters } from './types'

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: EventFilters) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  agents: () => [...eventKeys.all, 'agents'] as const,
}

export function eventsQueryOptions(filters: EventFilters) {
  return infiniteQueryOptions({
    queryKey: eventKeys.list(filters),
    queryFn: ({ pageParam, signal }) => getEvents(filters, pageParam, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    placeholderData: keepPreviousData,
  })
}

export function eventQueryOptions(id: string) {
  return queryOptions({
    queryKey: eventKeys.detail(id),
    queryFn: ({ signal }) => getEvent(id, signal),
  })
}

export function agentsQueryOptions() {
  return queryOptions({
    queryKey: eventKeys.agents(),
    queryFn: ({ signal }) => getAgents(signal),
    staleTime: 10 * 60_000,
  })
}
