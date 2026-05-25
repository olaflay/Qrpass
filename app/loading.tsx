import { Loader2 } from "lucide-react"

export default function RootLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background" role="status">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading QRPass…</p>
      </div>
      <span className="sr-only">Loading application</span>
    </div>
  )
}