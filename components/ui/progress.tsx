"use client"

import type { ReactNode } from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

export function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props): ReactNode {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={cn("flex flex-wrap gap-3", className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

interface ProgressTrackProps extends ProgressPrimitive.Track.Props {
  className?: string
}

export function ProgressTrack({ className, ...props }: ProgressTrackProps): ReactNode {
  return (
    <ProgressPrimitive.Track
      className={cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  )
}

interface ProgressIndicatorProps extends ProgressPrimitive.Indicator.Props {
  className?: string
}

export function ProgressIndicator({
  className,
  ...props
}: ProgressIndicatorProps): ReactNode {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cn("h-full bg-primary transition-all", className)}
      {...props}
    />
  )
}

interface ProgressLabelProps extends ProgressPrimitive.Label.Props {
  className?: string
}

export function ProgressLabel({ className, ...props }: ProgressLabelProps): ReactNode {
  return (
    <ProgressPrimitive.Label
      className={cn("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

interface ProgressValueProps extends ProgressPrimitive.Value.Props {
  className?: string
}

export function ProgressValue({ className, ...props }: ProgressValueProps): ReactNode {
  return (
    <ProgressPrimitive.Value
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

// All components exported above with individual export keywords
