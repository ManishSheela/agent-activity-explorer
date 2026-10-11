import { ErrorState } from '@/components/error-state'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEvents } from '@/hooks/use-events'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { cn } from '@/lib/utils'
import type { EventFilters } from '@/types/event'
import { EventRow } from './event-row'
import { EventsTableEmpty } from './events-table-empty'
import { EventsTableFooter } from './events-table-footer'
import { EventsTableSkeleton } from './events-table-skeleton'

const COLUMNS = ['Timestamp (UTC)', 'Agent', 'Tool', 'Status', 'Latency', '']
const ROW_HEIGHT = 48

interface EventsTableProps {
  filters: EventFilters
  selectedId: string | null
  onSelect: (id: string) => void
}

export function EventsTable({ filters, selectedId, onSelect }: EventsTableProps) {
  const query = useEvents(filters)
  const events = query.data?.pages.flatMap((page) => page.items) ?? []
  const { start, end, paddingTop, paddingBottom, onScroll } = useInfiniteScroll({
    count: events.length,
    rowHeight: ROW_HEIGHT,
    canLoadMore: query.hasNextPage && !query.isFetchingNextPage && !query.isFetchNextPageError,
    onLoadMore: query.fetchNextPage,
  })

  if (query.isError && !query.isFetchNextPageError) {
    return <ErrorState message={query.error.message} onRetry={query.refetch} />
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-card">
      <div onScroll={onScroll} className={cn('min-h-0 flex-1 overflow-auto transition-opacity', query.isPlaceholderData && 'opacity-60')}>
        <Table aria-busy={query.isPending || query.isFetchingNextPage}>
          <TableHeader className="sticky top-0 z-10 bg-card shadow-[0_1px_0_0_var(--border)]">
            <TableRow className="border-b-0 bg-muted/40 hover:bg-muted/40">
              {COLUMNS.map((name) => (
                <TableHead key={name} className="h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isPending && <EventsTableSkeleton columns={COLUMNS.length} />}
            {query.isSuccess && events.length === 0 && <EventsTableEmpty columns={COLUMNS.length} />}
            {paddingTop > 0 && (
              <tr aria-hidden>
                <td colSpan={COLUMNS.length} style={{ height: paddingTop }} />
              </tr>
            )}
            {events.slice(start, end).map((event) => (
              <EventRow key={event.id} event={event} selected={event.id === selectedId} onSelect={onSelect} />
            ))}
            {paddingBottom > 0 && (
              <tr aria-hidden>
                <td colSpan={COLUMNS.length} style={{ height: paddingBottom }} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
      <EventsTableFooter
        shown={events.length}
        total={query.data?.pages[0].total}
        hasNextPage={query.hasNextPage}
        isLoadingMore={query.isFetchingNextPage}
        error={query.isFetchNextPageError ? query.error.message : null}
        onLoadMore={query.fetchNextPage}
      />
    </div>
  )
}
