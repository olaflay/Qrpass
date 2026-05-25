import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyLoading() {
  return (
    <div className="grid gap-6" role="status">
      <div>
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Card variant="elevated" size="lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="size-5 animate-pulse rounded bg-muted" />
              <div className="h-5 w-32 animate-pulse rounded bg-muted" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-20 animate-pulse rounded-lg bg-muted" />
              <div className="h-12 animate-pulse rounded-lg bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>
      <span className="sr-only">Loading verification page</span>
    </div>
  )
}