'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressCardProps {
  className?: string
  title: string
  value: number
  description?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function ProgressCard({
  className,
  title,
  value,
  description,
  icon,
  trend,
}: ProgressCardProps): ReactNode {
  return (
    <Card className={cn("transition-shadow hover:shadow-md", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {trend && (
            <span className={cn(
              "text-xs",
              trend === 'up' && "text-success",
              trend === 'down' && "text-error",
              trend === 'neutral' && "text-muted-foreground"
            )}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
            </span>
          )}
        </div>

        <Progress value={value} className="mt-3">
          <ProgressTrack className="h-1.5">
            <ProgressIndicator className="bg-secondary" />
          </ProgressTrack>
        </Progress>

        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
