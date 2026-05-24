"use client"

import * as React from "react"
import { Dialog as ModalPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Modal({ ...props }: ModalPrimitive.Root.Props) {
  return <ModalPrimitive.Root data-slot="modal" {...props} />
}

function ModalTrigger({ ...props }: ModalPrimitive.Trigger.Props) {
  return <ModalPrimitive.Trigger data-slot="modal-trigger" {...props} />
}

function ModalClose({ ...props }: ModalPrimitive.Close.Props) {
  return <ModalPrimitive.Close data-slot="modal-close" {...props} />
}

function ModalPortal({ ...props }: ModalPrimitive.Portal.Props) {
  return <ModalPrimitive.Portal data-slot="modal-portal" {...props} />
}

function ModalOverlay({ className, ...props }: ModalPrimitive.Backdrop.Props) {
  return (
    <ModalPrimitive.Backdrop
      data-slot="modal-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/35 transition-opacity duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function ModalContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: ModalPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <ModalPortal>
      <ModalOverlay />
      <ModalPrimitive.Popup
        data-slot="modal-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-5 rounded-2xl border bg-popover p-5 text-popover-foreground shadow-xl outline-none transition-all duration-200 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 sm:p-6",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <ModalPrimitive.Close
            data-slot="modal-close"
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close modal</span>
          </ModalPrimitive.Close>
        ) : null}
      </ModalPrimitive.Popup>
    </ModalPortal>
  )
}

function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-header"
      className={cn("grid gap-1.5 pr-8 text-left", className)}
      {...props}
    />
  )
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="modal-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function ModalTitle({ className, ...props }: ModalPrimitive.Title.Props) {
  return (
    <ModalPrimitive.Title
      data-slot="modal-title"
      className={cn("text-lg font-semibold leading-none tracking-normal", className)}
      {...props}
    />
  )
}

function ModalDescription({
  className,
  ...props
}: ModalPrimitive.Description.Props) {
  return (
    <ModalPrimitive.Description
      data-slot="modal-description"
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
}
