'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CoursewareSlide } from '@/types/course'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SlideThumbnailBarProps {
  slides: CoursewareSlide[]
  currentIndex: number
  onSelect: (index: number) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
}

export function SlideThumbnailBar({
  slides,
  currentIndex,
  onSelect,
  collapsed = false,
  onToggleCollapse,
  className,
}: SlideThumbnailBarProps): ReactNode {
  if (collapsed) {
    return (
      <div className={cn('w-12 flex flex-col items-center py-4 border-r bg-muted/30', className)}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
          title="展开缩略图"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
          <div className="flex flex-col items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => onSelect(index)}
                className={cn(
                  'w-8 h-8 rounded text-xs font-medium transition-all',
                  index === currentIndex
                    ? 'bg-secondary text-white'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                )}
                title={`第 ${index + 1} 页`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-32 flex flex-col border-r bg-card', className)}>
      {/* 折叠按钮 */}
      <div className="flex items-center justify-between p-2 border-b shrink-0">
        <span className="text-xs font-medium text-muted-foreground">幻灯片</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-6 w-6"
          title="收起缩略图"
        >
          <ChevronLeft className="w-3 h-3" />
        </Button>
      </div>

      {/* 缩略图列表 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => onSelect(index)}
            className={cn(
              'w-full aspect-4/3 rounded-lg overflow-hidden border-2 transition-all',
              'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-secondary',
              index === currentIndex
                ? 'border-secondary shadow-sm'
                : 'border-transparent hover:border-muted-foreground/30'
            )}
            title={`第 ${index + 1} 页${slide.notes ? ` · ${slide.notes}` : ''}`}
          >
            {/* 缩略图占位 */}
            <div className={cn(
              'w-full h-full flex items-center justify-center text-xs font-medium',
              index === currentIndex
                ? 'bg-secondary/10 text-secondary'
                : 'bg-muted text-muted-foreground'
            )}>
              <div className="text-center">
                <div className="text-lg font-bold">{index + 1}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
