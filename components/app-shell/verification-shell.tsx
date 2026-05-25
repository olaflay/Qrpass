"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  LayoutDashboard,
  QrCode,
  ScanLine,
  TicketCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"

const verifyNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Events", href: "/dashboard/events", icon: CalendarDays },
  { title: "Passes", href: "/dashboard/passes", icon: TicketCheck },
  { title: "Verify", href: "/verify", icon: ScanLine },
]

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function VerificationShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="hidden border-r bg-background lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex h-16 items-center border-b px-5">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <QrCode className="size-4" />
            </span>
            QRPass
          </Link>
        </div>
        <nav aria-label="Verification navigation" className="grid gap-1 px-3 py-4">
          {verifyNavItems.map((item) => {
            const active = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>

      <nav
        aria-label="Mobile verification navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden"
      >
        <div className="grid grid-cols-4 gap-1">
          {verifyNavItems.map((item) => {
            const active = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                  active && "bg-muted text-foreground"
                )}
              >
                <item.icon className="size-5" />
                <span className="max-w-full truncate">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
