"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

type AuthFormProps = {
  mode: "login" | "register"
}

const draftKey = "qrpass:event-create-draft"

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = React.useState<string>()
  const [isPending, setIsPending] = React.useState(false)
  const [hasDraft, setHasDraft] = React.useState(false)
  const next = searchParams.get("next") || "/dashboard"

  React.useEffect(() => {
    queueMicrotask(() => {
      setHasDraft(Boolean(window.localStorage.getItem(draftKey)))
    })
  }, [])

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(undefined)
    setIsPending(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const supabase = createClient()

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: String(formData.get("name") ?? ""),
              },
            },
          })

    setIsPending(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    router.replace(next)
    router.refresh()
  }

  const isLogin = mode === "login"

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? "Sign in" : "Create account"}</CardTitle>
        <CardDescription>
          {hasDraft
            ? "Continue where you left off after signing in."
            : isLogin
              ? "Access your QRPass workspace."
              : "Set up your QRPass workspace."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasDraft ? (
          <div className="mb-4 rounded-xl border bg-muted/60 p-3 text-sm text-muted-foreground">
            We found an event draft on this device. Your template, colors, and
            details will be restored after authentication.
          </div>
        ) : null}
        <form className="grid gap-4" onSubmit={submit}>
          {!isLogin ? (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" required />
            </div>
          ) : null}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            {!isPending ? <ArrowRight className="size-4" /> : null}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? "New to QRPass?" : "Already have an account?"}{" "}
          <Link
            href={`${isLogin ? "/register" : "/login"}?next=${encodeURIComponent(next)}`}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
