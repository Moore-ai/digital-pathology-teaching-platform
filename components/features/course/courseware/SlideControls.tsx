'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface SlideControlsProps {
  currentIndex: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
  onJump: (page: number) => void
  className?: string
}

export function SlideControls({
  currentIndex,
  totalPages,
  onPrev,
  onNext,
  onJump,
  className,
}: SlideControlsProps): ReactNode {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalPages - 1

  return (
    <div className={cn('flex items-center justify-center gap-2 sm:gap-4 py-3 px-4 bg-card border-t', className)}>
      {/* 第一页 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onJump(0)}
        disabled={isFirst}
        className="h-8 w-8 hidden sm:flex"
        title="第一页 (Home)"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>

      {/* 上一页 */}
      <Button
        variant="outline"
        size="sm"
        onClick={onPrev}
        disabled={isFirst}
        className="gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">上一页</span>
      </Button>

      {/* 页码显示 */}
      <div className="flex items-center gap-1.5 text-sm min-w-20 justify-center">
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentIndex + 1}
          onChange={(e) => {
            const page = parseInt(e.target.value, 10)
            if (page >= 1 && page <= totalPages) {
              onJump(page - 1)
            }
          }}
          className="w-12 h-8 text-center rounded border bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
          aria-label="当前页码"
        />
        <span className="text-muted-foreground">/</span>
        <span className="text-muted-foreground tabular-nums">{totalPages}</span>
      </div>

      {/* 下一页 */}
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={isLast}
        className="gap-1"
      >
        <span className="hidden sm:inline">下一页</span>
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* 最后一页 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onJump(totalPages - 1)}
        disabled={isLast}
        className="h-8 w-8 hidden sm:flex"
        title="最后一页 (End)"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
