import { Activity } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="shrink-0 border-b">
      <div className="flex h-14 items-center gap-3 px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="size-4" />
        </div>
        <span className="text-lg font-semibold">Agent Activity Explorer</span>
      </div>
    </header>
  )
}
