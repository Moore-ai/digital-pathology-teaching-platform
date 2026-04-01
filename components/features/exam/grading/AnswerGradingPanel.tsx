'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ChevronDown, ChevronUp, ExternalLink, Clock } from 'lucide-react'
import { ScoreSlider } from './ScoreSlider'
import { QuickCommentSelect } from './QuickCommentSelect'
import { GradingQuestion, StudentAnswer, QuestionGradingStatus } from '@/lib/mock/grading'

interface AnswerGradingPanelProps {
  question: GradingQuestion
  questionStatus: QuestionGradingStatus
  studentAnswer: StudentAnswer | undefined
  currentScore: number
  comment: string
  onScoreChange: (score: number) => void
  onCommentChange: (comment: string) => void
  onPrevious: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
  className?: string
}

const questionTypeLabels: Record<string, string> = {
  single: '单选题',
  multiple: '多选题',
  judgment: '判断题',
  short_answer: '简答题',
  essay: '论述题',
}

export function AnswerGradingPanel({
  question,
  questionStatus,
  studentAnswer,
  currentScore,
  comment,
  onScoreChange,
  onCommentChange,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  className,
}: AnswerGradingPanelProps): ReactNode {
  const [showReference, setShowReference] = useState(true)
  const [showRubric, setShowRubric] = useState(false)

  const isSubjective = questionStatus.isSubjective

  return (
    <div className={cn('h-full flex flex-col', className)}>
      {/* 题目信息头部 */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground">
            第 {question.index} 题
          </h3>
          <Badge variant="outline" className="text-xs">
            {questionTypeLabels[question.type] || question.type}
          </Badge>
          {isSubjective ? (
            <Badge variant="secondary" className="bg-warning/10 text-warning text-xs">
              主观题
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-success/10 text-success text-xs">
              客观题
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">满分 {question.maxScore} 分</span>
        </div>
      </div>

      {/* 双栏布局 */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* 左侧：题目和答案 */}
        <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-y-auto">
          {/* 题目内容 */}
          <Card className="shrink-0">
            <CardContent className="py-3">
              <p className="text-foreground whitespace-pre-wrap text-sm">{question.content}</p>
              {question.relatedSlices && question.relatedSlices.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
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
            </CardContent>
          </Card>

          {/* 参考答案（可折叠） */}
          <Card className="shrink-0">
            <button
              onClick={() => setShowReference(!showReference)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
            >
              <span className="text-sm font-medium">参考答案</span>
              {showReference ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {showReference && (
              <CardContent className="pt-0 border-t">
                <div className="bg-muted/30 rounded-lg p-3 mt-2">
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-sans">
                    {question.referenceAnswer}
                  </pre>
                </div>

                {/* 评分细则 */}
                {question.gradingRubric && question.gradingRubric.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowRubric(!showRubric)
                      }}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <span>评分细则</span>
                      {showRubric ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                    {showRubric && (
                      <div className="mt-2 space-y-1">
                        {question.gradingRubric.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-2 rounded bg-muted/20"
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
              </CardContent>
            )}
          </Card>

          {/* 学生答案 */}
          <Card className="shrink-0">
            <CardContent className="py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">学生答案</span>
                {studentAnswer?.submittedAt && (
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>
                      {studentAnswer.submittedAt.toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>
              {studentAnswer ? (
                <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3">
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {Array.isArray(studentAnswer.answer)
                      ? studentAnswer.answer.join(', ')
                      : studentAnswer.answer}
                  </p>
                </div>
              ) : (
                <div className="text-center py-3 text-sm text-muted-foreground">
                  该学生未作答此题
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：评分区域 */}
        <div className="w-80 shrink-0 flex flex-col gap-3">
          {/* 评分区域 - 仅主观题显示 */}
          {isSubjective ? (
            <Card className="border-secondary/30 flex-1 overflow-y-auto">
              <CardContent className="p-3 space-y-3">
                <div className="text-sm font-medium text-foreground">评分</div>
                <ScoreSlider
                  value={currentScore}
                  max={question.maxScore}
                  onChange={onScoreChange}
                />

                {/* 评语输入 */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">评语</div>
                  <Textarea
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder="输入批改评语..."
                    rows={2}
                    className="text-sm"
                  />
                  <QuickCommentSelect
                    value={comment}
                    onChange={onCommentChange}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            /* 客观题显示自动批改结果 */
            <Card className="border-success/30 bg-success/5">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success text-white text-xs">客观题</Badge>
                    <span className="text-xs text-muted-foreground">
                      已自动批改
                    </span>
                  </div>
                  <div className="text-base font-bold">
                    得分: <span className="text-success">{questionStatus.score}</span> / {question.maxScore}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 导航按钮 */}
          <div className="flex items-center justify-between gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={isFirst}
              className="flex-1"
            >
              上一题
            </Button>
            <Button size="sm" onClick={onNext} className="flex-1">
              {isLast ? '完成' : '下一题'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
