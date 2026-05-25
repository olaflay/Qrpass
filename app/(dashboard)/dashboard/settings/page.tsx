import { Settings } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Workspace, profile, and security settings will live here.
        </p>
      </div>
      <EmptyState
        icon={Settings}
        title="Settings are not configured yet"
        description="Account preferences, workspace branding, and security controls will be added as the MVP expands."
      />
    </div>
  )
}
