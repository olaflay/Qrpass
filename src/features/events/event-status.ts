export function getEventStatus(startsAt: string, endsAt?: string | null) {
  const now = Date.now()
  const start = new Date(startsAt).getTime()
  const end = endsAt ? new Date(endsAt).getTime() : start

  if (now < start) return "upcoming"
  if (now > end) return "ended"
  return "live"
}
