import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function NewEventLoading() {
  return (
    <div className="grid gap-6" role="status">
      <div>
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-muted" />
      </div>
      <Card size="lg" variant="elevated">
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-7 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="size-10 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
      <span className="sr-only">Loading event creation form</span>
    </div>
  )
}