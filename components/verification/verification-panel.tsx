"use client"

import * as React from "react"
import { CheckCircle2, ScanLine, ShieldAlert, TicketX } from "lucide-react"

import { QrCodeImage } from "@/components/qr/qr-code-image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buildVerificationUrl } from "@/lib/features/passes/qr-payload"
import { cn } from "@/lib/utils"

const testPasses = [
  {
    label: "Valid",
    status: "valid",
    value: buildVerificationUrl({
      eventId: "demo-event",
      attendeeId: "attendee-001",
      passId: "pass-valid-001",
    }),
  },
  {
    label: "Used",
    status: "used",
    value: buildVerificationUrl({
      eventId: "demo-event",
      attendeeId: "attendee-002",
      passId: "pass-used-002",
    }),
  },
  {
    label: "Invalid",
    status: "invalid",
    value: "not-a-valid-qrpass-token",
  },
] as const

type ResultState = "idle" | "valid" | "used" | "invalid"

function getResult(value: string): ResultState {
  if (!value) return "idle"
  if (value.includes("pass-valid")) return "valid"
  if (value.includes("pass-used")) return "used"
  return "invalid"
}

export function VerificationPanel() {
  const [token, setToken] = React.useState(testPasses[0].value)
  const [result, setResult] = React.useState<ResultState>("idle")

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(getResult(token))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Card variant="elevated" size="lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="size-5" />
            Scanner input
          </CardTitle>
          <CardDescription>
            Paste a verification URL or use a scanner that enters QR text into this field.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="token">Pass token or verification URL</Label>
              <Input
                id="token"
                name="token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="https://qrpass.app/verify?eventId=..."
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full">
              Check pass
            </Button>
          </form>

          <div className="mt-5 grid gap-2">
            <p className="text-sm font-medium">Test verification flow</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {testPasses.map((pass) => (
                <button
                  key={pass.label}
                  type="button"
                  onClick={() => {
                    setToken(pass.value)
                    setResult("idle")
                  }}
                  className="min-h-11 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
                >
                  {pass.label}
                </button>
              ))}
            </div>
          </div>

          <VerificationResult result={result} />
        </CardContent>
      </Card>

      <Card size="lg">
        <CardHeader>
          <CardTitle>Sample QR</CardTitle>
          <CardDescription>
            High-contrast QR with quiet zone for scanning and export testing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QrCodeImage value={testPasses[0].value} label="Sample valid QRPass QR" />
          <p className="mt-4 break-words text-xs leading-5 text-muted-foreground">
            Encodes event ID, attendee ID, pass ID, and the verification route.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function VerificationResult({ result }: { result: ResultState }) {
  if (result === "idle") return null

  const content = {
    valid: {
      icon: CheckCircle2,
      title: "Valid pass",
      description: "Attendee can be admitted. Mark this pass as used after entry.",
      className: "border-emerald-200 bg-emerald-50 text-emerald-900",
    },
    used: {
      icon: ShieldAlert,
      title: "Already used",
      description: "This pass has already been checked in and should not be reused.",
      className: "border-amber-200 bg-amber-50 text-amber-950",
    },
    invalid: {
      icon: TicketX,
      title: "Invalid pass",
      description: "The QR payload is missing required QRPass verification data.",
      className: "border-destructive/30 bg-destructive/10 text-destructive",
    },
  }[result]
  const Icon = content.icon

  return (
    <div
      role="status"
      className={cn("mt-5 rounded-xl border p-4 text-sm", content.className)}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">{content.title}</p>
          <p className="mt-1 leading-6">{content.description}</p>
        </div>
      </div>
    </div>
  )
}
