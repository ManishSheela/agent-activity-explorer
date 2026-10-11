export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'parse'

interface ApiErrorOptions {
  status?: number
  detail?: string
}

export class ApiError extends Error {
  kind: ApiErrorKind
  status?: number
  detail?: string

  constructor(kind: ApiErrorKind, { status, detail }: ApiErrorOptions = {}) {
    super(detail ?? kind)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.detail = detail
  }
}

export function isRetryable(error: unknown) {
  if (!(error instanceof ApiError)) return false
  if (error.kind === 'network' || error.kind === 'timeout') return true
  return error.kind === 'http' && (error.status ?? 0) >= 500
}

export function getErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return 'Something went wrong. Please try again.'
  switch (error.kind) {
    case 'network':
      return 'Could not reach the server. Check your connection and try again.'
    case 'timeout':
      return 'The server took too long to respond. Please try again.'
    case 'parse':
      return 'The server sent a response we could not read.'
    default:
      if (error.status && error.status >= 500) return 'The server ran into a problem. Please try again.'
      return error.detail ?? 'The request could not be completed.'
  }
}
