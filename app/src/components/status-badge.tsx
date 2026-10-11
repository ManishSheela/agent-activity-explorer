import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, type Status } from '@/types/event'
import { cn } from '@/lib/utils'

const styles: Record<Status, string> = {
  ok: 'border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/15 dark:text-emerald-300',
  blocked:
    'border-amber-600/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/40 dark:bg-amber-500/15 dark:text-amber-300',
  error: 'border-red-600/30 bg-red-500/10 text-red-700 dark:border-red-400/40 dark:bg-red-500/15 dark:text-red-300',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={cn('font-medium', styles[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
