'use client'

import type { ReactNode } from 'react'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { getExamById } from '@/lib/mock/exams'
import { useExamStore } from '@/stores/examStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ChevronRight,
  Clock,
  Calendar,
  FileText,
  Award,
  Play,
  Eye,
  Users,
  Edit,
  Send,
  Trash2,
  ClipboardCheck,
  AlertCircle,
} from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'

interface ExamDetailPageProps {
  params: Promise<{ id: string }>
}

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-800' },
  published: { label: '待考试', color: 'bg-blue-100 text-blue-800' },
  ongoing: { label: '进行中', color: 'bg-amber-100 text-amber-800' },
  completed: { label: '已结束', color: 'bg-slate-100 text-slate-800' },
  graded: { label: '已批改', color: 'bg-green-100 text-green-800' },
}

export default function ExamDetailPage({ params }: ExamDetailPageProps): ReactNode {
  const { id } = use(params)
  const { exams: createdExams, getStudentSubmission, hasStudentSubmitted, isGradingComplete } = useExamStore()
  const { user } = useAuthStore()

  // 先从store中查找，再从mock数据中查找
  const exam = createdExams.find(e => e.id === id) ?? getExamById(id)

  if (!exam) {
    notFound()
  }

  const status = statusConfig[exam.status]
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  // 检查学生是否已提交
  const hasSubmitted = isStudent && hasStudentSubmitted(id, user?.id || '')
  const studentSubmission = isStudent ? getStudentSubmission(id, user?.id || '') : undefined

  // 检查是否有主观题需要批改
  const hasSubjectiveQuestions = exam.questions?.some(q => q.type === 'short_answer') ?? false
  const gradingComplete = isStudent && hasSubmitted ? isGradingComplete(id, user?.id || '') : true
  const needsGrading = hasSubmitted && hasSubjectiveQuestions && !gradingComplete

  // 根据角色和考试状态渲染操作按钮
  const renderActionButtons = () => {
    if (isStudent) {
      // 学生已提交 - 显示查看解析按钮
      if (hasSubmitted) {
        return (
          <Link href={`/exams/${exam.id}/result`}>
            <Button className="gap-2">
              <Eye className="w-4 h-4" />
              查看解析
            </Button>
          </Link>
        )
      }

      // 学生操作 - 只有进行中才能考试
      if (exam.status === 'ongoing') {
        return (
          <Link href={`/exams/${exam.id}/take`}>
            <Button className="gap-2">
              <Play className="w-4 h-4" />
              开始考试
            </Button>
          </Link>
        )
      }
      if (exam.status === 'graded') {
        return (
          <Link href={`/exams/${exam.id}/result`}>
            <Button className="gap-2">
              <Eye className="w-4 h-4" />
              查看成绩
            </Button>
          </Link>
        )
      }
      return <Button disabled>暂不可参加</Button>
    }

    if (isTeacher) {
      // 教师/管理员操作
      if (exam.status === 'draft') {
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              编辑试卷
            </Button>
            <Button className="gap-2">
              <Send className="w-4 h-4" />
              发布考试
            </Button>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="w-4 h-4" />
              删除
            </Button>
          </div>
        )
      }
      if (exam.status === 'published') {
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              预览试卷
            </Button>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              编辑
            </Button>
          </div>
        )
      }
      if (exam.status === 'ongoing') {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/exams/${exam.id}/grading`}>
              <Button variant="outline" className="gap-2">
                <Users className="w-4 h-4" />
                查看答题情况
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Eye className="w-4 h-4" />
              预览试卷
            </Button>
          </div>
        )
      }
      if (exam.status === 'completed') {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/exams/${exam.id}/grading`}>
              <Button className="gap-2">
                <ClipboardCheck className="w-4 h-4" />
                批改试卷
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <Users className="w-4 h-4" />
              查看提交情况
            </Button>
          </div>
        )
      }
      if (exam.status === 'graded') {
        return (
          <div className="flex items-center gap-2">
            <Link href={`/exams/${exam.id}/result`}>
              <Button className="gap-2">
                <Eye className="w-4 h-4" />
                查看统计
              </Button>
            </Link>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              导出成绩
            </Button>
          </div>
        )
      }
    }

    return null
  }

  // 根据角色显示不同的提示文本
  const getStatusHint = () => {
    if (isStudent) {
      // 已提交
      if (hasSubmitted) {
        return '您已完成考试，可查看答题解析'
      }
      switch (exam.status) {
        case 'published': return '考试尚未开始，请在规定时间内参加'
        case 'ongoing': return '考试进行中，点击开始答题'
        case 'completed': return '考试已结束，等待批改'
        case 'graded': return '考试已批改，可查看成绩'
        case 'draft': return '考试尚未发布'
        default: return ''
      }
    }

    if (isTeacher) {
      switch (exam.status) {
        case 'draft': return '考试仍在编辑中，可以修改或发布'
        case 'published': return '考试已发布，等待学生参加'
        case 'ongoing': return '考试进行中，可以查看答题情况'
        case 'completed': return '考试已结束，可以开始批改'
        case 'graded': return '考试已批改完成，可以查看统计和导出成绩'
        default: return ''
      }
    }

    return ''
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/exams" className="hover:text-foreground transition-colors">
          考试中心
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{exam.title}</span>
      </nav>

      {/* 考试信息卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{exam.title}</CardTitle>
              <CardDescription className="mt-2">{exam.description}</CardDescription>
            </div>
            <Badge className={status.color}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <div>
                <div className="text-xs">开始时间</div>
                <div className="text-sm text-foreground">{formatDate(exam.startTime)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <div>
                <div className="text-xs">考试时长</div>
                <div className="text-sm text-foreground">{formatDuration(exam.duration)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <div>
                <div className="text-xs">题目数量</div>
                <div className="text-sm text-foreground">{exam.totalQuestions} 题</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="w-4 h-4" />
              <div>
                <div className="text-xs">满分</div>
                <div className="text-sm text-foreground">{exam.totalScore} 分</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 学生成绩卡片 - 仅已提交的学生可见 */}
      {isStudent && hasSubmitted && studentSubmission && (
        <Card className="border-secondary/30 bg-secondary/5">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">考试已完成</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  提交时间：{formatDate(studentSubmission.submittedAt)}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">
                    {studentSubmission.score}
                  </div>
                  <div className="text-sm text-muted-foreground">得分</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {exam.totalScore}
                  </div>
                  <div className="text-sm text-muted-foreground">满分</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 主观题未批改提示 */}
      {isStudent && needsGrading && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  主观题批改中
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  您的主观题答案正在等待教师批改，批改完成后可查看最终成绩。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 操作区域 */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-medium text-foreground">
                {isStudent ? '准备好了吗？' : '考试管理'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{getStatusHint()}</p>
            </div>
            <div className="flex items-center gap-2">
              {renderActionButtons()}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* 考试须知 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">考试须知</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
              请在规定时间内完成考试，超时将自动提交
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
              考试过程中请保持网络连接稳定
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
              单选题每题只有一个正确答案
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
              多选题需要选择所有正确答案才能得分
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
              答题过程中可随时检查和修改答案
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* 统计信息（已批改时显示） */}
      {exam.status === 'graded' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">班级统计</CardTitle>
            <CardDescription>本次考试班级整体情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Users className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold text-foreground">45</div>
                <div className="text-xs text-muted-foreground">参考人数</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Award className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold text-foreground">78</div>
                <div className="text-xs text-muted-foreground">平均分</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <Award className="w-5 h-5 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold text-success">96</div>
                <div className="text-xs text-muted-foreground">最高分</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <FileText className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <div className="text-2xl font-bold text-foreground">85%</div>
                <div className="text-xs text-muted-foreground">及格率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 返回按钮 */}
      <div className="flex justify-start">
        <Link href="/exams">
          <Button variant="outline">返回考试列表</Button>
        </Link>
      </div>
    </PageWrapper>
  )
}
