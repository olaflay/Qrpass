"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type CheckInResult = {
  success: boolean
  message: string
  already_checked_in?: boolean
  attendee_name?: string
  ticket_type?: string
  event_name?: string
  checked_in_at?: string
}

/**
 * Checks in an attendee securely using their unique QR code token hash
 * by calling the check_in_attendee secure database RPC function.
 */
export async function verifyAndCheckInPass(
  tokenHash: string
): Promise<{ error?: string; result?: CheckInResult }> {
  if (!tokenHash) {
    return { error: "QR code token hash is missing." }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.rpc("check_in_attendee", {
    p_token_hash: tokenHash,
  })

  if (error) {
    return { error: error.message }
  }

  const result = data as CheckInResult

  // Revalidate query routes to ensure live UI dashboard registers the updated attendee check-in counts
  revalidatePath("/dashboard")
  
  return { result }
}
