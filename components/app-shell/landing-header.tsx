"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, QrCode, X } from "lucide-react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const desktopNavLinks = [
  { title: "Features", href: "#features" },
  { title: "Templates", href: "#templates" },
  { title: "How It Works", href: "#workflow" },
  { title: "Mobile Experience", href: "#mobile-experience" },
  { title: "Pricing", href: "#pricing" },
  { title: "FAQ", href: "#faq" },
]

const mobileNavLinks = [
  { title: "Features", href: "#features" },
  { title: "Templates", href: "#templates" },
  { title: "How It Works", href: "#workflow" },
  { title: "Mobile Experience", href: "#mobile-experience" },
  { title: "Pricing", href: "#pricing" },
  { title: "FAQ", href: "#faq" },
]

type LandingHeaderProps = {
  isAuthenticated: boolean
}

export function LandingHeader({ isAuthenticated }: LandingHeaderProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const getStartedHref = isAuthenticated ? "/dashboard/events/new" : "/login"

  // Close menu on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur-xl">
      <a
        href="#main-content"
        className="absolute -top-10 left-4 z-50 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:top-4"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
        >
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <QrCode className="size-4" />
          </span>
          QRPass
        </Link>

        <nav aria-label="Main navigation" className="hidden flex-1 items-center justify-center gap-6 sm:flex">
          {desktopNavLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            Sign in
          </Link>
          <Link
            href={getStartedHref}
            className={cn(
              buttonVariants({ size: "sm" }),
              "text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            Get started
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            ref={triggerRef}
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-haspopup="menu"
            className="sm:hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 bg-transparent"
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="sm:hidden w-full max-h-[90vh] overflow-y-auto border-t border-border/60 bg-background px-4 py-6 shadow-2xl"
          >
            <div className="mx-auto flex max-w-sm flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                    <QrCode className="size-4" />
                  </span>
                  QRPass
                </div>
                <Button
                  aria-label="Close navigation menu"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setOpen(false)}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <nav aria-label="Mobile navigation" role="menu" className="space-y-3">
                {mobileNavLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="block text-sm font-medium text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border/50 pt-4">
                <Link
                  href="/login"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl border border-border/70 bg-background px-4 py-3 text-center text-sm font-medium text-foreground transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Sign in
                </Link>
              </div>

              <Link
                href={getStartedHref}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Get started
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
