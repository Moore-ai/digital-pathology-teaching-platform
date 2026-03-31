'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Courseware, CoursewareSlide } from '@/types/course'
import { SlideThumbnailBar } from './SlideThumbnailBar'
import { SlideViewer } from './SlideViewer'
import { SlideControls } from './SlideControls'

interface CoursewareViewerProps {
  courseware: Courseware
  slides: CoursewareSlide[]
  initialSlide?: number
  className?: string
}

export function CoursewareViewer({
  courseware: _courseware,
  slides,
  initialSlide = 0,
  className,
}: CoursewareViewerProps): ReactNode {
  const [currentIndex, setCurrentIndex] = useState(initialSlide)
  const [isThumbnailCollapsed, setIsThumbnailCollapsed] = useState(false)

  const currentSlide = slides[currentIndex] || null

  // 导航函数
  const goToNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, slides.length])

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentIndex(index)
    }
  }, [slides.length])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 忽略输入框中的按键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          goToNext()
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          goToPrev()
          break
        case 'Home':
          e.preventDefault()
          goToSlide(0)
          break
        case 'End':
          e.preventDefault()
          goToSlide(slides.length - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToNext, goToPrev, goToSlide, slides.length])

  const toggleThumbnailBar = useCallback(() => {
    setIsThumbnailCollapsed(prev => !prev)
  }, [])

  if (slides.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-96 bg-muted/30 rounded-lg', className)}>
        <div className="text-center text-muted-foreground">
          <p>该课件暂无幻灯片</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 缩略图导航栏 */}
        <SlideThumbnailBar
          slides={slides}
          currentIndex={currentIndex}
          onSelect={goToSlide}
          collapsed={isThumbnailCollapsed}
          onToggleCollapse={toggleThumbnailBar}
        />

        {/* 幻灯片查看器 */}
        <SlideViewer
          slide={currentSlide}
          totalPages={slides.length}
          currentIndex={currentIndex}
          className="flex-1"
        />
      </div>

      {/* 底部翻页控制 */}
      <SlideControls
        currentIndex={currentIndex}
        totalPages={slides.length}
        onPrev={goToPrev}
        onNext={goToNext}
        onJump={goToSlide}
      />
    </div>
  )
}
