import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

interface EventsTableSkeletonProps {
  columns: number
  rows: number
}

export function EventsTableSkeleton({ columns, rows }: EventsTableSkeletonProps) {
  return Array.from({ length: rows }, (_, row) => (
    <TableRow key={row} className="h-12">
      {Array.from({ length: columns }, (_, column) => (
        <TableCell key={column} className="px-4">
          <Skeleton className="h-4 w-24" />
        </TableCell>
      ))}
    </TableRow>
  ))
}
