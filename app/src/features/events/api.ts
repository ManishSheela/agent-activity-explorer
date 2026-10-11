import { http } from '@/lib/http'
import type { EventDetail, EventFilters, EventsPage } from './types'

export const PAGE_SIZE = 50

export function getEvents(filters: EventFilters, cursor: string | null, signal?: AbortSignal) {
  return http<EventsPage>('/events', {
    params: {
      q: filters.q,
      agent: filters.agents,
      status: filters.status,
      cursor,
      limit: PAGE_SIZE,
    },
    signal,
  })
}

export function getEvent(id: string, signal?: AbortSignal) {
  return http<EventDetail>(`/events/${encodeURIComponent(id)}`, { signal })
}

export function getAgents(signal?: AbortSignal) {
  return http<string[]>('/agents', { signal })
}
