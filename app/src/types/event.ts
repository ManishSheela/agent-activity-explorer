export const STATUSES = ['ok', 'blocked', 'error'] as const

export type Status = (typeof STATUSES)[number]

export const STATUS_LABELS: Record<Status, string> = {
  ok: 'OK',
  blocked: 'Blocked',
  error: 'Error',
}

export interface EventSummary {
  id: string
  timestamp: string
  agent: string
  tool: string
  status: Status
  latencyMs: number
  argsPreview: string
}

export interface EventsPage {
  items: EventSummary[]
  nextCursor: string | null
  total: number
}

export interface EventDetail extends Omit<EventSummary, 'argsPreview'> {
  args: unknown
  result: unknown
  policyMatches: string[]
}

export interface EventFilters {
  q: string
  agents: string[]
  status: Status | null
}
