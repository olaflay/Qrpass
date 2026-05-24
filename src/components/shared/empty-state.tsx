import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  secondaryAction?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <Card variant="muted" size="lg" className={className}>
      <CardContent className="flex flex-col items-center px-6 py-12 text-center">
        <div className="grid size-12 place-items-center rounded-xl bg-background shadow-xs">
          <Icon className="size-5 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {action || secondaryAction ? (
          <div className="mt-6 flex w-full flex-col justify-center gap-2 sm:w-auto sm:flex-row">
            {action}
            {secondaryAction}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
