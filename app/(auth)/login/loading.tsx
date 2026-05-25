import { Loader2 } from "lucide-react"

export default function LoginLoading() {
  return (
    <div className="grid min-h-[20rem] place-items-center" role="status">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
      <span className="sr-only">Loading sign in form</span>
    </div>
  )
}