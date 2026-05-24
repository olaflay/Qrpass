import { z } from "zod"

export const eventSchema = z
  .object({
    name: z.string().min(2, "Event name is required").max(120, "Keep the event name under 120 characters."),
    slug: z
      .string()
      .min(2, "Slug is required")
      .max(80, "Keep the slug under 80 characters.")
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
    venue: z.string().max(160, "Keep the venue under 160 characters.").optional(),
    startsAt: z.string().min(1, "Start date is required"),
    endsAt: z.string().optional(),
    brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Choose a valid color").default("#162033"),
  })
  .superRefine((value, context) => {
    if (!value.endsAt) return

    const startsAt = new Date(value.startsAt).getTime()
    const endsAt = new Date(value.endsAt).getTime()

    if (Number.isFinite(startsAt) && Number.isFinite(endsAt) && endsAt <= startsAt) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "End time must be after the start time.",
      })
    }
  })

export type EventInput = z.infer<typeof eventSchema>
