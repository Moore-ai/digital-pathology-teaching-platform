'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress'
import { inProgressCourses } from '@/lib/mock/courses'
import { Clock, BookOpen, ChevronRight } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface RecentCoursesProps {
  className?: string
}

export function RecentCourses({ className }: RecentCoursesProps): ReactNode {
  const courses = inProgressCourses.slice(0, 3)

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          最近学习
        </h2>
        <Link
          href="/courses"
          className="text-sm text-secondary hover:underline flex items-center gap-1"
        >
          查看全部
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <Card className="group cursor-pointer transition-all hover:shadow-lg hover:border-secondary">
              {/* 封面图 */}
              <div className="relative h-32 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden rounded-t-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <Badge variant="secondary" className="text-xs">
                    {course.progress}% 完成
                  </Badge>
                </div>
              </div>

              <CardContent className="pt-3">
                <CardTitle className="text-sm line-clamp-1 group-hover:text-secondary transition-colors">
                  {course.title}
                </CardTitle>

                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {course.totalLessons} 课时
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(course.duration)}
                  </span>
                </div>

                {/* 进度条 */}
                <Progress value={course.progress} className="mt-3">
                  <ProgressTrack className="h-1">
                    <ProgressIndicator className="bg-secondary" />
                  </ProgressTrack>
                </Progress>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
