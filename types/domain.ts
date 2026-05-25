import type { Database } from "@/types/database"

export type Event = Database["public"]["Tables"]["events"]["Row"]
export type Attendee = Database["public"]["Tables"]["attendees"]["Row"]
export type Pass = Database["public"]["Tables"]["passes"]["Row"]

export type PassWithAttendee = Pass & {
  attendee: Pick<Attendee, "full_name" | "email" | "ticket_type">
  event: Pick<Event, "name" | "venue" | "starts_at" | "brand_color" | "logo_path">
}
