import Link from "next/link"
import { ArrowLeft, QrCode } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-muted">
          <QrCode className="size-8 text-muted-foreground" />
        </span>
        <h1 className="mt-6 text-5xl font-bold tracking-tight">404</h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ className: "mt-8" }))}
        >
          <ArrowLeft className="size-4" />
          Go home
        </Link>
      </div>
    </div>
  )
}