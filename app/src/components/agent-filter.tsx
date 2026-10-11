import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useAgents } from '@/hooks/use-events'

interface AgentFilterProps {
  selected: string[]
  onChange: (agents: string[]) => void
}

function getSummary(selected: string[]) {
  if (selected.length === 0) return 'All agents'
  if (selected.length === 1) return selected[0]
  return `${selected.length} agents`
}

export function AgentFilter({ selected, onChange }: AgentFilterProps) {
  const agents = useAgents()

  function toggle(agent: string) {
    onChange(selected.includes(agent) ? selected.filter((name) => name !== agent) : [...selected, agent])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-12 w-48 justify-between px-3 font-normal">
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[11px] text-muted-foreground">Agent</span>
            <span className="max-w-32 truncate">{getSummary(selected)}</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-80 w-64 overflow-y-auto p-2">
        {agents.isPending && <p className="px-2 py-1.5 text-sm text-muted-foreground">Loading agents…</p>}
        {agents.isError && <p className="px-2 py-1.5 text-sm text-destructive">Could not load agents.</p>}
        {agents.data?.map((agent) => (
          <label key={agent} className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent">
            <Checkbox checked={selected.includes(agent)} onCheckedChange={() => toggle(agent)} />
            {agent}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  )
}
