'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Question } from '@/types/exam'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle2 } from 'lucide-react'

interface AnswerSheetProps {
  className?: string
  questions: Question[]
  currentQuestionIndex: number
  answers: Map<string, string | string[]>
  onQuestionSelect: (index: number) => void
  onSubmit?: () => void
  isSubmitted?: boolean
}

export function AnswerSheet({
  className,
  questions,
  currentQuestionIndex,
  answers,
  onQuestionSelect,
  onSubmit,
  isSubmitted = false,
}: AnswerSheetProps): ReactNode {
  const answeredCount = answers.size
  const totalCount = questions.length

  const getQuestionStatus = (index: number) => {
    const question = questions[index]
    const answer = answers.get(question.id)
    return answer !== undefined && answer !== '' &&
           (Array.isArray(answer) ? answer.length > 0 : true)
  }

  return (
    <div className={cn("flex flex-col bg-card border rounded-lg", className)}>
      {/* 标题 */}
      <div className="p-4 border-b">
        <h3 className="text-base font-medium text-foreground">答题卡</h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>已答: {answeredCount}/{totalCount}</span>
          <span>未答: {totalCount - answeredCount}</span>
        </div>
        {/* 进度条 */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary transition-all answer-progress"
            data-progress={Math.round((answeredCount / totalCount) * 100)}
          />
        </div>
      </div>

      {/* 题目网格 */}
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((_, index) => {
            const isAnswered = getQuestionStatus(index)
            const isCurrent = index === currentQuestionIndex

            return (
              <button
                key={index}
                onClick={() => onQuestionSelect(index)}
                className={cn(
                  "w-10 h-10 rounded-lg text-sm font-medium transition-all",
                  "flex items-center justify-center",
                  isCurrent && "ring-2 ring-primary ring-offset-2",
                  isAnswered
                    ? "bg-secondary text-white"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                )}
              >
                {isAnswered ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* 图例 */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-secondary" />
            <span>已答</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-muted" />
            <span>未答</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded border-2 border-primary" />
            <span>当前</span>
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      {!isSubmitted && onSubmit && (
        <div className="p-4 border-t">
          <Button
            className="w-full"
            onClick={onSubmit}
            disabled={answeredCount < totalCount}
          >
            提交试卷
          </Button>
          {answeredCount < totalCount && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              还有 {totalCount - answeredCount} 题未作答
            </p>
          )}
        </div>
      )}
    </div>
  )
}
