"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { eventSchema } from "@/lib/validations/event"
import { createClient } from "@/lib/supabase/server"

export type EventActionState = {
  error?: string
}

export async function createEvent(
  _previousState: EventActionState,
  formData: FormData
): Promise<EventActionState> {
  const parsed = eventSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    venue: formData.get("venue") || undefined,
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt") || undefined,
    brandColor: formData.get("brandColor") || "#162033",
  })

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the event details and try again.",
    }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      error: "Supabase is not configured yet. Add your project URL and anon key to continue.",
    }
  }

  const input = parsed.data
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "You must be signed in to create an event.",
    }
  }

  const { error } = await supabase.from("events").insert({
    organizer_id: user.id,
    name: input.name,
    slug: input.slug,
    venue: input.venue,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    brand_color: input.brandColor,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath("/dashboard/events")
  redirect("/dashboard/events")
}
