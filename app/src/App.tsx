import { lazy, Suspense } from 'react'
import { AppHeader } from '@/components/app-header'
import { EventsFilters } from '@/components/events-filters'
import { EventsTable } from '@/components/events-table'
import { useEventFilters } from '@/hooks/use-event-filters'
import { useSelectedEvent } from '@/hooks/use-selected-event'

const EventDetails = lazy(() => import('@/components/event-details').then((module) => ({ default: module.EventDetails })))

export default function App() {
  const { filters, setFilters, clearFilters } = useEventFilters()
  const { selectedId, selectEvent } = useSelectedEvent()

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeader />
      <div className="relative flex min-h-0 flex-1">
        <main className="flex min-h-0 min-w-0 flex-1 flex-col px-6 pt-8 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Agent Activity</h1>
            <p className="mt-1 text-sm text-muted-foreground">Explore and debug AI agent activity across all systems.</p>
          </div>
          <div className="mt-6">
            <EventsFilters filters={filters} onChange={setFilters} onClear={clearFilters} />
          </div>
          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            <EventsTable filters={filters} selectedId={selectedId} onSelect={selectEvent} />
          </div>
        </main>
        {selectedId && (
          <Suspense fallback={null}>
            <EventDetails id={selectedId} onClose={() => selectEvent(null)} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
