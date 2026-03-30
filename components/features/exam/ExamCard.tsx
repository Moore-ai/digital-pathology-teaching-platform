'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Exam, ExamStatus } from '@/types/exam'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Clock,
  FileText,
  Calendar,
  Play,
  Eye,
  Edit,
  CheckCircle,
} from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'

interface ExamCardProps {
  className?: string
  exam: Exam
  userRole?: 'student' | 'teacher' | 'admin'
}

const statusConfig: Record<ExamStatus, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
  published: { label: '待考试', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  ongoing: { label: '进行中', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  completed: { label: '已结束', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
  graded: { label: '已批改', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
}

export function ExamCard({ className, exam, userRole = 'student' }: ExamCardProps): ReactNode {
  const status = statusConfig[exam.status]

  const renderActionButton = () => {
    switch (exam.status) {
      case 'published':
      case 'ongoing':
        return userRole === 'student' ? (
          <Link href={`/exams/${exam.id}/take`}>
            <Button className="gap-2">
              <Play className="w-4 h-4" />
              开始考试
            </Button>
          </Link>
        ) : (
          <Link href={`/exams/${exam.id}`}>
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              查看详情
            </Button>
          </Link>
        )
      case 'graded':
        return (
          <Link href={`/exams/${exam.id}/result`}>
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              查看解析
            </Button>
          </Link>
        )
      case 'draft':
        return userRole !== 'student' ? (
          <Link href={`/exams/${exam.id}/edit`}>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              编辑
            </Button>
          </Link>
        ) : null
      default:
        return null
    }
  }

  return (
    <Card className={cn("group hover:shadow-md transition-all h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg line-clamp-1">{exam.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {exam.description}
            </CardDescription>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(exam.startTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(exam.duration)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{exam.totalQuestions} 题</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="w-4 h-4" />
            <span>满分 {exam.totalScore}</span>
          </div>
        </div>

        {/* 已批改显示成绩 */}
        {exam.status === 'graded' && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">考试成绩</span>
              <span className="text-2xl font-bold text-secondary">85</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>排名: 12/45</span>
              <span>正确率: 85%</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        {renderActionButton()}
      </CardFooter>
    </Card>
  )
}
