import { useEffect, useRef } from 'react'
import { Bot, Clock, ShieldAlert, Wrench, X } from 'lucide-react'
import { CopyButton } from '@/components/copy-button'
import { ErrorState } from '@/components/error-state'
import { JsonBlock } from '@/components/json-block'
import { StatusBadge } from '@/components/status-badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SlowNotice } from '@/components/slow-notice'
import { Skeleton } from '@/components/ui/skeleton'
import { useEvent } from '@/hooks/use-events'
import { formatLatency } from '@/lib/utils'

interface EventDetailsProps {
  id: string
  onClose: () => void
}

export function EventDetails({ id, onClose }: EventDetailsProps) {
  const { data: event, isPending, isFetching, isError, error, refetch } = useEvent(id)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [id])

  useEffect(() => {
    function handleKeyDown(keyboardEvent: KeyboardEvent) {
      if (keyboardEvent.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [id, onClose])

  function close() {
    document.querySelector<HTMLElement>(`[data-event-id="${CSS.escape(id)}"]`)?.focus()
    onClose()
  }

  return (
    <aside aria-labelledby="event-details-title" className="flex w-[440px] max-w-full shrink-0 flex-col border-l bg-background max-lg:absolute max-lg:inset-y-0 max-lg:right-0 max-lg:z-20 max-lg:shadow-2xl">
      <div className="flex h-16 shrink-0 items-center justify-between gap-3 border-b px-5">
        <h2 id="event-details-title" ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
          Event Details
        </h2>
        <div className="flex items-center gap-2">
          <CopyButton value={window.location.href} label="Copy link" />
          <Button variant="ghost" size="icon" aria-label="Close details" onClick={close}>
            <X />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
        <SlowNotice loading={isFetching} />

        {isPending && (
          <>
            <Skeleton className="h-44 w-full" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        )}

        {isError && <ErrorState message={error.message} onRetry={refetch} />}

        {event && (
          <>
            <section className="rounded-lg border bg-card p-4">
              <div className="flex items-start gap-3">
                <StatusBadge status={event.status} />
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm font-medium">{event.id}</p>
                  <p className="text-xs text-muted-foreground">{event.timestamp.replace('T', ' ')}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-3 border-t pt-4 text-sm">
                {[
                  { label: 'Agent', icon: Bot, value: event.agent },
                  { label: 'Tool', icon: Wrench, value: event.tool },
                  { label: 'Latency', icon: Clock, value: formatLatency(event.latencyMs) },
                ].map(({ label, icon: Icon, value }) => (
                  <div key={label} className="grid grid-cols-[88px_1fr] items-center">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <JsonBlock title="Arguments" value={event.args} />
            <JsonBlock title="Result" value={event.result} />

            <section className="rounded-lg border bg-card p-4">
              <h3 className="flex items-center gap-2 text-sm font-medium">
                <ShieldAlert className="size-4 text-amber-500" />
                Policy Matches
              </h3>
              {event.policyMatches.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No policies matched.</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {event.policyMatches.map((rule) => (
                    <Badge key={rule} variant="outline" className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300">
                      {rule}
                    </Badge>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </aside>
  )
}
