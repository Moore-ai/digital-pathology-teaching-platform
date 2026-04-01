'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { ScoreSlider } from './ScoreSlider'
import { QuickCommentSelect } from './QuickCommentSelect'

interface AnswerPanelProps {
  studentAnswer: string | undefined
  currentScore: number
  maxScore: number
  comment: string
  onScoreChange: (score: number) => void
  onCommentChange: (comment: string) => void
  className?: string
}

export function AnswerPanel({
  studentAnswer,
  currentScore,
  maxScore,
  comment,
  onScoreChange,
  onCommentChange,
  className,
}: AnswerPanelProps): ReactNode {
  return (
    <div className={cn('h-full flex flex-col p-4', className)}>
      {/* 学生答案 */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-foreground">学生答案</span>
        </div>
        <div className="p-4 bg-background border border-border rounded-lg min-h-25">
          {studentAnswer ? (
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {studentAnswer}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              该考生未作答此题
            </p>
          )}
        </div>
      </div>

      {/* 评分区域 */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 bg-muted/30 rounded-lg flex flex-col h-full">
          {/* 分数显示 */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <span className="text-sm font-medium text-foreground">评分</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-secondary">{currentScore}</span>
              <span className="text-sm text-muted-foreground">/ {maxScore} 分</span>
            </div>
          </div>

          {/* 分数滑块 */}
          <div className="mb-4 shrink-0">
            <ScoreSlider
              value={currentScore}
              max={maxScore}
              onChange={onScoreChange}
            />
          </div>

          {/* 评语输入 */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="text-sm font-medium text-foreground mb-2">评语</div>
            <Textarea
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="输入批改评语（可选）..."
              className="flex-1 min-h-20 resize-none text-sm"
            />
            <div className="mt-3">
              <QuickCommentSelect
                value={comment}
                onChange={onCommentChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
