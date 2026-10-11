import { useSearchParams } from 'react-router'
import { STATUSES, type EventFilters, type Status } from '@/types/event'

export function useEventFilters() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status')

  const filters: EventFilters = {
    q: params.get('q') ?? '',
    agents: params.getAll('agent'),
    status: STATUSES.includes(status as Status) ? (status as Status) : null,
  }

  const hasFilters = filters.q !== '' || filters.agents.length > 0 || filters.status !== null

  function setFilters(changes: Partial<EventFilters>) {
    const next = { ...filters, ...changes }
    const search = new URLSearchParams(params)
    search.delete('q')
    search.delete('agent')
    search.delete('status')
    if (next.q) search.set('q', next.q)
    next.agents.forEach((agent) => search.append('agent', agent))
    if (next.status) search.set('status', next.status)
    setParams(search)
  }

  function clearFilters() {
    setFilters({ q: '', agents: [], status: null })
  }

  return { filters, hasFilters, setFilters, clearFilters }
}
