'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Pause, Play } from 'lucide-react'

interface ExamTimerProps {
  className?: string
  timeRemaining: number      // 秒
  isPaused?: boolean
  onPause?: () => void
  onResume?: () => void
}

export function ExamTimer({
  className,
  timeRemaining,
  isPaused = false,
  onPause,
  onResume,
}: ExamTimerProps): ReactNode {
  const hours = Math.floor(timeRemaining / 3600)
  const minutes = Math.floor((timeRemaining % 3600) / 60)
  const seconds = timeRemaining % 60

  const formatNumber = (n: number) => n.toString().padStart(2, '0')

  const formattedTime = hours > 0
    ? `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`
    : `${formatNumber(minutes)}:${formatNumber(seconds)}`

  const isLowTime = timeRemaining < 300 // 少于5分钟

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
      isLowTime && "bg-red-50 border border-red-200",
      className
    )}>
      <Clock className={cn("w-5 h-5", isLowTime ? "text-red-600 animate-pulse" : "text-muted-foreground")} />

      <div className="flex items-center gap-1">
        <span className={cn(
          "text-lg font-mono font-semibold",
          isLowTime ? "text-red-600" : "text-foreground"
        )}>
          {formattedTime}
        </span>
        {isLowTime && (
          <Badge variant="destructive" className="ml-2 animate-pulse">
            时间不足
          </Badge>
        )}
      </div>

      {(onPause || onResume) && (
        <div className="ml-2 flex items-center gap-1">
          {isPaused ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onResume}
            >
              <Play className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onPause}
            >
              <Pause className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
