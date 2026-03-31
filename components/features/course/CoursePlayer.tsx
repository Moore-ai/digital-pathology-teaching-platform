'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Lesson } from '@/types/course'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  FileText,
  Presentation,
} from 'lucide-react'

interface CoursePlayerProps {
  className?: string
  lesson: Lesson
  courseId: string
}

export function CoursePlayer({ className, lesson, courseId }: CoursePlayerProps): ReactNode {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)

  const formatTime = (minutes: number) => {
    const totalSeconds = minutes * 60
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const totalDuration = lesson.duration
  const progress = (currentTime / totalDuration) * 100

  // 根据类型显示不同内容
  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return (
          <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
            {/* 视频占位 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto">
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </div>
                <p className="text-sm text-white/60">视频播放区域</p>
                <p className="text-xs text-white/40 mt-1">
                  原型演示 · {lesson.title}
                </p>
              </div>
            </div>

            {/* 进度条 */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-secondary transition-all video-progress-bar"
                data-progress={Math.round(progress)}
              />
            </div>
          </div>
        )

      case 'pdf':
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground">PDF 文档</p>
              <p className="text-sm text-muted-foreground mt-1">{lesson.title}</p>
              <Button className="mt-4" variant="outline">
                打开文档
              </Button>
            </div>
          </div>
        )

      case 'ppt':
        return (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary font-bold text-2xl">PPT</span>
              </div>
              <p className="text-lg font-medium text-foreground">演示文稿</p>
              <p className="text-sm text-muted-foreground mt-1">{lesson.title}</p>
              <Button className="mt-4" variant="outline">
                查看演示
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "relative bg-gray-900 rounded-xl overflow-hidden group",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (showControls && isPlaying) {
          setShowControls(false)
        }
      }}
    >
      {/* 播放区域 */}
      <div className="aspect-video">
        {renderContent()}
      </div>

      {/* 控制栏 */}
      {lesson.type === 'video' && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 transition-opacity",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          {/* 进度条 */}
          <div className="mb-3">
            <label htmlFor="video-progress" className="sr-only">视频进度</label>
            <input
              id="video-progress"
              type="range"
              min="0"
              max={totalDuration}
              value={currentTime}
              onChange={(e) => setCurrentTime(Number(e.target.value))}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              aria-label="视频播放进度"
            />
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>

              <span className="text-sm text-white/80 ml-2">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* 查看课件按钮 */}
              {lesson.courseware ? (
                <Link href={`/courses/${courseId}/${lesson.id}/courseware`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 gap-1.5"
                  >
                    <Presentation className="w-4 h-4" />
                    <span className="hidden sm:inline">课件</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/50 gap-1.5 cursor-not-allowed"
                  disabled
                >
                  <Presentation className="w-4 h-4" />
                  <span className="hidden sm:inline">无课件</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 类型标签 */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-black/50 text-white border-0">
          {lesson.type === 'video' && '视频'}
          {lesson.type === 'pdf' && 'PDF'}
          {lesson.type === 'ppt' && 'PPT'}
        </Badge>
      </div>
    </div>
  )
}
