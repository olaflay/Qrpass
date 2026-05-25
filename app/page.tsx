import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CalendarPlus,
  Download,
  Palette,
  QrCode,
  ScanLine,
  ShieldCheck,
  Smartphone,
  TicketCheck,
  Users,
} from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { LandingHeader } from "@/components/app-shell/landing-header"
import { QrCodeImage } from "@/components/qr/qr-code-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildVerificationUrl } from "@/lib/features/passes/qr-payload"
import { cn } from "@/lib/utils"

const stats = [
  { label: "First pass", value: "<3 min" },
  { label: "Passes generated", value: "12k+" },
  { label: "Verification", value: "2 sec" },
]

const features = [
  {
    title: "QR pass generation",
    description: "Create unique, scannable passes for every attendee.",
    icon: QrCode,
  },
  {
    title: "Live pass preview",
    description: "See branding, layout, and QR changes before export.",
    icon: TicketCheck,
  },
  {
    title: "Brand customization",
    description: "Pick palettes, upload logos, and choose distinct templates.",
    icon: Palette,
  },
  {
    title: "Attendee management",
    description: "Add guests manually or prepare bulk CSV imports.",
    icon: Users,
  },
  {
    title: "PNG/PDF export",
    description: "Download crisp passes that stay readable when shared.",
    icon: Download,
  },
  {
    title: "QR verification",
    description: "Validate passes from a mobile-friendly scanner screen.",
    icon: ScanLine,
  },
]

const workflow = [
  { title: "Create Event", description: "Add event details and venue.", icon: CalendarPlus },
  { title: "Customize Pass", description: "Choose template, colors, logo, and banner.", icon: Palette },
  { title: "Share & Verify", description: "Export passes and scan guests in.", icon: ScanLine },
]

const templates = [
  { name: "Minimal", className: "bg-white text-zinc-950 border", accent: "bg-zinc-950" },
  { name: "Elegant", className: "bg-gradient-to-br from-[#5B5BD6] via-[#8B5CF6] to-[#111827] text-white", accent: "bg-white" },
  { name: "Corporate", className: "bg-[#f8fafc] text-slate-950 border-t-8 border-t-[#1D4ED8]", accent: "bg-[#1D4ED8]" },
  { name: "Dark", className: "bg-[#090d18] text-cyan-50 border border-cyan-300/30", accent: "bg-cyan-300" },
]

const qrValue = buildVerificationUrl({
  eventId: "qrpass-demo",
  attendeeId: "attendee-001",
  passId: "pass-001",
})

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAuthenticated = Boolean(user)
  const getStartedHref = isAuthenticated ? "/dashboard/events/new" : "/login"

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <LandingHeader isAuthenticated={isAuthenticated} />

      <section className="mx-auto grid min-h-[calc(100vh-3.5rem)] w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-1 text-sm text-muted-foreground shadow-xs">
            <BadgeCheck className="size-4 text-emerald-600" />
            Beautiful QR passes without ticketing bloat
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl lg:text-6xl">
            Create branded QR passes in minutes.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            QRPass helps organizers design event passes, add attendees, export
            PNG/PDF files, and verify guests from one fast mobile-first workflow.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={getStartedHref} className={cn(buttonVariants({ size: "lg" }))}>
              Create event <ArrowRight className="size-4" />
            </Link>
            <Link href="#features" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              See features
            </Link>
          </div>
          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-3 shadow-xs">
                <dt className="text-xs font-medium text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-xl font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-[1.75rem] border bg-[#10141f] p-3 shadow-xl">
          <div className="rounded-[1.35rem] bg-[#f8fafc] p-4 text-[#111827]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-[#697180]">
                  Elegant template
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Creator Summit</h2>
              </div>
              <Badge className="bg-emerald-600 text-white">Ready</Badge>
            </div>
            <div className="mt-6 rounded-[1.5rem] bg-white p-5 shadow-sm">
              <div className="grid gap-5 sm:grid-cols-[1fr_11rem] sm:items-end">
                <div>
                  <p className="text-sm text-[#697180]">VIP Guest</p>
                  <p className="mt-1 text-3xl font-semibold">Ada Okafor</p>
                  <p className="mt-8 text-sm text-[#697180]">June 28, 2026</p>
                  <p className="mt-1 font-medium">Civic Hall</p>
                </div>
                <QrCodeImage value={qrValue} label="QRPass demo QR code" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
              <span className="text-[#697180]">Verification status</span>
              <span className="font-medium text-emerald-700">Scannable</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-background p-5 text-center shadow-xs">
              <p className="text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            Everything a small event team needs.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} variant="interactive" size="lg">
              <CardHeader>
                <div className="mb-3 grid size-11 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="leading-6 text-muted-foreground">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="templates" className="bg-[#111827] py-16 text-white sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="self-center">
            <p className="text-sm font-medium text-white/60">Interactive preview</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Customize once. Export everywhere.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
              Switch templates, apply brand colors, upload a logo, and keep a
              scannable QR visible before downloading passes.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {templates.map((template) => (
              <div key={template.name} className={cn("rounded-2xl p-4 shadow-sm", template.className)}>
                <div className={cn("size-8 rounded-lg", template.accent)} />
                <p className="mt-8 text-xs font-semibold uppercase tracking-normal opacity-70">
                  {template.name}
                </p>
                <p className="mt-2 text-xl font-semibold">QRPass Entry</p>
                <div className="mt-5 h-20 rounded-xl bg-current/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {workflow.map((step, index) => (
            <div key={step.title} className="rounded-xl border bg-card p-5 shadow-xs">
              <span className="grid size-10 place-items-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <step.icon className="mt-8 size-5 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="mobile-experience" className="border-y bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Mobile-first</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Verify guests from the door.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              QRPass keeps primary actions thumb-friendly: create, preview,
              export, and verify all work cleanly on phones.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[Smartphone, ScanLine, ShieldCheck].map((Icon, index) => (
              <div key={index} className="rounded-2xl border bg-background p-5 shadow-xs">
                <Icon className="size-6 text-muted-foreground" />
                <p className="mt-12 text-sm font-medium">
                  {["Responsive pass editor", "Scanner-ready verification", "Protected organizer data"][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-muted-foreground">Pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              One plan for fast event teams.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              Straightforward pricing that scales from single events to team collaboration.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col rounded-2xl border bg-background p-8 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Starter</span>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">Free</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Perfect for testing QRPass with single events and basic pass exports.</p>
              <div className="mt-auto pt-8">
                <Link href={getStartedHref} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-center")}>
                  Get started
                </Link>
              </div>
            </div>
            <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-primary/5 p-8 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1">
                <span className="text-xs font-semibold text-primary-foreground">Most popular</span>
              </div>
              <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary">Professional</span>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">$12</span>
                <span className="text-sm font-medium text-muted-foreground">/month</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Everything you need: unlimited events, templates, CSV uploads, and mobile verification.</p>
              <div className="mt-auto pt-8">
                <Link href={getStartedHref} className={cn(buttonVariants({ size: "sm" }), "w-full justify-center")}>
                  Get started
                </Link>
              </div>
            </div>
            <div className="flex flex-col rounded-2xl border bg-background p-8 shadow-xs transition-all hover:border-primary/40 hover:shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team</span>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">Custom</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Advanced features, team collaboration, and priority support for large organizations.</p>
              <div className="mt-auto pt-8">
                <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-center")}>
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">FAQ</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
            Answers for organizers.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            {
              question: "Can I brand passes for sponsors?",
              answer: "Yes. Add logos, colors, and a headline for each event pass template.",
            },
            {
              question: "Do guests need an app to verify?",
              answer: "No. Verification works in the browser from the organizer scanner view.",
            },
            {
              question: "Can I export PNG and PDF passes?",
              answer: "Absolutely. QRPass exports high-quality files ready for sharing.",
            },
            {
              question: "Is mobile verification included?",
              answer: "Yes. Mobile scanning is built directly into the organizer dashboard.",
            },
          ].map((item) => (
            <div key={item.question} className="rounded-3xl border bg-card p-6 shadow-sm">
              <p className="font-medium">{item.question}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-foreground to-[#0a0f1a] py-20 sm:py-24 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-8 px-4 text-center sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold tracking-normal sm:text-5xl lg:text-6xl">
              Start creating passes today.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Build branded QR passes, manage attendees, and verify entries—all in one fast, mobile-first workflow.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={getStartedHref}
              className={cn(buttonVariants({ size: "lg" }), "bg-white text-foreground hover:bg-white/90 font-semibold")}
            >
              Get started free <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-white/30 px-6 py-3 text-base font-medium text-white transition-all hover:border-white/60 hover:bg-white/5"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t bg-background/50 py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-semibold text-foreground">QRPass</p>
              <p className="mt-1 text-xs">Modern QR pass generation for event teams.</p>
            </div>
            <nav className="flex gap-6 text-xs">
              <Link href="#features" className="transition hover:text-foreground">
                Features
              </Link>
              <Link href="#pricing" className="transition hover:text-foreground">
                Pricing
              </Link>
              <a href="#" className="transition hover:text-foreground">
                Status
              </a>
            </nav>
          </div>
          <div className="border-t border-border/50 pt-4 text-xs">
            <p>© 2026 QRPass. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
