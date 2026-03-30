'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress'
import { Course, CourseCategoryLabels } from '@/types/course'
import { cn } from '@/lib/utils'
import { Clock, BookOpen, User } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface CourseCardProps {
  className?: string
  course: Course
}

export function CourseCard({ className, course }: CourseCardProps): ReactNode {
  const categoryLabel = CourseCategoryLabels[course.category]

  return (
    <Link href={`/courses/${course.id}`}>
      <Card className={cn(
        "group cursor-pointer transition-all hover:shadow-lg hover:border-secondary overflow-hidden h-full flex flex-col",
        className
      )}>
        {/* 封面图区域 */}
        <div className="relative h-40 bg-linear-to-br from-primary/5 to-secondary/5 overflow-hidden shrink-0">
          {/* 状态标签 */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {categoryLabel}
            </Badge>
            {course.status === 'completed' && (
              <Badge className="bg-success text-white text-xs">
                已完成
              </Badge>
            )}
            {course.status === 'not_started' && (
              <Badge variant="outline" className="bg-white/90 text-xs">
                未开始
              </Badge>
            )}
          </div>

          {/* 进度标签 */}
          <div className="absolute bottom-3 right-3">
            <Badge
              variant="outline"
              className={cn(
                "bg-white/90 text-xs",
                course.progress === 100 && "border-success text-success"
              )}
            >
              {course.progress}% 完成
            </Badge>
          </div>

          {/* 装饰图案 */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="currentColor" />
            </svg>
          </div>
        </div>

        <CardContent className="pt-4 flex-1 flex flex-col">
          {/* 标题 */}
          <CardTitle className="text-base line-clamp-1 group-hover:text-secondary transition-colors">
            {course.title}
          </CardTitle>

          {/* 描述 */}
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          {/* 讲师信息 */}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{course.instructor.name}</span>
            <span className="text-muted-foreground/50">·</span>
            <span>{course.instructor.title}</span>
          </div>

          {/* 课程信息 */}
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {course.totalLessons} 课时
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(course.duration)}
            </span>
          </div>

          {/* 进度条区域 - 始终占据相同高度 */}
          <div className="mt-3 min-h-[6px]">
            {course.status !== 'not_started' ? (
              <Progress value={course.progress}>
                <ProgressTrack className="h-1.5">
                  <ProgressIndicator className="bg-secondary" />
                </ProgressTrack>
              </Progress>
            ) : (
              <div className="h-1.5 bg-muted rounded-full" />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
