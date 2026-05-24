import { TicketCheck } from "lucide-react"

import { QrPlaceholder } from "@/components/qr/qr-placeholder"

export function PassPreview() {
  return (
    <section className="w-full max-w-sm rounded-lg border bg-card p-4 shadow-sm">
      <div className="rounded-lg bg-muted/40 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">General Admission</p>
            <h2 className="mt-1 text-xl font-semibold">QRPass Preview</h2>
          </div>
          <TicketCheck className="size-8 text-emerald-600" />
        </div>
        <div className="mt-6">
          <QrPlaceholder />
        </div>
        <div className="mt-4 rounded-lg bg-background p-3 text-sm">
          <p className="font-medium">Ada Lovelace</p>
          <p className="mt-1 text-muted-foreground">ada@example.com</p>
        </div>
      </div>
    </section>
  )
}
