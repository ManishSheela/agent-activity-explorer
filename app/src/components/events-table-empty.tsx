import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

interface EventsTableEmptyProps {
  columns: number
  hasFilters: boolean
  onClear: () => void
}

export function EventsTableEmpty({ columns, hasFilters, onClear }: EventsTableEmptyProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columns} className="h-40 text-center">
        <p className="text-muted-foreground">{hasFilters ? 'No events match your search or filters.' : 'No events yet.'}</p>
        {hasFilters && (
          <Button className="mt-3" variant="outline" size="sm" onClick={onClear}>
            Clear filters
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}
