'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'
import { QuestionGradingStatus } from '@/lib/mock/grading'

interface QuestionNavBarProps {
  questions: QuestionGradingStatus[]
  currentIndex: number
  onNavigate: (index: number) => void
  className?: string
}

export function QuestionNavBar({
  questions,
  currentIndex,
  onNavigate,
  className,
}: QuestionNavBarProps): ReactNode {
  // 只显示主观题
  const subjectiveQuestions = questions.filter(q => q.isSubjective)
  const objectiveCount = questions.filter(q => !q.isSubjective).length

  return (
    <div className={cn('flex items-center justify-between h-full px-6', className)}>
      {/* 题目导航按钮 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">题目导航</span>
        {subjectiveQuestions.map((question) => {
          const isCurrent = question.index === questions[currentIndex]?.index
          const isGraded = question.isGraded

          return (
            <Button
              key={question.id}
              variant={isCurrent ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                // 找到在原数组中的索引
                const originalIndex = questions.findIndex(q => q.id === question.id)
                onNavigate(originalIndex)
              }}
              className={cn(
                'w-9 h-9 p-0 relative',
                isGraded && 'bg-success/10 border-success text-success hover:bg-success/20',
              )}
            >
              <span className="text-sm">{question.index}</span>
              {isGraded && (
                <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-success bg-background rounded-full" />
              )}
            </Button>
          )
        })}
      </div>

      {/* 统计信息 */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {objectiveCount > 0 && (
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-success" />
            客观题 {objectiveCount} 题（已自动批改）
          </span>
        )}
        <span className="flex items-center gap-1">
          <Circle className="w-3 h-3" />
          主观题 {subjectiveQuestions.length} 题
        </span>
      </div>
    </div>
  )
}
