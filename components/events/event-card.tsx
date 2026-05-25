import Link from "next/link"
import { CalendarDays, MapPin, TicketCheck, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getEventStatus } from "@/lib/features/events/event-status"
import type { Event } from "@/types/domain"

type EventCardProps = {
  event: Event
  attendeeCount?: number
  passCount?: number
}

export function EventCard({ event, attendeeCount = 0, passCount = 0 }: EventCardProps) {
  const status = getEventStatus(event.starts_at, event.ends_at)

  return (
    <Link
      href={`/dashboard/events/${event.id}`}
      className="block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
    >
      <Card variant="interactive" size="lg" className="h-full">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base">{event.name}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{event.slug}</p>
          </div>
          <Badge variant={status === "live" ? "default" : "secondary"}>{status}</Badge>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4" />
            {new Date(event.starts_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          {event.venue ? (
            <p className="flex items-center gap-2">
              <MapPin className="size-4" />
              {event.venue}
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="flex items-center gap-2 text-xs">
                <Users className="size-3.5" />
                Attendees
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">{attendeeCount}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="flex items-center gap-2 text-xs">
                <TicketCheck className="size-3.5" />
                Passes
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">{passCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
