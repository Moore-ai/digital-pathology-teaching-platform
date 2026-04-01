'use client'

import type { ReactNode } from 'react'
import { use, useState, useMemo, useCallback } from 'react'
import { notFound } from 'next/navigation'
import { getExamById } from '@/lib/mock/exams'
import {
  getStudentSubmissions,
  getQuestionGradingStatus,
  getGradingQuestion,
  getStudentAnswer,
} from '@/lib/mock/grading'
import {
  GradingHeader,
  QuestionPanel,
  AnswerPanel,
  QuestionNavBar,
  ActionFooter,
} from '@/components/features/exam/grading'

interface GradingPageProps {
  params: Promise<{ id: string }>
}

// 批改会话状态
interface GradingSession {
  scores: Record<string, number>
  comments: Record<string, string>
}

export default function GradingPage({ params }: GradingPageProps): ReactNode {
  const { id } = use(params)
  const exam = getExamById(id)

  // 学生列表（匿名）
  const students = useMemo(() => getStudentSubmissions(id), [id])

  // 当前学生索引
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)

  // 当前题目索引（在主观题中的索引）
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  // 批改会话数据
  const [sessionData, setSessionData] = useState<GradingSession>({
    scores: {},
    comments: {},
  })

  // 获取当前学生ID
  const currentStudentId = useMemo(() => {
    return students[currentStudentIndex]?.studentId || null
  }, [students, currentStudentIndex])

  // 获取当前学生的题目状态
  const questionStatus = useMemo(() => {
    if (!currentStudentId) return []
    return getQuestionGradingStatus(currentStudentId, id)
  }, [currentStudentId, id])

  // 只显示主观题
  const subjectiveQuestions = useMemo(() => {
    return questionStatus.filter(q => q.isSubjective)
  }, [questionStatus])

  // 获取当前题目（在所有题目中的索引）
  const currentQuestion = useMemo(() => {
    if (subjectiveQuestions.length === 0) return null
    const currentSubjective = subjectiveQuestions[currentQuestionIndex]
    if (!currentSubjective) return null
    return getGradingQuestion(currentSubjective.id)
  }, [subjectiveQuestions, currentQuestionIndex])

  // 当前题目在原数组中的索引
  const currentQuestionOriginalIndex = useMemo(() => {
    if (!currentQuestion) return 0
    return questionStatus.findIndex(q => q.id === currentQuestion.id)
  }, [questionStatus, currentQuestion])

  // 获取当前学生答案
  const currentAnswer = useMemo(() => {
    if (!currentStudentId || !currentQuestion) return undefined
    const answer = getStudentAnswer(currentQuestion.id, currentStudentId)
    return answer?.answer
  }, [currentStudentId, currentQuestion])

  // 当前题目分数
  const currentScore = useMemo(() => {
    if (!currentQuestion) return 0
    const key = `${currentStudentId}-${currentQuestion.id}`
    return sessionData.scores[key] ?? 0
  }, [currentQuestion, sessionData.scores, currentStudentId])

  // 当前题目评语
  const currentComment = useMemo(() => {
    if (!currentQuestion) return ''
    const key = `${currentStudentId}-${currentQuestion.id}`
    return sessionData.comments[key] ?? ''
  }, [currentQuestion, sessionData.comments, currentStudentId])

  // 更新分数
  const handleScoreChange = useCallback((score: number) => {
    if (!currentQuestion || !currentStudentId) return
    const key = `${currentStudentId}-${currentQuestion.id}`
    setSessionData(prev => ({
      ...prev,
      scores: { ...prev.scores, [key]: score },
    }))
  }, [currentQuestion, currentStudentId])

  // 更新评语
  const handleCommentChange = useCallback((comment: string) => {
    if (!currentQuestion || !currentStudentId) return
    const key = `${currentStudentId}-${currentQuestion.id}`
    setSessionData(prev => ({
      ...prev,
      comments: { ...prev.comments, [key]: comment },
    }))
  }, [currentQuestion, currentStudentId])

  // 导航到指定题目
  const handleNavigateQuestion = useCallback((index: number) => {
    // index 是在原数组中的索引，需要转换为在主观题中的索引
    const question = questionStatus[index]
    if (!question) return
    const subjectiveIndex = subjectiveQuestions.findIndex(q => q.id === question.id)
    if (subjectiveIndex !== -1) {
      setCurrentQuestionIndex(subjectiveIndex)
    }
  }, [questionStatus, subjectiveQuestions])

  // 上一考生
  const handlePreviousStudent = useCallback(() => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1)
      setCurrentQuestionIndex(0)
    }
  }, [currentStudentIndex])

  // 保存当前批改
  const handleSave = useCallback(() => {
    // TODO: 保存到服务器
    console.log('保存批改数据', {
      studentId: currentStudentId,
      scores: sessionData.scores,
      comments: sessionData.comments,
    })
  }, [currentStudentId, sessionData])

  // 保存并下一考生
  const handleSaveAndNext = useCallback(() => {
    handleSave()
    if (currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }, [handleSave, currentStudentIndex, students.length])

  if (!exam) {
    notFound()
  }

  return (
    <div className="h-screen flex flex-col bg-muted/20">
      {/* 顶部信息栏 */}
      <header className="h-15 shrink-0 border-b bg-background">
        <GradingHeader
          examTitle={exam.title}
          currentIndex={currentStudentIndex + 1}
          totalCount={students.length}
        />
      </header>

      {/* 主内容区 */}
      <main className="flex-1 flex min-h-0">
        {/* 左侧：题目区域 */}
        <section className="w-1/2 border-r bg-background overflow-y-auto">
          {currentQuestion ? (
            <QuestionPanel question={currentQuestion} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              暂无主观题需要批改
            </div>
          )}
        </section>

        {/* 右侧：学生答案区域 */}
        <section className="w-1/2 bg-background overflow-y-auto">
          {currentQuestion ? (
            <AnswerPanel
              studentAnswer={typeof currentAnswer === 'string' ? currentAnswer : currentAnswer?.join(', ')}
              currentScore={currentScore}
              maxScore={currentQuestion.maxScore}
              comment={currentComment}
              onScoreChange={handleScoreChange}
              onCommentChange={handleCommentChange}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              客观题已自动批改
            </div>
          )}
        </section>
      </main>

      {/* 题目导航栏 */}
      <nav className="h-12 shrink-0 border-t bg-muted/30">
        <QuestionNavBar
          questions={questionStatus}
          currentIndex={currentQuestionOriginalIndex}
          onNavigate={handleNavigateQuestion}
        />
      </nav>

      {/* 底部操作栏 */}
      <footer className="h-14 shrink-0 border-t bg-background">
        <ActionFooter
          hasPrevious={currentStudentIndex > 0}
          hasNext={currentStudentIndex < students.length - 1}
          onPrevious={handlePreviousStudent}
          onSave={handleSave}
          onSaveAndNext={handleSaveAndNext}
        />
      </footer>
    </div>
  )
}
