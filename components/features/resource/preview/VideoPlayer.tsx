'use client'

import type { ReactNode } from 'react'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Resource } from '@/types/resource'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
} from 'lucide-react'

interface VideoPlayerProps {
  resource: Resource
  className?: string
}

export function VideoPlayer({ resource, className }: VideoPlayerProps): ReactNode {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)

  const duration = resource.duration || 0
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  return (
    <div
      className={cn(
        'relative bg-gray-900 rounded-xl overflow-hidden group',
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (showControls && isPlaying) {
          setShowControls(false)
        }
      }}
    >
      {/* 视频区域 */}
      <div className="aspect-video relative">
        {/* 视频占位 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 mx-auto">
              {isPlaying ? (
                <Pause className="w-10 h-10" />
              ) : (
                <Play className="w-10 h-10 ml-1" />
              )}
            </div>
            <p className="text-lg font-medium">{resource.title}</p>
            <p className="text-sm text-white/60 mt-1">视频预览 · 原型演示</p>
          </div>
        </div>

        {/* 进度条 */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-secondary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 控制栏 */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4 transition-opacity',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* 进度条 */}
        <div className="mb-3">
          <input
            type="range"
            min={0}
            max={duration}
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
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
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

      {/* 类型标签 */}
      <div className="absolute top-4 left-4">
        <Badge variant="secondary" className="bg-black/50 text-white border-0">
          视频
        </Badge>
      </div>
    </div>
  )
}
