'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { GradingQuestion } from '@/lib/mock/grading'

interface QuestionPanelProps {
  question: GradingQuestion
  className?: string
}

const questionTypeLabels: Record<string, string> = {
  single: '单选题',
  multiple: '多选题',
  judgment: '判断题',
  short_answer: '简答题',
  essay: '论述题',
}

export function QuestionPanel({
  question,
  className,
}: QuestionPanelProps): ReactNode {
  const [showReference, setShowReference] = useState(true)
  const [showRubric, setShowRubric] = useState(false)

  return (
    <div className={cn('h-full flex flex-col p-4', className)}>
      {/* 题目标题 */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <h2 className="text-base font-semibold text-foreground">
          第 {question.index} 题
        </h2>
        <Badge variant="outline" className="text-xs">
          {questionTypeLabels[question.type] || question.type}
        </Badge>
        <span className="text-sm text-muted-foreground">
          满分 {question.maxScore} 分
        </span>
      </div>

      {/* 题目内容 */}
      <div className="mb-4 p-4 bg-muted/30 rounded-lg flex-shrink-0">
        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
          {question.content}
        </p>
        {question.relatedSlices && question.relatedSlices.length > 0 && (
          <div className="mt-3 flex items-center gap-2 pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">相关切片:</span>
            {question.relatedSlices.map((sliceId) => (
              <Button
                key={sliceId}
                variant="link"
                size="sm"
                className="h-auto p-0 text-secondary text-xs"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                {sliceId}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* 参考答案 */}
      <div className="flex-1 flex flex-col min-h-0">
        <button
          onClick={() => setShowReference(!showReference)}
          className="flex items-center justify-between p-3 bg-secondary/5 hover:bg-secondary/10 rounded-t-lg border border-secondary/20 transition-colors flex-shrink-0"
        >
          <span className="text-sm font-medium text-foreground">参考答案</span>
          {showReference ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showReference && (
          <div className="flex-1 overflow-y-auto border border-t-0 border-secondary/20 rounded-b-lg bg-secondary/5 p-4">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
              {question.referenceAnswer}
            </pre>

            {/* 评分细则 */}
            {question.gradingRubric && question.gradingRubric.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <button
                  onClick={() => setShowRubric(!showRubric)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
                >
                  <span>评分细则</span>
                  {showRubric ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
                {showRubric && (
                  <div className="space-y-2">
                    {question.gradingRubric.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 rounded bg-background/50"
                      >
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {item.score}分
                        </Badge>
                        <div>
                          <div className="text-xs font-medium">{item.criterion}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
