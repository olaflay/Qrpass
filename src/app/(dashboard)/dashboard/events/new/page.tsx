import { EventCreateWizard } from "@/components/events/event-create-wizard"
import { createEvent } from "@/server/actions/events"

export default function NewEventPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">New event</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create the event shell in focused steps, with a live pass preview as you go.
        </p>
      </div>
      <EventCreateWizard action={createEvent} />
    </div>
  )
}
