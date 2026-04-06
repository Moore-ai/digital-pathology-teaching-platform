'use client'

import type { ReactNode } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { getExamById } from '@/lib/mock/exams'
import { useExamStore } from '@/stores/examStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronRight,
  Clock,
  Calendar,
  Award,
  XCircle,
  TrendingUp,
  FileText,
  Download,
  Share2,
  AlertCircle,
} from 'lucide-react'
import { formatDate, formatDuration } from '@/lib/utils'

interface ResultPageProps {
  params: Promise<{ id: string }>
}

// Mock 考试结果数据
const mockResult = {
  score: 85,
  rank: 12,
  totalStudents: 45,
  correctCount: 25,
  wrongCount: 5,
  unansweredCount: 0,
  timeSpent: 78, // 分钟
  questionResults: [
    { id: '1', isCorrect: true, yourAnswer: 'A', correctAnswer: 'A' },
    { id: '2', isCorrect: true, yourAnswer: 'C', correctAnswer: 'C' },
    { id: '3', isCorrect: false, yourAnswer: 'B', correctAnswer: 'D' },
    { id: '4', isCorrect: true, yourAnswer: 'A', correctAnswer: 'A' },
    { id: '5', isCorrect: true, yourAnswer: 'B', correctAnswer: 'B' },
  ],
}

export default function ExamResultPage({ params }: ResultPageProps): ReactNode {
  const { id } = use(params)
  const { user } = useAuthStore()
  const { isGradingComplete, getStudentSubmission, hasStudentSubmitted, exams: createdExams } = useExamStore()

  // 先从store中查找，再从mock数据中查找
  const exam = createdExams.find(e => e.id === id) ?? getExamById(id)

  // 检查学生提交状态
  const hasSubmitted = user?.role === 'student' && hasStudentSubmitted(id, user?.id || '')
  const studentSubmission = user?.role === 'student' ? getStudentSubmission(id, user?.id || '') : undefined
  const gradingComplete = hasSubmitted ? isGradingComplete(id, user?.id || '') : true

  // 检查是否有主观题
  const hasSubjectiveQuestions = exam?.questions?.some(q => q.type === 'short_answer') ?? false
  const needsGrading = hasSubmitted && hasSubjectiveQuestions && !gradingComplete

  if (!exam) {
    notFound()
  }

  // 使用学生提交记录中的实际成绩
  const actualScore = studentSubmission?.score ?? mockResult.score
  const accuracy = Math.round((mockResult.correctCount / exam.totalQuestions) * 100)
  const scoreLevel = actualScore >= 90 ? '优秀' : actualScore >= 80 ? '良好' : actualScore >= 60 ? '及格' : '不及格'
  const scoreLevelColor = actualScore >= 90 ? 'text-success' : actualScore >= 80 ? 'text-secondary' : actualScore >= 60 ? 'text-warning' : 'text-error'

  return (
    <PageWrapper className="space-y-6">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/exams" className="hover:text-foreground transition-colors">
          考试中心
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/exams/${exam.id}`} className="hover:text-foreground transition-colors">
          {exam.title}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">成绩单</span>
      </nav>

      {/* 主观题未批改提示 */}
      {needsGrading && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  主观题批改中
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  您的主观题答案正在等待教师批改，当前显示的是客观题得分。批改完成后可查看最终成绩。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 成绩概览卡片 */}
      <Card className="bg-linear-to-r from-primary/5 to-secondary/5">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 成绩圆环 */}
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#E5E7EB"
                  strokeWidth="14"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={needsGrading ? '#F59E0B' : '#2D8B8B'}
                  strokeWidth="14"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${actualScore * 4.4} 440`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {needsGrading ? (
                      <span className="text-amber-600">{actualScore}+</span>
                    ) : (
                      actualScore
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {needsGrading ? '客观题得分' : '分'}
                  </div>
                </div>
              </div>
            </div>

            {/* 成绩信息 */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">
                {exam.title}
              </h1>
              <p className="text-muted-foreground mb-4">{exam.description}</p>

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <Badge className={`${scoreLevelColor} text-lg px-4 py-1`}>
                  {scoreLevel}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Award className="w-4 h-4" />
                  <span>排名第 {mockResult.rank} / {mockResult.totalStudents} 名</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-success">{mockResult.correctCount}</div>
                  <div className="text-xs text-muted-foreground">正确</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-error">{mockResult.wrongCount}</div>
                  <div className="text-xs text-muted-foreground">错误</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-foreground">{accuracy}%</div>
                  <div className="text-xs text-muted-foreground">正确率</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-foreground">{mockResult.timeSpent}</div>
                  <div className="text-xs text-muted-foreground">用时(分钟)</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详细分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 答题情况 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">答题情况</CardTitle>
            <CardDescription>各题目答题结果</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: exam.totalQuestions }, (_, i) => {
                const result = mockResult.questionResults[i]
                const isCorrect = result?.isCorrect ?? (i % 3 === 0)
                const isAnswered = i < 30
                return (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                      !isAnswered
                        ? 'bg-muted text-muted-foreground'
                        : isCorrect
                          ? 'bg-success/10 text-success'
                          : 'bg-error/10 text-error'
                    }`}
                    title={`第 ${i + 1} 题: ${isAnswered ? (isCorrect ? '正确' : '错误') : '未作答'}`}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success/10" />
                <span className="text-muted-foreground">正确 {mockResult.correctCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-error/10" />
                <span className="text-muted-foreground">错误 {mockResult.wrongCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted" />
                <span className="text-muted-foreground">未答 {mockResult.unansweredCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 考试信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">考试信息</CardTitle>
            <CardDescription>考试基本信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>考试时间</span>
              </div>
              <span className="text-foreground">{formatDate(exam.startTime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>考试时长</span>
              </div>
              <span className="text-foreground">{formatDuration(exam.duration)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>题目数量</span>
              </div>
              <span className="text-foreground">{exam.totalQuestions} 题</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Award className="w-4 h-4" />
                <span>满分</span>
              </div>
              <span className="text-foreground">{exam.totalScore} 分</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>班级平均分</span>
              </div>
              <span className="text-foreground">78 分</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 错题解析 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <XCircle className="w-4 h-4 text-error" />
            错题解析
          </CardTitle>
          <CardDescription>查看错题详细解析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 示例错题 */}
            <div className="p-4 rounded-lg border bg-card">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center text-error font-medium">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    肝细胞癌最常见的组织学类型是？
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-error">你的答案: B</span>
                    <span className="text-success">正确答案: D</span>
                  </div>
                  <div className="mt-3 p-3 rounded bg-muted/50 text-sm text-muted-foreground">
                    <strong>解析：</strong>肝细胞癌最常见的组织学类型是梁索型（小梁型），约占70%。癌细胞排列成梁索状，梁索间为血窦。
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            查看全部错题解析
          </Button>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出成绩单
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            分享成绩
          </Button>
        </div>
        <Link href="/exams">
          <Button>返回考试列表</Button>
        </Link>
      </div>
    </PageWrapper>
  )
}
