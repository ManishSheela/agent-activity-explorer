import { TableCell, TableRow } from '@/components/ui/table'

export function EventsTableEmpty({ columns }: { columns: number }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columns} className="h-40 text-center text-muted-foreground">
        No events match your search or filters.
      </TableCell>
    </TableRow>
  )
}
