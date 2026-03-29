"use client"

import type { ReactNode } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

type DialogProps = DialogPrimitive.Root.Props

export function Dialog({ ...props }: DialogProps): ReactNode {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

type DialogTriggerProps = DialogPrimitive.Trigger.Props

export function DialogTrigger({ ...props }: DialogTriggerProps): ReactNode {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

type DialogPortalProps = DialogPrimitive.Portal.Props

export function DialogPortal({ ...props }: DialogPortalProps): ReactNode {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

type DialogCloseProps = DialogPrimitive.Close.Props

export function DialogClose({ ...props }: DialogCloseProps): ReactNode {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

interface DialogOverlayProps extends DialogPrimitive.Backdrop.Props {
  className?: string
}

export function DialogOverlay({
  className,
  ...props
}: DialogOverlayProps): ReactNode {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

interface DialogContentProps extends DialogPrimitive.Popup.Props {
  className?: string
  showCloseButton?: boolean
}

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps): ReactNode {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function DialogHeader({ className, ...props }: DialogHeaderProps): ReactNode {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  showCloseButton?: boolean
}

export function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: DialogFooterProps): ReactNode {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

interface DialogTitleProps extends DialogPrimitive.Title.Props {
  className?: string
}

export function DialogTitle({ className, ...props }: DialogTitleProps): ReactNode {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

interface DialogDescriptionProps extends DialogPrimitive.Description.Props {
  className?: string
}

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps): ReactNode {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

// All components exported above with individual export keywords
