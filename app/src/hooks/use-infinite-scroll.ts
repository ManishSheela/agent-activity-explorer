import { useEffect, useState, type UIEvent } from 'react'

const OVERSCAN = 10

interface InfiniteScrollOptions {
  count: number
  rowHeight: number
  canLoadMore: boolean
  onLoadMore: () => void
}

export function useInfiniteScroll({ count, rowHeight, canLoadMore, onLoadMore }: InfiniteScrollOptions) {
  const [firstVisible, setFirstVisible] = useState(0)

  const start = Math.max(0, firstVisible - OVERSCAN)
  const end = Math.min(count, firstVisible + Math.ceil(window.innerHeight / rowHeight) + OVERSCAN)

  useEffect(() => {
    if (canLoadMore && end >= count - OVERSCAN) onLoadMore()
  }, [canLoadMore, end, count, onLoadMore])

  function onScroll(event: UIEvent<HTMLElement>) {
    setFirstVisible(Math.floor(event.currentTarget.scrollTop / rowHeight))
  }

  return {
    start,
    end,
    paddingTop: start * rowHeight,
    paddingBottom: (count - end) * rowHeight,
    onScroll,
  }
}
