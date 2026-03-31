'use client'

import type { ReactNode } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { CoursePlayer } from '@/components/features/course/CoursePlayer'
import { ChapterList } from '@/components/features/course/ChapterList'
import { getCourseById } from '@/lib/mock/courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  User,
  Star,
  Share2,
} from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { CourseCategoryLabels } from '@/types/course'

interface CoursePageProps {
  params: Promise<{ id: string }>
}

export default function CoursePage({ params }: CoursePageProps): ReactNode {
  const { id } = use(params)
  const course = getCourseById(id)

  if (!course) {
    notFound()
  }

  const currentLesson = course.chapters[0]?.lessons[0]
  const categoryLabel = CourseCategoryLabels[course.category]

  return (
    <PageWrapper className="space-y-6">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground transition-colors">
          课程中心
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{course.title}</span>
      </nav>

      {/* 课程标题区 */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{categoryLabel}</Badge>
            {course.status === 'completed' && (
              <Badge className="bg-success text-white">已完成</Badge>
            )}
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            {course.title}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {course.description}
          </p>

          {/* 课程信息 */}
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {course.instructor.name}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {course.totalLessons} 课时
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(course.duration)}
            </span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Star className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button>继续学习</Button>
        </div>
      </div>

      <Separator />

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 播放器区域 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 播放器 */}
          {currentLesson && (
            <>
              <CoursePlayer lesson={currentLesson} courseId={course.id} />

              {/* 课时信息 */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-foreground">
                    {currentLesson.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.chapters[0].title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    上一课
                  </Button>
                  <Button variant="outline" size="sm">
                    下一课
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* 讲师信息 */}
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="text-sm font-medium text-foreground mb-3">讲师介绍</h3>
            <div className="flex items-center gap-4">
              <Avatar size="lg">
                <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                <AvatarFallback>{course.instructor.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{course.instructor.name}</p>
                <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                {course.instructor.bio && (
                  <p className="text-sm text-muted-foreground mt-1">{course.instructor.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 章节列表 */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <h3 className="text-base font-medium text-foreground mb-3">课程目录</h3>
            <ChapterList
              chapters={course.chapters}
              currentLessonId={currentLesson?.id}
              courseId={course.id}
            />

            {/* 课程进度 */}
            <div className="mt-4 p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">学习进度</span>
                <span className="text-sm font-medium text-foreground">{course.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all course-progress"
                  data-progress={course.progress}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
