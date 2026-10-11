import { ErrorState } from '@/components/error-state'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEvents } from '@/hooks/use-events'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { cn } from '@/lib/utils'
import type { EventFilters } from '@/types/event'
import { EventRow } from './event-row'
import { EventsTableEmpty } from './events-table-empty'
import { EventsTableSkeleton } from './events-table-skeleton'
import { SlowNotice } from './slow-notice'

const COLUMNS = [
  { name: 'Timestamp (UTC)', className: 'w-52' },
  { name: 'Agent' },
  { name: 'Tool' },
  { name: 'Status', className: 'w-32' },
  { name: 'Latency', className: 'w-32' },
  { name: '', className: 'w-12' },
]
const ROW_HEIGHT = 48

interface EventsTableProps {
  filters: EventFilters
  hasFilters: boolean
  selectedId: string | null
  onSelect: (id: string) => void
  onClear: () => void
}

export function EventsTable({ filters, hasFilters, selectedId, onSelect, onClear }: EventsTableProps) {
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
      <div onScroll={onScroll} className={cn('flex min-h-0 flex-1 flex-col overflow-auto transition-opacity', query.isPlaceholderData && 'opacity-60')}>
        <Table className="min-w-[800px] table-fixed" aria-busy={query.isPending || query.isFetchingNextPage}>
          <TableHeader className="sticky top-0 z-10 bg-card shadow-[0_1px_0_0_var(--border)]">
            <TableRow className="border-b-0 bg-muted/40 hover:bg-muted/40">
              {COLUMNS.map(({ name, className }) => (
                <TableHead key={name} className={cn('h-11 px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground', className)}>
                  {name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.isPending && <EventsTableSkeleton columns={COLUMNS.length} rows={Math.ceil(window.innerHeight / ROW_HEIGHT)} />}
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
            {query.isFetchingNextPage && <EventsTableSkeleton columns={COLUMNS.length} rows={3} />}
          </TableBody>
        </Table>
        {query.isSuccess && events.length === 0 && <EventsTableEmpty hasFilters={hasFilters} onClear={onClear} />}
      </div>
      <SlowNotice loading={query.isFetching} className="border-t bg-muted/40 px-4 py-2" />
      {query.isFetchNextPageError && (
        <ErrorState message={query.error.message} onRetry={query.fetchNextPage} className="rounded-none border-0 border-t p-4" />
      )}
    </div>
  )
}
