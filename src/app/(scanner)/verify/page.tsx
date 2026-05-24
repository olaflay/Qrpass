import { VerificationShell } from "@/components/app-shell/verification-shell"
import { VerificationPanel } from "@/components/verification/verification-panel"

export default function VerifyPage() {
  return (
    <VerificationShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Verify pass</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Scan or paste a pass URL to validate attendee entry.
          </p>
        </div>
        <VerificationPanel />
      </div>
    </VerificationShell>
  )
}
