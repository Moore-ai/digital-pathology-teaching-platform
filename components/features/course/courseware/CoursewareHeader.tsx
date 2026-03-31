'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Play } from 'lucide-react'
import { Courseware } from '@/types/course'

interface CoursewareHeaderProps {
  courseware: Courseware
  lessonTitle: string
  courseTitle: string
  courseId: string
  lessonId: string
  className?: string
}

export function CoursewareHeader({
  courseware,
  lessonTitle,
  courseTitle,
  courseId,
  lessonId,
  className,
}: CoursewareHeaderProps): ReactNode {
  return (
    <header className={cn('flex items-center justify-between px-4 sm:px-6 py-3 bg-card border-b shrink-0', className)}>
      {/* 左侧导航 */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <Link href={`/courses/${courseId}/${lessonId}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 shrink-0">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">返回课程</span>
          </Button>
        </Link>

        <div className="h-5 w-px bg-border hidden sm:block" />

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-medium text-foreground truncate">
            {lessonTitle}
          </h1>
          <p className="text-xs text-muted-foreground truncate hidden sm:block">
            {courseTitle}
          </p>
        </div>
      </div>

      {/* 右侧信息 */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* 文件类型标签 */}
        <Badge variant="secondary" className="hidden sm:inline-flex gap-1">
          {courseware.type.toUpperCase()}
        </Badge>

        {/* 页数 */}
        <span className="text-xs text-muted-foreground hidden sm:inline">
          共 {courseware.totalPages} 页
        </span>

        {/* 返回视频 */}
        <Link href={`/courses/${courseId}/${lessonId}`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">观看视频</span>
          </Button>
        </Link>
      </div>
    </header>
  )
}
