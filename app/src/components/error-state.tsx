import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border bg-card p-8 text-center">
      <p className="text-sm text-destructive">{message}</p>
      <Button className="mt-4" variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
