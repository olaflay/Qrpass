import { siteConfig } from "@/config/site"

export type VerificationPayloadInput = {
  eventId: string
  attendeeId: string
  passId: string
}

export function buildVerificationUrl({
  eventId,
  attendeeId,
  passId,
}: VerificationPayloadInput) {
  const url = new URL("/verify", siteConfig.url)
  url.searchParams.set("eventId", eventId)
  url.searchParams.set("attendeeId", attendeeId)
  url.searchParams.set("passId", passId)
  return url.toString()
}
