'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle, MinusCircle } from 'lucide-react'
import { QuestionGradingStatus } from '@/lib/mock/grading'

interface QuestionNavigationProps {
  questions: QuestionGradingStatus[]
  currentIndex: number
  onNavigate: (index: number) => void
  className?: string
}

export function QuestionNavigation({
  questions,
  currentIndex,
  onNavigate,
  className,
}: QuestionNavigationProps): ReactNode {
  // 统计客观题和主观题数量
  const objectiveCount = questions.filter(q => !q.isSubjective).length
  const subjectiveCount = questions.filter(q => q.isSubjective).length
  const gradedCount = questions.filter(q => q.isGraded).length

  return (
    <div className={cn('space-y-3', className)}>
      <div className="text-sm font-medium text-foreground">题目导航</div>

      {/* 题目按钮 */}
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const isCurrent = index === currentIndex
          const Icon = question.isGraded
            ? CheckCircle
            : isCurrent
              ? MinusCircle
              : Circle

          return (
            <Button
              key={question.id}
              variant={isCurrent ? 'default' : 'outline'}
              size="sm"
              onClick={() => onNavigate(index)}
              className={cn(
                'w-10 h-10 p-0 relative',
                question.isGraded && 'bg-success/10 border-success text-success hover:bg-success/20',
                !question.isGraded && question.isSubjective && 'border-warning/50',
              )}
            >
              <span className="text-sm">{question.index}</span>
              {question.isGraded && (
                <CheckCircle className="absolute -top-1 -right-1 w-3 h-3 text-success bg-background rounded-full" />
              )}
            </Button>
          )
        })}
      </div>

      {/* 题型统计 */}
      <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3" />
          <span>客观题: {objectiveCount} 题 (自动批改)</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="w-3 h-3 text-warning" />
          <span>主观题: {subjectiveCount} 题 (需人工批改)</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-success" />
          <span>已批改: {gradedCount} / {questions.length} 题</span>
        </div>
      </div>
    </div>
  )
}
