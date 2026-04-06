'use client'

import type { ReactNode } from 'react'
import { use, useState, useMemo, useCallback, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getExamById } from '@/lib/mock/exams'
import { useExamStore, type SubjectiveGrade } from '@/stores/examStore'
import { useAuthStore } from '@/stores/authStore'
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
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle } from 'lucide-react'

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
  const router = useRouter()
  const { exams: createdExams } = useExamStore()
  const exam = createdExams.find(e => e.id === id) ?? getExamById(id)
  const { user } = useAuthStore()
  const {
    gradeSubjectiveQuestion,
    completeGrading,
    isSubjectiveGraded,
    getSubjectiveGrade,
    isGradingComplete,
  } = useExamStore()

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
    if (!currentQuestion || !currentStudentId || !user?.id) return

    const questionId = currentQuestion.id
    const score = currentScore
    const comment = currentComment

    // 保存批改结果到 store
    const grade: SubjectiveGrade = {
      questionId,
      score,
      comment,
      gradedBy: user.id,
      gradedAt: new Date(),
    }

    gradeSubjectiveQuestion(id, currentStudentId, questionId, grade)

    console.log('保存批改数据', {
      examId: id,
      studentId: currentStudentId,
      questionId,
      score,
      comment,
    })
  }, [currentQuestion, currentStudentId, user?.id, currentScore, currentComment, gradeSubjectiveQuestion, id])

  // 完成当前学生的批改
  const handleCompleteGrading = useCallback(() => {
    if (!currentStudentId || !user?.id) return
    completeGrading(id, currentStudentId, user.id)
  }, [id, currentStudentId, user?.id, completeGrading])

  // 保存并下一考生
  const handleSaveAndNext = useCallback(() => {
    handleSave()

    if (currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }, [handleSave, currentStudentIndex, students.length])

  // 完成批改
  const handleComplete = useCallback(() => {
    handleSave()
    handleCompleteGrading()

    // 返回考试详情页
    router.push(`/exams/${id}`)
  }, [handleSave, handleCompleteGrading, router, id])

  // 判断是否是最后一个学生
  const isLastStudent = currentStudentIndex === students.length - 1

  // 检查当前学生是否已批改完成
  const currentStudentGraded = useMemo(() => {
    if (!currentStudentId) return false
    return isGradingComplete(id, currentStudentId)
  }, [id, currentStudentId, isGradingComplete])

  // 检查考试是否已完成批改
  const examGraded = exam?.status === 'graded'

  if (!exam) {
    notFound()
  }

  // 如果考试已批改完成，显示提示
  if (examGraded) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-muted/20">
        <div className="text-center max-w-md p-8 bg-background rounded-lg shadow-lg">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">批改已完成</h2>
          <p className="text-muted-foreground mb-6">
            该考试的所有试卷已批改完成，不能重复批改。
          </p>
          <Link href={`/exams/${id}`}>
            <Button>返回考试详情</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-muted/20">
      {/* 顶部信息栏 */}
      <header className="h-15 shrink-0 border-b bg-background relative">
        <GradingHeader
          examTitle={exam.title}
          currentIndex={currentStudentIndex + 1}
          totalCount={students.length}
        />
        {/* 当前学生批改状态指示 */}
        {currentStudentGraded && (
          <div className="absolute top-1/2 right-6 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-success/10 text-success rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            已批改
          </div>
        )}
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
          {currentStudentGraded ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <CheckCircle className="w-16 h-16 text-success mb-4" />
              <h3 className="text-xl font-semibold mb-2">已批改完成</h3>
              <p className="text-muted-foreground text-center mb-4">
                该学生的试卷已批改完成，不能重复批改。
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentStudentIndex < students.length - 1) {
                      setCurrentStudentIndex(currentStudentIndex + 1)
                      setCurrentQuestionIndex(0)
                    }
                  }}
                  disabled={isLastStudent}
                >
                  批改下一学生
                </Button>
                <Link href={`/exams/${id}`}>
                  <Button>返回考试详情</Button>
                </Link>
              </div>
            </div>
          ) : currentQuestion ? (
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
        {currentStudentGraded ? (
          <div className="flex items-center justify-between h-full px-6">
            <Button
              variant="outline"
              onClick={handlePreviousStudent}
              disabled={currentStudentIndex === 0}
              className="gap-2"
            >
              上一考生
            </Button>
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">该学生已批改完成</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/exams/${id}`}>
                <Button variant="outline">返回</Button>
              </Link>
              <Button
                onClick={() => {
                  if (currentStudentIndex < students.length - 1) {
                    setCurrentStudentIndex(currentStudentIndex + 1)
                    setCurrentQuestionIndex(0)
                  }
                }}
                disabled={isLastStudent}
                className="gap-2"
              >
                下一考生
              </Button>
            </div>
          </div>
        ) : (
          <ActionFooter
            hasPrevious={currentStudentIndex > 0}
            hasNext={!isLastStudent}
            onPrevious={handlePreviousStudent}
            onSave={handleSave}
            onSaveAndNext={handleSaveAndNext}
            onComplete={isLastStudent ? handleComplete : undefined}
          />
        )}
      </footer>
    </div>
  )
}
