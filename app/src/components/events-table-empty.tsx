import { Button } from '@/components/ui/button'

interface EventsTableEmptyProps {
  hasFilters: boolean
  onClear: () => void
}

export function EventsTableEmpty({ hasFilters, onClear }: EventsTableEmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <p className="text-muted-foreground">{hasFilters ? 'No events match your search or filters.' : 'No events yet.'}</p>
      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  )
}
