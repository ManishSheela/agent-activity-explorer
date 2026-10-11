const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function http<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(BASE_URL + path, { signal })
  } catch (error) {
    if (signal?.aborted) throw error
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0)
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      response.status >= 500 ? 'The server ran into a problem. Please try again.' : (body?.error ?? 'Request failed.')
    throw new ApiError(message, response.status)
  }

  return response.json()
}
