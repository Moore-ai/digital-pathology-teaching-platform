'use client'

import type { ReactNode } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { getExamById } from '@/lib/mock/exams'
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
  const exam = getExamById(id)

  if (!exam) {
    notFound()
  }

  const status = statusConfig[exam.status]

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

      {/* 操作区域 */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-medium text-foreground">准备好了吗？</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {exam.status === 'published' && '考试尚未开始，请在规定时间内参加'}
                {exam.status === 'ongoing' && '考试进行中，点击开始答题'}
                {exam.status === 'completed' && '考试已结束，等待批改'}
                {exam.status === 'graded' && '考试已批改，可查看成绩'}
                {exam.status === 'draft' && '考试尚未发布'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {exam.status === 'published' || exam.status === 'ongoing' ? (
                <Link href={`/exams/${exam.id}/take`}>
                  <Button className="gap-2">
                    <Play className="w-4 h-4" />
                    开始考试
                  </Button>
                </Link>
              ) : exam.status === 'graded' ? (
                <Link href={`/exams/${exam.id}/result`}>
                  <Button className="gap-2">
                    <Eye className="w-4 h-4" />
                    查看成绩
                  </Button>
                </Link>
              ) : (
                <Button disabled>暂不可参加</Button>
              )}
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
