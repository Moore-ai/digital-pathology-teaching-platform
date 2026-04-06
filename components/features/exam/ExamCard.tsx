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
  FileCheck,
  AlertCircle,
} from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'
import { useExamStore } from '@/stores/examStore'

interface ExamCardProps {
  className?: string
  exam: Exam
  userRole?: 'student' | 'teacher' | 'admin'
  studentId?: string
}

const statusConfig: Record<ExamStatus, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
  published: { label: '待考试', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  ongoing: { label: '进行中', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  completed: { label: '已结束', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
  graded: { label: '已批改', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
}

export function ExamCard({ className, exam, userRole = 'student', studentId }: ExamCardProps): ReactNode {
  const status = statusConfig[exam.status]
  const { hasStudentSubmitted, getStudentSubmission, isGradingComplete } = useExamStore()

  // 检查学生是否已提交
  const hasSubmitted = userRole === 'student' && studentId && hasStudentSubmitted(exam.id, studentId)
  const submission = hasSubmitted ? getStudentSubmission(exam.id, studentId!) : undefined

  // 检查是否有主观题需要批改
  const hasSubjectiveQuestions = exam.questions?.some(q => q.type === 'short_answer') ?? false
  const gradingComplete = hasSubmitted ? isGradingComplete(exam.id, studentId!) : true
  const needsGrading = hasSubmitted && hasSubjectiveQuestions && !gradingComplete

  const renderActionButton = () => {
    // 学生已提交 - 显示查看解析
    if (userRole === 'student' && hasSubmitted) {
      return (
        <Link href={`/exams/${exam.id}/result`}>
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" />
            查看解析
          </Button>
        </Link>
      )
    }

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
      case 'completed':
        // 教师/管理员显示批改按钮
        return userRole !== 'student' ? (
          <Link href={`/exams/${exam.id}/grading`}>
            <Button className="gap-2">
              <FileCheck className="w-4 h-4" />
              批改
            </Button>
          </Link>
        ) : null
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

        {/* 学生已提交显示成绩 */}
        {userRole === 'student' && hasSubmitted && submission && (
          <div className={`mt-4 p-3 rounded-lg ${needsGrading ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-secondary/10 border border-secondary/20'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {needsGrading ? '客观题得分' : '考试已完成'}
              </span>
              <span className={`text-2xl font-bold ${needsGrading ? 'text-amber-600' : 'text-secondary'}`}>
                {submission.score}{needsGrading ? '+' : ''}
              </span>
            </div>
            {needsGrading && (
              <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3 h-3" />
                <span>主观题批改中</span>
              </div>
            )}
            {!needsGrading && (
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>满分: {exam.totalScore}</span>
                <span>正确率: {Math.round((submission.score / exam.totalScore) * 100)}%</span>
              </div>
            )}
          </div>
        )}

        {/* 已批改显示成绩 - 仅学生可见（未提交过但有成绩的情况） */}
        {exam.status === 'graded' && userRole === 'student' && !hasSubmitted && (
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

        {/* 已批改显示班级统计 - 仅教师/管理员可见 */}
        {exam.status === 'graded' && userRole !== 'student' && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">班级统计</span>
              <span className="text-lg font-bold text-secondary">已批改</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>平均分: 78</span>
              <span>提交: 45人</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto h-14 flex items-center">
        {renderActionButton()}
      </CardFooter>
    </Card>
  )
}
