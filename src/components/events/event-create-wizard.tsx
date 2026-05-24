"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  FileUp,
  MapPin,
  Palette,
  TicketCheck,
  Users,
  type LucideIcon,
} from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCodeImage } from "@/components/qr/qr-code-image"
import { buildVerificationUrl } from "@/features/passes/qr-payload"
import { cn } from "@/lib/utils"
import type { EventActionState } from "@/server/actions/events"

const templates = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean monochrome pass for focused events.",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Soft premium layout with generous spacing.",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Structured pass for formal gatherings.",
  },
  {
    id: "dark",
    name: "Dark",
    description: "High-contrast pass with a modern feel.",
  },
] as const

const presetPalettes = [
  {
    name: "QRPass",
    colors: ["#5B5BD6", "#22C55E", "#F59E0B"],
  },
  {
    name: "Mono",
    colors: ["#111827", "#6B7280", "#E5E7EB"],
  },
  {
    name: "Summit",
    colors: ["#1D4ED8", "#06B6D4", "#A7F3D0"],
  },
  {
    name: "Gala",
    colors: ["#6D28D9", "#BE185D", "#FDE68A"],
  },
] as const

const eventDraftKey = "qrpass:event-create-draft"

const wizardSchema = z
  .object({
    name: z
      .string()
      .min(2, "Event name is required")
      .max(120, "Keep the event name under 120 characters."),
    slug: z
      .string()
      .min(2, "Slug is required")
      .max(80, "Keep the slug under 80 characters.")
      .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
    venue: z.string().max(160, "Keep the venue under 160 characters.").optional(),
    startsAt: z.string().min(1, "Start date is required"),
    endsAt: z.string().optional(),
    brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Choose a valid color"),
    brandColorSecondary: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Choose a valid color")
      .optional(),
    brandColorTertiary: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, "Choose a valid color")
      .optional(),
    template: z.enum(["minimal", "elegant", "corporate", "dark"]),
    bannerName: z.string().optional(),
    logoName: z.string().optional(),
    organizerName: z
      .string()
      .max(120, "Keep the organizer name under 120 characters.")
      .optional(),
    attendeeEstimate: z.number().int().min(0).max(100000).optional(),
  })
  .superRefine((value, context) => {
    if (!value.endsAt) return

    const startsAt = new Date(value.startsAt).getTime()
    const endsAt = new Date(value.endsAt).getTime()

    if (Number.isFinite(startsAt) && Number.isFinite(endsAt) && endsAt <= startsAt) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "End time must be after the start time.",
      })
    }
  })

type WizardInput = z.infer<typeof wizardSchema>
type StepId = "details" | "branding" | "attendees" | "review"

type EventCreateWizardProps = {
  action: (
    previousState: EventActionState,
    formData: FormData
  ) => Promise<EventActionState>
}

type EventCreateDraft = {
  values: Partial<WizardInput>
  stepIndex: number
  bannerPreviewUrl?: string
  logoPreviewUrl?: string
  savedAt: string
}

const steps: Array<{
  id: StepId
  title: string
  description: string
  fields: Array<keyof WizardInput>
}> = [
  {
    id: "details",
    title: "Event details",
    description: "Start with the essentials guests will see on the pass.",
    fields: ["name", "slug", "venue", "startsAt", "endsAt", "organizerName"],
  },
  {
    id: "branding",
    title: "Branding",
    description: "Choose a template and accent color for the first preview.",
    fields: [
      "template",
      "brandColor",
      "brandColorSecondary",
      "brandColorTertiary",
      "bannerName",
      "logoName",
    ],
  },
  {
    id: "attendees",
    title: "Attendees",
    description: "Plan how attendee records will be added after setup.",
    fields: ["attendeeEstimate"],
  },
  {
    id: "review",
    title: "Review",
    description: "Confirm the pass preview before creating the event.",
    fields: [],
  },
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function FieldError({ message, id }: { message?: string; id: string }) {
  if (!message) return null

  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  )
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "")
  const value = Number.parseInt(normalized, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  }
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(foreground: string, background: string) {
  const light = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (light + 0.05) / (dark + 0.05)
}

export function EventCreateWizard({ action }: EventCreateWizardProps) {
  const [stepIndex, setStepIndex] = React.useState(0)
  const [slugEdited, setSlugEdited] = React.useState(false)
  const [bannerPreviewUrl, setBannerPreviewUrl] = React.useState<string>()
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string>()
  const [bannerError, setBannerError] = React.useState<string>()
  const [logoError, setLogoError] = React.useState<string>()
  const [draftRestored, setDraftRestored] = React.useState(false)
  const hasHydratedDraft = React.useRef(false)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [actionState, formAction, isActionPending] = React.useActionState(action, {})

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors, isValid },
  } = useForm<WizardInput>({
    resolver: zodResolver(wizardSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      venue: "",
      startsAt: "",
      endsAt: "",
      brandColor: "#5B5BD6",
      brandColorSecondary: "#22C55E",
      brandColorTertiary: "#F59E0B",
      template: "elegant",
      bannerName: "",
      logoName: "",
      organizerName: "",
      attendeeEstimate: 0,
    },
  })

  const values = useWatch({ control })
  const currentStep = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1
  const brandColors = [
    values.brandColor || "#5B5BD6",
    values.brandColorSecondary || "#22C55E",
    values.brandColorTertiary || "#F59E0B",
  ]
  const primaryContrastOnWhite = contrastRatio(brandColors[0], "#ffffff")
  const primaryContrastOnDark = contrastRatio(brandColors[0], "#111827")

  function applyPalette(colors: readonly string[]) {
    setValue("brandColor", colors[0], { shouldDirty: true, shouldValidate: true })
    setValue("brandColorSecondary", colors[1], {
      shouldDirty: true,
      shouldValidate: true,
    })
    setValue("brandColorTertiary", colors[2], {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  React.useEffect(() => {
    const rawDraft = window.localStorage.getItem(eventDraftKey)

    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft) as EventCreateDraft
        Object.entries(draft.values).forEach(([key, value]) => {
          setValue(key as keyof WizardInput, value as never, {
            shouldDirty: true,
            shouldValidate: true,
          })
        })
        queueMicrotask(() => {
          setStepIndex(Math.min(Math.max(draft.stepIndex ?? 0, 0), steps.length - 1))
          setBannerPreviewUrl(draft.bannerPreviewUrl)
          setLogoPreviewUrl(draft.logoPreviewUrl)
          setSlugEdited(Boolean(draft.values.slug))
          setDraftRestored(true)
        })
      } catch {
        window.localStorage.removeItem(eventDraftKey)
      }
    }

    hasHydratedDraft.current = true
  }, [setValue])

  React.useEffect(() => {
    if (!hasHydratedDraft.current) return

    const draft: EventCreateDraft = {
      values,
      stepIndex,
      bannerPreviewUrl,
      logoPreviewUrl,
      savedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(eventDraftKey, JSON.stringify(draft))
  }, [bannerPreviewUrl, logoPreviewUrl, stepIndex, values])

  React.useEffect(() => {
    if (!slugEdited) {
      setValue("slug", slugify(values.name ?? ""), {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }, [setValue, slugEdited, values.name])

  function updateBanner(file?: File) {
    setBannerError(undefined)

    if (!file) {
      setBannerPreviewUrl(undefined)
      setValue("bannerName", "", { shouldValidate: true })
      return
    }

    if (!file.type.startsWith("image/")) {
      setBannerError("Upload a PNG, JPG, or WebP image.")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setBannerError("Keep the banner image under 2 MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setBannerPreviewUrl(String(reader.result))
      setValue("bannerName", file.name, { shouldValidate: true, shouldDirty: true })
    }
    reader.readAsDataURL(file)
  }

  function updateLogo(file?: File) {
    setLogoError(undefined)

    if (!file) {
      setLogoPreviewUrl(undefined)
      setValue("logoName", "", { shouldValidate: true })
      return
    }

    if (!file.type.startsWith("image/")) {
      setLogoError("Upload a PNG, JPG, SVG, or WebP logo.")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Keep the logo image under 2 MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setLogoPreviewUrl(String(reader.result))
      setValue("logoName", file.name, { shouldValidate: true, shouldDirty: true })
    }
    reader.readAsDataURL(file)
  }

  async function goNext() {
    const valid = await trigger(currentStep.fields)

    if (valid) {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1))
    }
  }

  function goBack() {
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  function submitIfValid() {
    void handleSubmit(() => {
      window.localStorage.removeItem(eventDraftKey)
      formRef.current?.requestSubmit()
    })()
  }

  return (
    <div className="grid gap-6 pb-40 lg:pb-28 xl:grid-cols-[minmax(0,1fr)_26rem]">
      <form ref={formRef} action={formAction} className="grid gap-6">
        <HiddenEventFields values={values} />
        <Card size="lg" variant="elevated">
          <CardHeader>
            {draftRestored ? (
              <div className="mb-4 rounded-xl border bg-emerald-50 p-3 text-sm text-emerald-800">
                Continue where you left off. Your draft details, template, colors,
                and available uploaded previews were restored.
              </div>
            ) : null}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Step {stepIndex + 1} of {steps.length}
                </p>
                <CardTitle className="mt-2 text-2xl">{currentStep.title}</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {currentStep.description}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2" aria-label="Event creation progress">
                {steps.map((step, index) => {
                  const complete = index < stepIndex
                  const active = index === stepIndex
                  const locked = index > stepIndex

                  return (
                    <button
                      key={step.id}
                      type="button"
                      aria-current={active ? "step" : undefined}
                      disabled={locked}
                      onClick={() => {
                        if (!locked) setStepIndex(index)
                      }}
                      className={cn(
                        "grid size-10 place-items-center rounded-lg border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35",
                        active && "border-primary bg-primary text-primary-foreground",
                        complete && "border-emerald-600 bg-emerald-600 text-white",
                        !active && !complete && "bg-background text-muted-foreground",
                        locked && "cursor-not-allowed opacity-60"
                      )}
                    >
                      {complete ? <Check className="size-4" /> : index + 1}
                      <span className="sr-only">{step.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {currentStep.id === "details" ? (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Event name</Label>
                  <Input
                    id="name"
                    placeholder="Lagos Tech Mixer"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    {...register("name")}
                  />
                  <FieldError id="name-error" message={errors.name?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slug">Public slug</Label>
                  <Input
                    id="slug"
                    placeholder="lagos-tech-mixer"
                    aria-invalid={!!errors.slug}
                    aria-describedby={errors.slug ? "slug-error" : undefined}
                    {...register("slug", {
                      onChange: () => setSlugEdited(true),
                    })}
                  />
                  <FieldError id="slug-error" message={errors.slug?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    placeholder="Civic Hall"
                    aria-invalid={!!errors.venue}
                    aria-describedby={errors.venue ? "venue-error" : undefined}
                    {...register("venue")}
                  />
                  <FieldError id="venue-error" message={errors.venue?.message} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="startsAt">Starts at</Label>
                    <Input
                      id="startsAt"
                      type="datetime-local"
                      aria-invalid={!!errors.startsAt}
                      aria-describedby={errors.startsAt ? "startsAt-error" : undefined}
                      {...register("startsAt")}
                    />
                    <FieldError id="startsAt-error" message={errors.startsAt?.message} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endsAt">Ends at</Label>
                    <Input
                      id="endsAt"
                      type="datetime-local"
                      aria-invalid={!!errors.endsAt}
                      aria-describedby={errors.endsAt ? "endsAt-error" : undefined}
                      {...register("endsAt")}
                    />
                    <FieldError id="endsAt-error" message={errors.endsAt?.message} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="organizerName">Organizer name</Label>
                  <Input
                    id="organizerName"
                    placeholder="QRPass Studio"
                    aria-invalid={!!errors.organizerName}
                    aria-describedby={
                      errors.organizerName ? "organizerName-error" : undefined
                    }
                    {...register("organizerName")}
                  />
                  <FieldError
                    id="organizerName-error"
                    message={errors.organizerName?.message}
                  />
                </div>
              </div>
            ) : null}

            {currentStep.id === "branding" ? (
              <div className="grid gap-5">
                <fieldset className="grid gap-3">
                  <legend className="text-sm font-medium">Pass template</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {templates.map((template) => (
                      <label
                        key={template.id}
                        className={cn(
                          "cursor-pointer rounded-xl border bg-background p-4 shadow-xs transition-colors hover:border-ring/40 focus-within:ring-3 focus-within:ring-ring/35",
                          values.template === template.id && "border-primary ring-3 ring-ring/20"
                        )}
                      >
                        <input
                          type="radio"
                          value={template.id}
                          className="sr-only"
                          {...register("template")}
                        />
                        <span className="font-medium">{template.name}</span>
                        <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                          {template.description}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="grid gap-3">
                  <legend className="text-sm font-medium">Brand colors</legend>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Add up to three colors for pass accents and gradients.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {presetPalettes.map((palette) => (
                      <button
                        key={palette.name}
                        type="button"
                        onClick={() => applyPalette(palette.colors)}
                        className="flex min-h-12 items-center justify-between gap-3 rounded-xl border bg-background p-3 text-left text-sm font-medium shadow-xs transition-colors hover:border-ring/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/35"
                      >
                        <span>{palette.name}</span>
                        <span className="flex items-center gap-1" aria-hidden="true">
                          {palette.colors.map((color) => (
                            <span
                              key={color}
                              className="size-5 rounded-md border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="brandColor">Primary</Label>
                      <Input
                        id="brandColor"
                        type="color"
                        inputSize="lg"
                        className="h-12 w-full p-1"
                        aria-invalid={!!errors.brandColor}
                        aria-describedby={errors.brandColor ? "brandColor-error" : undefined}
                        {...register("brandColor")}
                      />
                      <FieldError id="brandColor-error" message={errors.brandColor?.message} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brandColorSecondary">Secondary</Label>
                      <Input
                        id="brandColorSecondary"
                        type="color"
                        inputSize="lg"
                        className="h-12 w-full p-1"
                        aria-invalid={!!errors.brandColorSecondary}
                        aria-describedby={
                          errors.brandColorSecondary ? "brandColorSecondary-error" : undefined
                        }
                        {...register("brandColorSecondary")}
                      />
                      <FieldError
                        id="brandColorSecondary-error"
                        message={errors.brandColorSecondary?.message}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brandColorTertiary">Tertiary</Label>
                      <Input
                        id="brandColorTertiary"
                        type="color"
                        inputSize="lg"
                        className="h-12 w-full p-1"
                        aria-invalid={!!errors.brandColorTertiary}
                        aria-describedby={
                          errors.brandColorTertiary ? "brandColorTertiary-error" : undefined
                        }
                        {...register("brandColorTertiary")}
                      />
                      <FieldError
                        id="brandColorTertiary-error"
                        message={errors.brandColorTertiary?.message}
                      />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-xl border p-3 text-sm leading-6",
                      primaryContrastOnWhite >= 3 || primaryContrastOnDark >= 3
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-900"
                    )}
                  >
                    {primaryContrastOnWhite >= 3 || primaryContrastOnDark >= 3
                      ? "Contrast looks usable for pass accents."
                      : "Primary color may be too low-contrast. Choose a stronger shade for text and QR-adjacent accents."}
                  </div>
                </fieldset>

                <div className="grid gap-2">
                  <Label htmlFor="logo">Logo attachment</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    aria-invalid={!!logoError}
                    aria-describedby={logoError ? "logo-error" : "logo-help"}
                    onChange={(event) => updateLogo(event.target.files?.[0])}
                  />
                  <p id="logo-help" className="text-sm leading-6 text-muted-foreground">
                    Optional. Any uploaded logo is scaled into a 1.5 inch box at the
                    top-left of the pass without stretching.
                  </p>
                  <FieldError id="logo-error" message={logoError} />
                  {logoPreviewUrl ? (
                    <button
                      type="button"
                      className="w-fit text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      onClick={() => updateLogo()}
                    >
                      Remove logo
                    </button>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="banner">Banner image</Label>
                  <Input
                    id="banner"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    aria-invalid={!!bannerError}
                    aria-describedby={bannerError ? "banner-error" : "banner-help"}
                    onChange={(event) => updateBanner(event.target.files?.[0])}
                  />
                  <p id="banner-help" className="text-sm leading-6 text-muted-foreground">
                    Optional. Use a wide image under 2 MB for the pass header.
                  </p>
                  <FieldError id="banner-error" message={bannerError} />
                  {bannerPreviewUrl ? (
                    <button
                      type="button"
                      className="w-fit text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      onClick={() => updateBanner()}
                    >
                      Remove banner
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {currentStep.id === "attendees" ? (
              <div className="grid gap-5">
                <div className="rounded-xl border bg-muted/50 p-4">
                  <div className="flex items-start gap-3">
                    <FileUp className="mt-0.5 size-5 text-muted-foreground" />
                    <div>
                      <h2 className="font-medium">Add attendees after event setup</h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        Keep creation fast now. Once the event exists, you can add guests
                        manually or upload a CSV file.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="attendeeEstimate">Expected attendees</Label>
                  <Input
                    id="attendeeEstimate"
                    type="number"
                    min={0}
                    placeholder="250"
                    aria-invalid={!!errors.attendeeEstimate}
                    aria-describedby={
                      errors.attendeeEstimate ? "attendeeEstimate-error" : undefined
                    }
                    {...register("attendeeEstimate", { valueAsNumber: true })}
                  />
                  <FieldError
                    id="attendeeEstimate-error"
                    message={errors.attendeeEstimate?.message}
                  />
                </div>
              </div>
            ) : null}

            {currentStep.id === "review" ? (
              <div className="grid gap-4">
                {actionState.error ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
                  >
                    {actionState.error}
                  </div>
                ) : null}
                <div className="rounded-xl border bg-muted/50 p-4">
                  <h2 className="font-medium">Ready to create</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Your event shell will be created first. Branding, attendees,
                    generated QR passes, and exports can continue from the event page.
                  </p>
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <SummaryItem label="Event" value={values.name || "Untitled event"} />
                  <SummaryItem label="Slug" value={values.slug || "event-slug"} />
                  <SummaryItem label="Template" value={values.template || "elegant"} />
                  <SummaryItem label="Attendees" value={String(values.attendeeEstimate ?? 0)} />
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="fixed inset-x-0 bottom-[4.75rem] z-40 flex flex-col-reverse gap-3 border-t bg-background/95 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-lg backdrop-blur sm:flex-row sm:justify-between lg:bottom-0 lg:left-64 lg:px-8">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={stepIndex === 0 || isActionPending}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          {isLastStep ? (
            <Button
              type="button"
              onClick={submitIfValid}
              disabled={!isValid || isActionPending}
              className="sm:min-w-36"
            >
              {isActionPending ? "Creating..." : "Create event"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goNext}
              disabled={isActionPending}
              className="sm:min-w-36"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </form>

      <aside className="xl:sticky xl:top-8 xl:self-start">
        <LivePassPreview
          values={values}
          bannerPreviewUrl={bannerPreviewUrl}
          logoPreviewUrl={logoPreviewUrl}
        />
      </aside>
    </div>
  )
}

function HiddenEventFields({ values }: { values: Partial<WizardInput> }) {
  return (
    <div aria-hidden="true" className="hidden">
      <input name="name" readOnly value={values.name ?? ""} />
      <input name="slug" readOnly value={values.slug ?? ""} />
      <input name="venue" readOnly value={values.venue ?? ""} />
      <input name="startsAt" readOnly value={values.startsAt ?? ""} />
      <input name="endsAt" readOnly value={values.endsAt ?? ""} />
      <input name="brandColor" readOnly value={values.brandColor ?? "#5B5BD6"} />
      <input
        name="brandColorSecondary"
        readOnly
        value={values.brandColorSecondary ?? ""}
      />
      <input
        name="brandColorTertiary"
        readOnly
        value={values.brandColorTertiary ?? ""}
      />
      <input name="template" readOnly value={values.template ?? "elegant"} />
      <input name="bannerName" readOnly value={values.bannerName ?? ""} />
      <input name="logoName" readOnly value={values.logoName ?? ""} />
      <input name="organizerName" readOnly value={values.organizerName ?? ""} />
      <input
        name="attendeeEstimate"
        readOnly
        value={String(values.attendeeEstimate ?? 0)}
      />
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background p-3 shadow-xs">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 truncate font-medium">{value}</p>
    </div>
  )
}

function LivePassPreview({
  values,
  bannerPreviewUrl,
  logoPreviewUrl,
}: {
  values: Partial<WizardInput>
  bannerPreviewUrl?: string
  logoPreviewUrl?: string
}) {
  const name = values.name || "Lagos Tech Mixer"
  const venue = values.venue || "Civic Hall"
  const brandColors = [
    values.brandColor || "#5B5BD6",
    values.brandColorSecondary || "#22C55E",
    values.brandColorTertiary || "#F59E0B",
  ].filter(Boolean)
  const template = values.template || "elegant"
  const organizer = values.organizerName || "QRPass Studio"
  const qrValue = buildVerificationUrl({
    eventId: values.slug || "demo-event",
    attendeeId: "demo-attendee-001",
    passId: "demo-pass-001",
  })
  const startsAt = values.startsAt
    ? new Date(values.startsAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Event date"
  const logo = (
    <div className="grid h-[1.5in] w-[1.5in] shrink-0 place-items-center rounded-2xl border border-black/10 bg-white/95 p-3 text-[#111827] shadow-sm">
      {logoPreviewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoPreviewUrl} alt="" className="h-full w-full object-contain" />
      ) : (
        <TicketCheck className="size-12" />
      )}
    </div>
  )
  const banner = bannerPreviewUrl ? (
    <div className="relative h-28 overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={bannerPreviewUrl} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/55" />
    </div>
  ) : null

  return (
    <Card size="lg" variant="pass" className="overflow-visible">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Live preview</p>
            <CardTitle className="mt-1">Generated pass</CardTitle>
          </div>
          <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium capitalize text-muted-foreground">
            {template}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {template === "minimal" ? (
          <div className="rounded-[1.75rem] border bg-white p-5 text-[#111827] shadow-sm">
            <div className="flex items-start justify-between gap-4">
              {logo}
              <p className="text-right text-xs font-semibold uppercase tracking-normal text-zinc-500">
                Minimal
              </p>
            </div>
            <div className="mt-8 border-t pt-6">
              <p className="text-sm text-zinc-500">{organizer}</p>
              <h2 className="mt-2 break-words text-3xl font-semibold">{name}</h2>
              <p className="mt-1 text-sm text-zinc-500">{venue}</p>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_10rem] sm:items-end">
              <div>
                <p className="text-sm text-zinc-500">Attendee</p>
                <p className="mt-1 break-words text-2xl font-semibold">Ada Okafor</p>
                <p className="mt-6 text-sm font-medium">{startsAt}</p>
              </div>
              <QrCodeImage value={qrValue} label="Demo verification QR code" />
            </div>
          </div>
        ) : null}

        {template === "elegant" ? (
          <div
            className="rounded-[1.75rem] p-4 text-white shadow-lg"
            style={{
              background: `linear-gradient(145deg, ${brandColors.join(", ")}, #111827)`,
            }}
          >
            <div className="rounded-[1.35rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                {logo}
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                  VIP
                </span>
              </div>
              {banner ? <div className="mt-5">{banner}</div> : null}
              <div className="mt-8">
                <p className="text-xs font-medium uppercase tracking-normal text-white/65">
                  {organizer}
                </p>
                <h2 className="mt-2 break-words text-3xl font-semibold leading-tight">
                  {name}
                </h2>
                <p className="mt-5 text-sm text-white/65">Attendee</p>
                <p className="mt-1 break-words text-3xl font-semibold">Ada Okafor</p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_11rem] sm:items-end">
                <div className="grid gap-3 text-sm">
                  <PassMeta icon={CalendarDays} label="Date" value={startsAt} />
                  <PassMeta icon={MapPin} label="Venue" value={venue} />
                </div>
                <QrCodeImage value={qrValue} label="Demo verification QR code" />
              </div>
            </div>
          </div>
        ) : null}

        {template === "corporate" ? (
          <div className="overflow-hidden rounded-[1.75rem] border bg-white text-[#111827] shadow-sm">
            <div className="grid min-h-28 place-items-start p-5" style={{ backgroundColor: brandColors[0] }}>
              <div className="flex w-full items-start justify-between gap-4">
                {logo}
                <span className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-[#111827]">
                  Corporate
                </span>
              </div>
            </div>
            {banner ? <div className="px-5 pt-5">{banner}</div> : null}
            <div className="grid gap-5 p-5">
              <div className="border-b pb-5">
                <p className="text-xs font-semibold uppercase tracking-normal text-zinc-500">
                  {organizer}
                </p>
                <h2 className="mt-2 break-words text-2xl font-semibold">{name}</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-[1fr_9.5rem]">
                <div className="grid content-between gap-5">
                  <div>
                    <p className="text-sm text-zinc-500">Registered attendee</p>
                    <p className="mt-1 break-words text-2xl font-semibold">Ada Okafor</p>
                  </div>
                  <div className="grid gap-2 text-sm">
                    <PassMeta icon={CalendarDays} label="Date" value={startsAt} subtle />
                    <PassMeta icon={MapPin} label="Venue" value={venue} subtle />
                  </div>
                </div>
                <QrCodeImage value={qrValue} label="Demo verification QR code" />
              </div>
            </div>
          </div>
        ) : null}

        {template === "dark" ? (
          <div className="rounded-[1.75rem] bg-[#080b12] p-4 text-white shadow-xl">
            <div className="rounded-[1.35rem] border border-cyan-300/25 bg-[#111827] p-4 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
              <div className="flex items-start justify-between gap-4">
                {logo}
                <span className="rounded-full border border-cyan-300/40 px-3 py-1 text-xs font-medium text-cyan-200">
                  Scan ready
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_9.5rem]">
                <div>
                  {banner ? <div className="mb-5">{banner}</div> : null}
                  <p className="text-xs font-medium uppercase tracking-normal text-cyan-200">
                    {organizer}
                  </p>
                  <h2 className="mt-2 break-words text-3xl font-semibold leading-tight text-white">
                    {name}
                  </h2>
                  <p className="mt-8 text-sm text-white/55">Attendee</p>
                  <p className="mt-1 break-words text-2xl font-semibold text-cyan-50">
                    Ada Okafor
                  </p>
                </div>
                <div className="grid content-end gap-4">
                  <QrCodeImage
                    value={qrValue}
                    label="Demo verification QR code"
                    className="shadow-[0_0_30px_rgba(34,211,238,0.28)]"
                  />
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <PassMeta icon={CalendarDays} label="Date" value={startsAt} dark />
                <PassMeta icon={MapPin} label="Venue" value={venue} dark />
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-muted/60 p-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="size-3.5" />
              Expected
            </p>
            <p className="mt-1 font-semibold">{values.attendeeEstimate ?? 0}</p>
          </div>
          <div className="rounded-xl bg-muted/60 p-3">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Palette className="size-3.5" />
              Accent
            </p>
            <div className="mt-2 flex min-w-0 items-center gap-2">
              {brandColors.map((color) => (
                <span
                  key={color}
                  className="size-5 shrink-0 rounded-md border"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="truncate font-medium">{brandColors.length} colors</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PassMeta({
  icon: Icon,
  label,
  value,
  subtle,
  dark,
}: {
  icon: LucideIcon
  label: string
  value: string
  subtle?: boolean
  dark?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-3",
        subtle && "bg-zinc-50 text-zinc-700",
        dark && "bg-white/5 text-white",
        !subtle && !dark && "bg-white/10 text-white"
      )}
    >
      <p
        className={cn(
          "flex items-center gap-2 text-xs",
          subtle && "text-zinc-500",
          dark && "text-white/55",
          !subtle && !dark && "text-white/65"
        )}
      >
        <Icon className="size-4" />
        {label}
      </p>
      <p className="mt-1 break-words font-medium">{value}</p>
    </div>
  )
}
