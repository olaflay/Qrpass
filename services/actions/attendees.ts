"use server"

import { revalidatePath } from "next/cache"
import crypto from "crypto"

import { createClient } from "@/lib/supabase/server"
import { attendeeSchema, type AttendeeInput } from "@/lib/validations/attendee"

export type AttendeeActionState = {
  error?: string
  success?: boolean
}

/**
 * Manually adds a single attendee to an event and creates a secure QR pass.
 */
export async function addAttendee(
  eventId: string,
  input: AttendeeInput
): Promise<AttendeeActionState> {
  const parsed = attendeeSchema.safeParse(input)

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid attendee details.",
    }
  }

  const supabase = await createClient()

  // 1. Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "You must be signed in to manage attendees.",
    }
  }

  // 2. Insert the attendee record
  const { data: attendee, error: attendeeError } = await supabase
    .from("attendees")
    .insert({
      event_id: eventId,
      full_name: parsed.data.fullName,
      email: parsed.data.email,
      ticket_type: parsed.data.ticketType || "General Admission",
    })
    .select()
    .single()

  if (attendeeError) {
    if (attendeeError.code === "23505") {
      return {
        error: "An attendee with this email is already registered for this event.",
      }
    }
    return {
      error: attendeeError.message,
    }
  }

  // 3. Create the secure pass with a unique cryptographically random token
  const secureToken = crypto.randomUUID()
  const { error: passError } = await supabase.from("passes").insert({
    attendee_id: attendee.id,
    event_id: eventId,
    token_hash: secureToken,
    status: "active",
  })

  if (passError) {
    // If pass creation fails, delete the attendee to keep database consistent
    await supabase.from("attendees").delete().eq("id", attendee.id)
    return {
      error: `Failed to generate pass: ${passError.message}`,
    }
  }

  revalidatePath(`/dashboard/events/${eventId}`)
  return { success: true }
}

/**
 * Deletes an attendee and cascades deletion to their associated pass.
 */
export async function deleteAttendee(
  attendeeId: string,
  eventId: string
): Promise<AttendeeActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "You must be signed in to manage attendees.",
    }
  }

  const { error } = await supabase
    .from("attendees")
    .delete()
    .eq("id", attendeeId)
    .eq("event_id", eventId)

  if (error) {
    return {
      error: error.message,
    }
  }

  revalidatePath(`/dashboard/events/${eventId}`)
  return { success: true }
}

/**
 * Bulk registers multiple attendees from CSV parsing and generates their secure passes.
 */
export async function bulkUploadAttendees(
  eventId: string,
  attendeesList: AttendeeInput[]
): Promise<AttendeeActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error: "You must be signed in to bulk upload attendees.",
    }
  }

  // 1. Process inserts in a loop or transaction batch
  // For RLS and safe constraint handling, we can insert them and generate passes.
  const errors: string[] = []
  
  for (const attendeeInput of attendeesList) {
    const parsed = attendeeSchema.safeParse(attendeeInput)
    if (!parsed.success) {
      errors.push(`Row format error for ${attendeeInput.email || "unknown row"}`)
      continue
    }

    const { data: attendee, error: attendeeError } = await supabase
      .from("attendees")
      .insert({
        event_id: eventId,
        full_name: parsed.data.fullName,
        email: parsed.data.email,
        ticket_type: parsed.data.ticketType || "General Admission",
      })
      .select()
      .single()

    if (attendeeError) {
      errors.push(`Failed to register ${parsed.data.email}: ${attendeeError.message}`)
      continue
    }

    // Generate secure pass
    const secureToken = crypto.randomUUID()
    const { error: passError } = await supabase.from("passes").insert({
      attendee_id: attendee.id,
      event_id: eventId,
      token_hash: secureToken,
      status: "active",
    })

    if (passError) {
      // Rollback attendee insert
      await supabase.from("attendees").delete().eq("id", attendee.id)
      errors.push(`Failed to generate pass for ${parsed.data.email}: ${passError.message}`)
    }
  }

  revalidatePath(`/dashboard/events/${eventId}`)

  if (errors.length > 0) {
    return {
      error: `Uploaded with some failures:\n${errors.slice(0, 5).join("\n")}${errors.length > 5 ? `\n...and ${errors.length - 5} more errors.` : ""}`,
    }
  }

  return { success: true }
}
