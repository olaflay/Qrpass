import Link from "next/link"
import { CalendarPlus, FileUp, TicketCheck } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function EventsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create events and manage attendee passes from a single place.
          </p>
        </div>
        <Link
          href="/dashboard/events/new"
          className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
        >
          <CalendarPlus className="size-4" />
          New event
        </Link>
      </div>
      <EmptyState
        icon={CalendarPlus}
        title="No events yet"
        description="Start with the event shell, then add attendees and generate QR passes."
        action={
          <Link href="/dashboard/events/new" className={cn(buttonVariants())}>
            Create event
          </Link>
        }
        secondaryAction={
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to dashboard
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Add event details",
            description: "Name, date, time, venue, and organizer information.",
            icon: CalendarPlus,
          },
          {
            title: "Import attendees",
            description: "Upload CSV files or add guests one at a time.",
            icon: FileUp,
          },
          {
            title: "Generate passes",
            description: "Create branded QR passes ready for download.",
            icon: TicketCheck,
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border bg-card p-5 shadow-xs">
            <div className="grid size-10 place-items-center rounded-lg bg-muted">
              <item.icon className="size-4 text-muted-foreground" />
            </div>
            <h2 className="mt-4 font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
