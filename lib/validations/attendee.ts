import { z } from "zod"

export const attendeeSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  email: z.string().email("Enter a valid email address"),
  ticketType: z.string().max(80).optional(),
})

export const attendeeCsvRowSchema = attendeeSchema.extend({
  externalId: z.string().optional(),
})

export type AttendeeInput = z.infer<typeof attendeeSchema>
