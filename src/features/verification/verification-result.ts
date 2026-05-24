import type { PassStatus } from "@/types/database"

export type VerificationResult =
  | {
      status: "valid"
      message: string
      passStatus: PassStatus
    }
  | {
      status: "invalid" | "already_checked_in" | "revoked"
      message: string
      passStatus?: PassStatus
    }

export function mapPassStatus(status: PassStatus): VerificationResult {
  if (status === "checked_in") {
    return {
      status: "already_checked_in",
      message: "This pass has already been checked in.",
      passStatus: status,
    }
  }

  if (status === "revoked") {
    return {
      status: "revoked",
      message: "This pass was revoked and should not be admitted.",
      passStatus: status,
    }
  }

  return {
    status: "valid",
    message: "Pass is valid. Admit attendee and mark as checked in.",
    passStatus: status,
  }
}
