import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface DebounceSearchProps {
  value: string
  onSearch: (value: string) => void
}

export function DebounceSearch({ value, onSearch }: DebounceSearchProps) {
  const [text, setText] = useState(value)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (text === value) return
    const timer = setTimeout(() => onSearch(text), 300)
    return () => clearTimeout(timer)
  }, [text, value, onSearch])

  return (
    <div className="relative min-w-60 flex-1">
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Search by agent, tool, or arguments..."
        aria-label="Search events"
        className="h-12 pl-9"
      />
    </div>
  )
}
