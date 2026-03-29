import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
  size?: "default" | "sm"
  children?: ReactNode
}

export function Card({
  className,
  size = "default",
  ...props
}: CardProps & Omit<React.HTMLAttributes<HTMLDivElement>, keyof CardProps>): ReactNode {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

interface CardHeaderProps {
  className?: string
  children?: ReactNode
}

export function CardHeader({ className, ...props }: CardHeaderProps & React.HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

interface CardTitleProps {
  className?: string
  children?: ReactNode
}

export function CardTitle({ className, ...props }: CardTitleProps & React.HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

interface CardDescriptionProps {
  className?: string
  children?: ReactNode
}

export function CardDescription({ className, ...props }: CardDescriptionProps & React.HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

interface CardActionProps {
  className?: string
  children?: ReactNode
}

export function CardAction({ className, ...props }: CardActionProps & React.HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

interface CardContentProps {
  className?: string
  children?: ReactNode
}

export function CardContent({ className, ...props }: CardContentProps & React.HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

interface CardFooterProps {
  className?: string
  children?: ReactNode
}

export function CardFooter({ className, ...props }: CardFooterProps & React.HTMLAttributes<HTMLDivElement>): ReactNode {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

// All components exported above with individual export keywords
