import { ChevronRight } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatLatency, formatTimestamp } from '@/lib/utils'
import type { EventSummary } from '@/types/event'
import { StatusBadge } from './status-badge'

interface EventRowProps {
  event: EventSummary
  selected: boolean
  onSelect: (id: string) => void
}

export function EventRow({ event, selected, onSelect }: EventRowProps) {
  return (
    <TableRow
      data-event-id={event.id}
      data-state={selected ? 'selected' : undefined}
      aria-current={selected || undefined}
      tabIndex={0}
      onClick={() => onSelect(event.id)}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault()
          onSelect(event.id)
        }
      }}
      className="h-12 cursor-pointer outline-none focus-visible:bg-muted/60 data-[state=selected]:bg-primary/10"
    >
      <TableCell className="px-4 tabular-nums">{formatTimestamp(event.timestamp)}</TableCell>
      <TableCell className="px-4">{event.agent}</TableCell>
      <TableCell className="px-4">{event.tool}</TableCell>
      <TableCell className="px-4">
        <StatusBadge status={event.status} />
      </TableCell>
      <TableCell className="px-4 tabular-nums">{formatLatency(event.latencyMs)}</TableCell>
      <TableCell className="w-10 pr-4 text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
    </TableRow>
  )
}
