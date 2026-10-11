import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  message: string
  onRetry: () => void
  className?: string
}

export function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-8 text-center', className)}>
      <p className="text-sm text-destructive">{message}</p>
      <Button className="mt-4" variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
