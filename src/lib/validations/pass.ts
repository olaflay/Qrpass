import { z } from "zod"

export const verifyPassSchema = z.object({
  token: z.string().min(24, "Pass token is invalid"),
})

export type VerifyPassInput = z.infer<typeof verifyPassSchema>
