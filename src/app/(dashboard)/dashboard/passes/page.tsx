import Link from "next/link"
import { TicketCheck } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function PassesPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Passes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generated QR passes will appear here once attendees are added to an event.
        </p>
      </div>
      <EmptyState
        icon={TicketCheck}
        title="No passes generated"
        description="Create an event, add attendees, then generate downloadable PNG and PDF passes."
        action={
          <Link href="/dashboard/events/new" className={cn(buttonVariants())}>
            Create event
          </Link>
        }
      />
    </div>
  )
}
