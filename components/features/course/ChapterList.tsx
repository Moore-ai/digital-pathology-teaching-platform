'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Chapter, Lesson } from '@/types/course'
import { CheckCircle, Play, FileText, Presentation, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface ChapterListProps {
  className?: string
  chapters: Chapter[]
  currentLessonId?: string
  courseId: string
}

export function ChapterList({
  className,
  chapters,
  currentLessonId,
  courseId,
}: ChapterListProps): ReactNode {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(
    chapters[0]?.id || null
  )

  const toggleChapter = (chapterId: string) => {
    setExpandedChapter(prev => prev === chapterId ? null : chapterId)
  }

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return Play
      case 'pdf':
        return FileText
      case 'ppt':
        return Presentation
      default:
        return Play
    }
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分` : `${hours}小时`
  }

  return (
    <div className={cn("space-y-2", className)}>
      {chapters.map((chapter, index) => {
        const isExpanded = expandedChapter === chapter.id
        const completedLessons = chapter.lessons.filter(l => l.completed).length
        const totalLessons = chapter.lessons.length

        return (
          <div key={chapter.id} className="border rounded-lg overflow-hidden">
            {/* 章节标题 */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                isExpanded ? "bg-muted/50" : "hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {completedLessons}/{totalLessons} 课时已完成
                  </p>
                </div>
              </div>
              <ChevronRight
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  isExpanded && "rotate-90"
                )}
              />
            </button>

            {/* 课时列表 */}
            {isExpanded && (
              <div className="border-t">
                {chapter.lessons.map((lesson) => {
                  const Icon = getLessonIcon(lesson.type)
                  const isActive = currentLessonId === lesson.id

                  return (
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseId}/${lesson.id}`}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-secondary/10 text-secondary"
                          : "hover:bg-muted/30 text-foreground",
                        lesson.completed && !isActive && "text-muted-foreground"
                      )}
                    >
                      {/* 状态图标 */}
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <Icon className={cn(
                            "w-4 h-4",
                            isActive ? "text-secondary" : "text-muted-foreground"
                          )} />
                        )}
                      </div>

                      {/* 标题 */}
                      <span className="flex-1 truncate">{lesson.title}</span>

                      {/* 时长 */}
                      <span className="text-xs text-muted-foreground">
                        {formatDuration(lesson.duration)}
                      </span>
                    </Link>
                  )
                })}

                {/* 相关切片 */}
                {chapter.relatedSlices.length > 0 && (
                  <div className="px-4 py-2 border-t bg-muted/20">
                    <p className="text-xs text-muted-foreground mb-2">相关切片</p>
                    <div className="flex flex-wrap gap-2">
                      {chapter.relatedSlices.map((slice) => (
                        <Link
                          key={slice.id}
                          href={`/slices/${slice.id}`}
                          className="flex items-center gap-2 px-2 py-1 rounded bg-muted text-xs hover:bg-muted/80 transition-colors"
                        >
                          <div className="w-6 h-6 rounded bg-secondary/10 flex items-center justify-center">
                            <span className="text-secondary text-[10px]">SVS</span>
                          </div>
                          <span className="text-foreground">{slice.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
