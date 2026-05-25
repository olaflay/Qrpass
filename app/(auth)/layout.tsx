import type { ReactNode } from "react"
import Link from "next/link"
import { QrCode } from "lucide-react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <QrCode className="size-4" />
          </span>
          QRPass
        </Link>
        {children}
      </div>
    </main>
  )
}
