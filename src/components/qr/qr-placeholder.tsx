import { QrCode } from "lucide-react"

export function QrPlaceholder() {
  return (
    <div className="grid aspect-square place-items-center rounded-lg border bg-white text-zinc-950">
      <QrCode className="size-28" strokeWidth={1.5} />
    </div>
  )
}
