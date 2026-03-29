'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Question, QuestionType } from '@/types/exam'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, XCircle, FileImage, Lightbulb } from 'lucide-react'

interface QuestionDisplayProps {
  className?: string
  question: Question
  questionNumber: number
  selectedAnswer?: string | string[]
  onAnswerChange?: (answer: string | string[]) => void
  showResult?: boolean
  disabled?: boolean
}

const difficultyLabels: Record<string, { label: string; color: string }> = {
  easy: { label: '简单', color: 'bg-green-100 text-green-800' },
  medium: { label: '中等', color: 'bg-amber-100 text-amber-800' },
  hard: { label: '困难', color: 'bg-red-100 text-red-800' },
}

const typeLabels: Record<QuestionType, string> = {
  single: '单选题',
  multiple: '多选题',
  judgment: '判断题',
  short_answer: '简答题',
}

export function QuestionDisplay({
  className,
  question,
  questionNumber,
  selectedAnswer,
  onAnswerChange,
  showResult = false,
  disabled = false,
}: QuestionDisplayProps): ReactNode {
  const difficulty = difficultyLabels[question.difficulty]

  const handleOptionClick = (key: string) => {
    if (disabled || !onAnswerChange) return

    if (question.type === 'single') {
      onAnswerChange(key)
    } else if (question.type === 'multiple') {
      const current = Array.isArray(selectedAnswer) ? selectedAnswer : []
      if (current.includes(key)) {
        onAnswerChange(current.filter(k => k !== key))
      } else {
        onAnswerChange([...current, key].sort())
      }
    } else if (question.type === 'judgment') {
      onAnswerChange(key)
    }
  }

  const isOptionSelected = (key: string) => {
    if (question.type === 'multiple') {
      return Array.isArray(selectedAnswer) && selectedAnswer.includes(key)
    }
    return selectedAnswer === key
  }

  const isOptionCorrect = (key: string) => {
    if (!showResult) return false
    const correct = question.correctAnswer
    if (Array.isArray(correct)) {
      return correct.includes(key)
    }
    return correct === key
  }

  const renderOptions = () => {
    if (question.type === 'short_answer') {
      return (
        <textarea
          className="w-full min-h-30 p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="请输入您的答案..."
          value={typeof selectedAnswer === 'string' ? selectedAnswer : ''}
          onChange={(e) => onAnswerChange?.(e.target.value)}
          disabled={disabled}
        />
      )
    }

    if (question.type === 'judgment') {
      return (
        <div className="space-y-3">
          {['正确', '错误'].map((option) => (
            <button
              key={option}
              onClick={() => onAnswerChange?.(option)}
              disabled={disabled}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all",
                selectedAnswer === option
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50",
                disabled && "cursor-not-allowed opacity-60",
                showResult && isOptionCorrect(option) && "border-green-500 bg-green-50",
                showResult && selectedAnswer === option && !isOptionCorrect(option) && "border-red-500 bg-red-50"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                selectedAnswer === option ? "border-primary bg-primary text-white" : "border-gray-300"
              )}>
                {selectedAnswer === option && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {question.options?.map((option) => {
          const isSelected = isOptionSelected(option.key)
          const isCorrect = isOptionCorrect(option.key)

          return (
            <button
              key={option.key}
              onClick={() => handleOptionClick(option.key)}
              disabled={disabled}
              className={cn(
                "w-full flex items-start gap-3 p-4 rounded-lg border text-left transition-all",
                isSelected ? "border-primary bg-primary/5" : "hover:bg-muted/50",
                disabled && "cursor-not-allowed opacity-60",
                showResult && isCorrect && "border-green-500 bg-green-50",
                showResult && isSelected && !isCorrect && "border-red-500 bg-red-50"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                isSelected ? "border-primary bg-primary text-white" : "border-gray-300",
                question.type === 'multiple' && "rounded-md"
              )}>
                {isSelected && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <span className="font-medium">{option.key}.</span>
                <span className="ml-2">{option.value}</span>
              </div>
              {showResult && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">第 {questionNumber} 题</Badge>
            <Badge className={difficulty.color}>{difficulty.label}</Badge>
            <Badge variant="outline">{typeLabels[question.type]}</Badge>
          </div>
          <span className="text-sm text-muted-foreground">{question.score} 分</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 题目内容 */}
        <CardTitle className="text-base font-medium leading-relaxed">
          {question.content}
        </CardTitle>

        {/* 相关切片 */}
        {question.relatedSlice && (
          <Button variant="outline" size="sm" className="gap-2">
            <FileImage className="w-4 h-4" />
            查看相关切片
          </Button>
        )}

        {/* 选项 */}
        {renderOptions()}

        {/* 答案解析 */}
        {showResult && question.explanation && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-foreground">答案解析</span>
            </div>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
