import type { ReactNode } from "react"

import {
  DashboardMobileHeader,
  DashboardMobileNav,
  DashboardSidebar,
} from "@/components/app-shell/dashboard-nav"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <DashboardMobileHeader />
      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
      <DashboardMobileNav />
    </div>
  )
}
