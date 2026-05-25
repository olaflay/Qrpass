import { createClient } from "@/lib/supabase/server"

export async function getEvents() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
