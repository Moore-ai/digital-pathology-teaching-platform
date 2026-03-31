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
  Clock,
  User,
  Star,
  Share2,
} from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { CourseCategoryLabels } from '@/types/course'

interface LessonPageProps {
  params: Promise<{ id: string; lessonId: string }>
}

export default function LessonPage({ params }: LessonPageProps): ReactNode {
  const { id, lessonId } = use(params)
  const course = getCourseById(id)

  if (!course) {
    notFound()
  }

  // 查找当前课时
  let currentLesson = null
  let currentChapter = null

  for (let i = 0; i < course.chapters.length; i++) {
    const chapter = course.chapters[i]
    const idx = chapter.lessons.findIndex(l => l.id === lessonId)
    if (idx !== -1) {
      currentLesson = chapter.lessons[idx]
      currentChapter = chapter
      break
    }
  }

  if (!currentLesson) {
    notFound()
  }

  // 获取上一课和下一课
  const allLessons = course.chapters.flatMap((ch, chIdx) =>
    ch.lessons.map((l, lIdx) => ({ lesson: l, chapter: ch, chIdx, lIdx }))
  )
  const currentIdx = allLessons.findIndex(item => item.lesson.id === lessonId)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  const categoryLabel = CourseCategoryLabels[course.category]

  return (
    <PageWrapper className="space-y-6">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/courses" className="hover:text-foreground transition-colors">
          课程中心
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/courses/${course.id}`} className="hover:text-foreground transition-colors">
          {course.title}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{currentLesson.title}</span>
      </nav>

      {/* 课程标题区 */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{categoryLabel}</Badge>
            {currentLesson.completed && (
              <Badge className="bg-success text-white">已完成</Badge>
            )}
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            {currentLesson.title}
          </h1>
          <p className="text-muted-foreground mt-2">
            {currentChapter?.title} · {course.title}
          </p>

          {/* 课程信息 */}
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {course.instructor.name}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(currentLesson.duration)}
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
        </div>
      </div>

      <Separator />

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 播放器区域 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 播放器 */}
          <CoursePlayer lesson={currentLesson} courseId={course.id} />

          {/* 课时导航 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {prevLesson ? (
                <Link href={`/courses/${course.id}/${prevLesson.lesson.id}`}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    上一课
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  上一课
                </Button>
              )}
              {nextLesson ? (
                <Link href={`/courses/${course.id}/${nextLesson.lesson.id}`}>
                  <Button variant="outline" size="sm">
                    下一课
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  下一课
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              第 {currentIdx + 1} / {allLessons.length} 课
            </span>
          </div>

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
              currentLessonId={currentLesson.id}
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
