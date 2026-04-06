'use client'

import type { ReactNode } from 'react'
import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import { QuestionDisplay, AnswerSheet, ExamTimer } from '@/components/features/exam'
import { getExamById } from '@/lib/mock/exams'
import { useExamStore } from '@/stores/examStore'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react'

interface ExamTakePageProps {
  params: Promise<{ id: string }>
}

export default function ExamTakePage({ params }: ExamTakePageProps): ReactNode {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAuthStore()
  const { exams: createdExams } = useExamStore()

  // 先从store中查找，再从mock数据中查找
  const exam = createdExams.find(e => e.id === id) ?? getExamById(id)

  // 使用考试中的题目
  const questions = exam?.questions || []

  const {
    currentQuestionIndex,
    answers,
    timeRemaining,
    isPaused,
    isSubmitted,
    setCurrentQuestionIndex,
    setAnswer,
    setTimeRemaining,
    pauseExam,
    resumeExam,
    submitStudentExam,
    setCurrentExam,
    resetExam,
  } = useExamStore()

  // 初始化考试
  useEffect(() => {
    if (exam) {
      // 设置当前考试
      setCurrentExam(exam)
      setTimeRemaining(exam.duration * 60)
    }

    // 清理：退出时重置
    return () => {
      // 不在这里重置，否则会影响提交记录
    }
  }, [exam, setCurrentExam, setTimeRemaining])

  // 计时器
  useEffect(() => {
    if (isPaused || isSubmitted) return

    const timer = setInterval(() => {
      setTimeRemaining(Math.max(0, timeRemaining - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, isPaused, isSubmitted, setTimeRemaining])

  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [submittedScore, setSubmittedScore] = useState(0)

  if (!exam) {
    notFound()
  }

  // 如果没有题目，显示提示
  if (questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">该考试暂无题目</p>
          <Link href="/exams">
            <Button className="mt-4">返回考试列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  // 确保题目索引在有效范围内
  const safeIndex = Math.min(Math.max(0, currentQuestionIndex), questions.length - 1)
  const currentQuestion = questions[safeIndex]
  const currentAnswer = currentQuestion ? answers.get(currentQuestion.id) : undefined

  // 计算实际已答题数
  const getActualAnsweredCount = () => {
    return questions.filter(q => {
      const answer = answers.get(q.id)
      return answer !== undefined && answer !== '' &&
             (Array.isArray(answer) ? answer.length > 0 : true)
    }).length
  }

  const actualAnsweredCount = getActualAnsweredCount()

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  const handlePrevious = () => goToQuestion(currentQuestionIndex - 1)
  const handleNext = () => goToQuestion(currentQuestionIndex + 1)

  const handleSubmit = () => {
    setShowSubmitDialog(true)
  }

  const confirmSubmit = () => {
    // 提交考试并获取分数
    const score = submitStudentExam(id, user?.id || '')
    setSubmittedScore(score)
    setShowSubmitDialog(false)
    setShowResultDialog(true)
  }

  const handleReturnToList = () => {
    setShowResultDialog(false)
    router.push('/exams')
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-background">
        <div className="flex items-center gap-4">
          <Link href="/exams" className="text-sm text-muted-foreground hover:text-foreground">
            ← 返回列表
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-lg font-medium">{exam.title}</h1>
        </div>
        <ExamTimer
          timeRemaining={timeRemaining}
          isPaused={isPaused}
          onPause={pauseExam}
          onResume={resumeExam}
        />
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex gap-4 p-4 min-h-0">
        {/* 题目区域 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={currentAnswer}
              onAnswerChange={(answer) => setAnswer(currentQuestion.id, answer)}
              disabled={isSubmitted}
            />
          </div>

          {/* 底部导航 */}
          <div className="flex items-center justify-between py-4 border-t mt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一题
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              下一题
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* 答题卡 */}
        <div className="w-72 shrink-0">
          <AnswerSheet
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onQuestionSelect={goToQuestion}
            onSubmit={handleSubmit}
            isSubmitted={isSubmitted}
          />
        </div>
      </div>

      {/* 提交确认对话框 */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              确认提交试卷
            </DialogTitle>
            <DialogDescription>
              您已作答 {actualAnsweredCount} / {questions.length} 题。
              {actualAnsweredCount < questions.length && (
                <span className="text-amber-600">
                  还有 {questions.length - actualAnsweredCount} 题未作答，确定要提交吗？
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              继续答题
            </Button>
            <Button onClick={confirmSubmit}>
              确认提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 结果对话框 */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              考试完成
            </DialogTitle>
            <DialogDescription>
              您的试卷已提交成功。
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">
              {submittedScore}
            </div>
            <p className="text-muted-foreground">
              得分 / 满分 {exam.totalScore}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              正确率: {exam.totalScore > 0 ? Math.round((submittedScore / exam.totalScore) * 100) : 0}%
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Link href={`/exams/${exam.id}/result`}>
              <Button variant="outline">查看解析</Button>
            </Link>
            <Button onClick={handleReturnToList}>返回考试列表</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
