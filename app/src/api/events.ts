import type { EventDetail, EventFilters, EventsPage } from '@/types/event'
import { http } from './http'

export function getEvents(filters: EventFilters, cursor: string | null, signal?: AbortSignal) {
  const params = new URLSearchParams({ limit: '50' })
  if (filters.q) params.set('q', filters.q)
  filters.agents.forEach((agent) => params.append('agent', agent))
  if (filters.status) params.set('status', filters.status)
  if (cursor) params.set('cursor', cursor)

  return http<EventsPage>(`/events?${params}`, signal)
}

export function getEvent(id: string, signal?: AbortSignal) {
  return http<EventDetail>(`/events/${encodeURIComponent(id)}`, signal)
}

export function getAgents(signal?: AbortSignal) {
  return http<string[]>('/agents', signal)
}
