import { Card } from "@/components/ui/card"

export default function EventsLoading() {
  return (
    <div className="grid gap-6" role="status">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-4 w-56 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-12 w-32 animate-pulse rounded-lg bg-muted" />
      </div>
      <Card variant="muted" size="lg">
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <div className="size-12 animate-pulse rounded-xl bg-muted" />
          <div className="mt-4 h-6 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-muted" />
        </div>
      </Card>
      <span className="sr-only">Loading events page</span>
    </div>
  )
}