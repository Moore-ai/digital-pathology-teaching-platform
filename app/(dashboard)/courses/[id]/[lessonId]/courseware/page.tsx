'use client'

import type { ReactNode } from 'react'
import { use } from 'react'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { CoursewareViewer, CoursewareHeader } from '@/components/features/course/courseware'
import { getCourseById } from '@/lib/mock/courses'

interface CoursewarePageProps {
  params: Promise<{ id: string; lessonId: string }>
}

export default function CoursewarePage({ params }: CoursewarePageProps): ReactNode {
  const { id, lessonId } = use(params)
  const course = getCourseById(id)

  if (!course) {
    notFound()
  }

  // 查找当前课时
  let currentLesson = null

  for (const chapter of course.chapters) {
    const lesson = chapter.lessons.find(l => l.id === lessonId)
    if (lesson) {
      currentLesson = lesson
      break
    }
  }

  if (!currentLesson) {
    notFound()
  }

  // 检查是否有课件
  if (!currentLesson.courseware || !currentLesson.coursewareSlides) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">该课时暂无课件</p>
          <a
            href={`/courses/${course.id}/${lessonId}`}
            className="text-secondary hover:underline"
          >
            返回课程
          </a>
        </div>
      </PageWrapper>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* 顶部导航 */}
      <CoursewareHeader
        courseware={currentLesson.courseware}
        lessonTitle={currentLesson.title}
        courseTitle={course.title}
        courseId={course.id}
        lessonId={lessonId}
      />

      {/* 课件浏览器 */}
      <div className="flex-1 overflow-hidden">
        <CoursewareViewer
          courseware={currentLesson.courseware}
          slides={currentLesson.coursewareSlides}
        />
      </div>
    </div>
  )
}
