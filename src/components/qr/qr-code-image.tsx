"use client"

import * as React from "react"
import QRCode from "qrcode"

import { cn } from "@/lib/utils"

type QrCodeImageProps = {
  value: string
  label: string
  size?: number
  className?: string
}

export function QrCodeImage({
  value,
  label,
  size = 512,
  className,
}: QrCodeImageProps) {
  const [src, setSrc] = React.useState<string>()

  React.useEffect(() => {
    let active = true

    QRCode.toDataURL(value, {
      errorCorrectionLevel: "M",
      margin: 4,
      scale: 8,
      width: size,
      color: {
        dark: "#0b1020",
        light: "#ffffff",
      },
    })
      .then((dataUrl) => {
        if (active) setSrc(dataUrl)
      })
      .catch(() => {
        if (active) setSrc(undefined)
      })

    return () => {
      active = false
    }
  }, [size, value])

  return (
    <div
      className={cn(
        "grid aspect-square place-items-center rounded-2xl bg-white p-3 text-[#0b1020]",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          className="size-full object-contain"
          decoding="async"
        />
      ) : (
        <div className="size-full animate-pulse rounded-xl bg-zinc-100" aria-hidden="true" />
      )}
    </div>
  )
}
