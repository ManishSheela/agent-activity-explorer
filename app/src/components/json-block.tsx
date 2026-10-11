import { CopyButton } from '@/components/copy-button'

export function JsonBlock({ title, value }: { title: string; value: unknown }) {
  const json = JSON.stringify(value, null, 2) ?? 'null'

  return (
    <section className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <h3 className="text-sm font-medium">{title}</h3>
        <CopyButton value={json} />
      </div>
      <pre className="max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed">{json}</pre>
    </section>
  )
}
