import Link from "next/link"
import {
  Activity,
  CalendarPlus,
  Download,
  FileUp,
  ScanLine,
  TicketCheck,
  Users,
} from "lucide-react"

import { EventCard } from "@/components/events/event-card"
import { EmptyState } from "@/components/shared/empty-state"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/domain"

type DashboardEvent = Event & {
  attendeeCount: number
  passCount: number
  scansToday: number
}

const events: DashboardEvent[] = [
  {
    id: "demo-lagos-tech-mixer",
    organizer_id: "demo-organizer",
    name: "Lagos Tech Mixer",
    slug: "lagos-tech-mixer",
    venue: "Civic Hall",
    starts_at: "2026-06-28T18:00:00.000Z",
    ends_at: "2026-06-28T22:00:00.000Z",
    brand_color: "#5B5BD6",
    logo_path: null,
    created_at: "2026-05-24T10:00:00.000Z",
    attendeeCount: 248,
    passCount: 248,
    scansToday: 36,
  },
  {
    id: "demo-founder-breakfast",
    organizer_id: "demo-organizer",
    name: "Founder Breakfast",
    slug: "founder-breakfast",
    venue: "The Loft",
    starts_at: "2026-07-12T08:30:00.000Z",
    ends_at: "2026-07-12T11:00:00.000Z",
    brand_color: "#22C55E",
    logo_path: null,
    created_at: "2026-05-24T10:00:00.000Z",
    attendeeCount: 64,
    passCount: 52,
    scansToday: 0,
  },
]

const totalAttendees = events.reduce((sum, event) => sum + event.attendeeCount, 0)
const totalPasses = events.reduce((sum, event) => sum + event.passCount, 0)
const totalScans = events.reduce((sum, event) => sum + event.scansToday, 0)

const metrics = [
  { label: "Active events", value: String(events.length), icon: CalendarPlus },
  { label: "Attendees", value: String(totalAttendees), icon: Users },
  { label: "Passes issued", value: String(totalPasses), icon: TicketCheck },
  { label: "Scans today", value: String(totalScans), icon: ScanLine },
]

const quickActions = [
  {
    title: "Create event",
    description: "Start a branded pass workflow.",
    href: "/dashboard/events/new",
    icon: CalendarPlus,
  },
  {
    title: "Import attendees",
    description: "Prepare CSV records for passes.",
    href: "/dashboard/events",
    icon: FileUp,
  },
  {
    title: "Verify entry",
    description: "Open scanner test flow.",
    href: "/verify",
    icon: ScanLine,
  },
  {
    title: "Export passes",
    description: "Review PNG/PDF readiness.",
    href: "/dashboard/passes",
    icon: Download,
  },
]

const activity = [
  "36 passes verified for Lagos Tech Mixer",
  "52 passes ready for Founder Breakfast",
  "CSV import queue is clear",
]

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track pass readiness, exports, attendees, and verification activity.
          </p>
        </div>
        <Link
          href="/dashboard/events/new"
          className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
        >
          <CalendarPlus className="size-4" />
          Create event
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
              <metric.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{metric.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <Card size="lg" variant="elevated">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-xl border bg-background p-4 transition-colors hover:border-ring/40 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
              >
                <action.icon className="size-5 text-muted-foreground" />
                <h2 className="mt-4 font-semibold">{action.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {action.description}
                </p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card size="lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {activity.map((item) => (
              <div key={item} className="rounded-lg bg-muted/60 p-3 text-sm">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Upcoming events</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue setup, export passes, or monitor verification readiness.
            </p>
          </div>
          <Link
            href="/dashboard/events"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:inline-flex"
            )}
          >
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              attendeeCount={event.attendeeCount}
              passCount={event.passCount}
            />
          ))}
        </div>
      </section>

      <EmptyState
        icon={FileUp}
        title="No attendee issues"
        description="CSV errors, duplicate attendees, and missing pass exports will appear here when they need attention."
        secondaryAction={
          <Link
            href="/dashboard/events/new"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Create another event
          </Link>
        }
      />
    </div>
  )
}
