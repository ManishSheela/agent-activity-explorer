import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const SLOW_AFTER_MS = 2000

export function SlowNotice({ loading, className }: { loading: boolean; className?: string }) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS)
    return () => {
      clearTimeout(timer)
      setSlow(false)
    }
  }, [loading])

  if (!slow) return null

  return (
    <p role="status" className={cn('text-sm text-muted-foreground', className)}>
      This is taking longer than usual. Still trying…
    </p>
  )
}
