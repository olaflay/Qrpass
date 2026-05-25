"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  LayoutDashboard,
  QrCode,
  ScanLine,
  Settings,
  TicketCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"

const dashboardNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: CalendarDays,
  },
  {
    title: "Passes",
    href: "/dashboard/passes",
    icon: TicketCheck,
  },
  {
    title: "Verify",
    href: "/verify",
    icon: ScanLine,
  },
]

const secondaryNavItems = [
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r bg-background lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-16 items-center border-b px-5">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <QrCode className="size-4" />
          </span>
          QRPass
        </Link>
      </div>

      <nav aria-label="Dashboard navigation" className="flex flex-1 flex-col gap-6 px-3 py-4">
        <div className="grid gap-1">
          {dashboardNavItems.map((item) => {
            const isActive = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            )
          })}
        </div>

        <div className="mt-auto grid gap-1 border-t pt-4">
          {secondaryNavItems.map((item) => {
            const isActive = isActivePath(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                  isActive && "bg-muted text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}

export function DashboardMobileHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <QrCode className="size-4" />
        </span>
        QRPass
      </Link>
      <Link
        href="/dashboard/events/new"
        className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
      >
        New event
      </Link>
    </header>
  )
}

export function DashboardMobileNav() {
  const pathname = usePathname()
  const mobileItems = dashboardNavItems.slice(0, 4)

  return (
    <nav
      aria-label="Mobile dashboard navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur lg:hidden"
    >
      <div className="grid grid-cols-4 gap-1">
        {mobileItems.map((item) => {
          const isActive = isActivePath(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                isActive && "bg-muted text-foreground"
              )}
            >
              <item.icon className="size-5" />
              <span className="max-w-full truncate">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
