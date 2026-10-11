import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function EventsTableSkeleton({ columns }: { columns: number }) {
  return Array.from({ length: 10 }, (_, row) => (
    <TableRow key={row}>
      {Array.from({ length: columns }, (_, column) => (
        <TableCell key={column} className="px-4 py-3.5">
          <Skeleton className="h-4 w-24" />
        </TableCell>
      ))}
    </TableRow>
  ))
}
