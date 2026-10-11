import { useSearchParams } from 'react-router'

export function useSelectedEvent() {
  const [params, setParams] = useSearchParams()
  const selectedId = params.get('event')

  function selectEvent(id: string | null) {
    if (id === selectedId) return
    const next = new URLSearchParams(params)
    if (id) next.set('event', id)
    else next.delete('event')
    setParams(next)
  }

  return { selectedId, selectEvent }
}
