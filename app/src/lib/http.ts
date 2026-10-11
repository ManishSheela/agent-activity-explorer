import { ApiError } from '@/lib/api-error'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
const TIMEOUT_MS = 20_000

type QueryParams = Record<string, string | number | string[] | null | undefined>

interface RequestOptions {
  params?: QueryParams
  signal?: AbortSignal
}

function toQueryString(params: QueryParams = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item))
    } else if (value !== null && value !== undefined && value !== '') {
      search.set(key, String(value))
    }
  }
  return search.toString()
}

export async function http<T>(path: string, { params, signal }: RequestOptions = {}): Promise<T> {
  const query = toQueryString(params)
  const url = `${BASE_URL}${path}${query ? `?${query}` : ''}`
  const timeout = AbortSignal.timeout(TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(url, { signal: signal ? AbortSignal.any([signal, timeout]) : timeout })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError(timeout.aborted ? 'timeout' : 'network')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError('http', { status: response.status, detail: body?.error })
  }

  try {
    return await response.json()
  } catch {
    throw new ApiError(timeout.aborted ? 'timeout' : 'parse')
  }
}
