import { Button } from '@/components/ui/button'

interface EventsTableFooterProps {
  shown: number
  total?: number
  hasNextPage: boolean
  isLoadingMore: boolean
  error: string | null
  onLoadMore: () => void
}

export function EventsTableFooter({ shown, total, hasNextPage, isLoadingMore, error, onLoadMore }: EventsTableFooterProps) {
  return (
    <div className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
      <span>{total !== undefined && `Showing ${shown.toLocaleString()} of ${total.toLocaleString()} events`}</span>
      {error && <span className="text-destructive">{error}</span>}
      {hasNextPage ? (
        <Button variant="outline" size="sm" disabled={isLoadingMore} onClick={onLoadMore}>
          {isLoadingMore ? 'Loading…' : error ? 'Try again' : 'Load more'}
        </Button>
      ) : (
        shown > 0 && <span>You have reached the end</span>
      )}
    </div>
  )
}
