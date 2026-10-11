export { cn } from 'cn'

export function formatTimestamp(iso: string) {
  return iso.slice(0, 19).replace('T', ' ')
}

export function formatLatency(ms: number) {
  return `${ms.toLocaleString()} ms`
}
