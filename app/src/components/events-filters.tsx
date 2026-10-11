import { X } from 'lucide-react'
import { AgentFilter } from '@/components/agent-filter'
import { SearchInput } from '@/components/search-input'
import { StatusFilter } from '@/components/status-filter'
import { Button } from '@/components/ui/button'
import type { EventFilters } from '@/types/event'

interface EventsFiltersProps {
  filters: EventFilters
  onChange: (changes: Partial<EventFilters>) => void
  onClear: () => void
}

export function EventsFilters({ filters, onChange, onClear }: EventsFiltersProps) {
  const hasFilters = filters.q !== '' || filters.agents.length > 0 || filters.status !== null

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput value={filters.q} onSearch={(q) => onChange({ q })} />
      <AgentFilter selected={filters.agents} onChange={(agents) => onChange({ agents })} />
      <StatusFilter value={filters.status} onChange={(status) => onChange({ status })} />
      {hasFilters && (
        <Button variant="ghost" onClick={onClear}>
          <X className="size-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
