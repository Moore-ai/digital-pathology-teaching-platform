'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { CoursewareSlide } from '@/types/course'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react'

interface SlideViewerProps {
  slide: CoursewareSlide | null
  totalPages: number
  currentIndex: number
  className?: string
}

export function SlideViewer({
  slide,
  totalPages,
  currentIndex,
  className,
}: SlideViewerProps): ReactNode {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 25, 200))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 25, 50))
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoomLevel(100)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  // 键盘事件处理
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') {
      handleZoomIn()
    } else if (e.key === '-') {
      handleZoomOut()
    } else if (e.key === '0') {
      handleResetZoom()
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen()
    }
  }, [handleZoomIn, handleZoomOut, handleResetZoom, toggleFullscreen])

  if (!slide) {
    return (
      <div className={cn('flex items-center justify-center bg-muted/30', className)}>
        <div className="text-center text-muted-foreground">
          <p>未找到幻灯片</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-col bg-muted/30',
        isFullscreen && 'fixed inset-0 z-50 bg-background',
        className
      )}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* 幻灯片主区域 */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto">
        <div
          className={cn(
            'relative bg-white shadow-2xl rounded-lg overflow-hidden',
            'transition-transform duration-200 ease-out'
          )}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            width: '100%',
            maxWidth: '960px',
            aspectRatio: '16/9',
          }}
        >
          {/* 幻灯片占位内容 */}
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
            <div className="text-center p-8">
              <div className="text-6xl font-bold text-primary/20 mb-4">
                {currentIndex + 1}
              </div>
              <p className="text-lg text-muted-foreground">
                幻灯片 {currentIndex + 1} / {totalPages}
              </p>
              {slide.notes && (
                <p className="text-sm text-muted-foreground/70 mt-2 italic">
                  {slide.notes}
                </p>
              )}
            </div>
          </div>

          {/* 幻灯片装饰边框 */}
          <div className="absolute inset-0 border border-slate-200 rounded-lg pointer-events-none" />
        </div>
      </div>

      {/* 缩放控制条 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 50}
          className="h-7 w-7 text-white hover:bg-white/20"
          title="缩小 (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>

        <button
          onClick={handleResetZoom}
          className="min-w-15 text-sm text-white hover:bg-white/20 rounded px-2 py-1 transition-colors"
          title="重置缩放 (0)"
        >
          {zoomLevel}%
        </button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 200}
          className="h-7 w-7 text-white hover:bg-white/20"
          title="放大 (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>

        <div className="w-px h-4 bg-white/30 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="h-7 w-7 text-white hover:bg-white/20"
          title="全屏 (F)"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* 快捷键提示 */}
      <div className="absolute top-4 right-4 text-xs text-muted-foreground/60 hidden lg:block">
        <span className="bg-black/20 px-2 py-1 rounded">+/- 缩放 · F 全屏</span>
      </div>
    </div>
  )
}
