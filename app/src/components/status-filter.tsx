import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STATUSES, STATUS_LABELS, type Status } from '@/types/event'

const ALL = 'all'

interface StatusFilterProps {
  value: Status | null
  onChange: (status: Status | null) => void
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Select value={value ?? ALL} onValueChange={(next) => onChange(next === ALL ? null : (next as Status))}>
      <SelectTrigger aria-label="Status" className="w-44 px-3 data-[size=default]:h-12">
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[11px] text-muted-foreground">Status</span>
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent position="popper" align="start">
        <SelectItem value={ALL}>All statuses</SelectItem>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {STATUS_LABELS[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
