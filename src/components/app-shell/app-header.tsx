import Link from "next/link"
import { QrCode } from "lucide-react"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AppHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <QrCode className="size-4" />
          </span>
          {siteConfig.name}
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1 overflow-x-auto">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "shrink-0"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
