'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { quickComments } from '@/lib/mock/grading'

interface QuickCommentSelectProps {
  value: string
  onChange: (comment: string) => void
  className?: string
}

export function QuickCommentSelect({
  value,
  onChange,
  className,
}: QuickCommentSelectProps): ReactNode {
  const handleQuickComment = (comment: string) => {
    const newComment = value ? `${value}；${comment}` : comment
    onChange(newComment)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-xs text-muted-foreground">快捷评语</div>

      {/* 正面评语 */}
      <div className="flex flex-wrap gap-1">
        {quickComments.positive.map((comment) => (
          <Button
            key={comment}
            variant="outline"
            size="sm"
            onClick={() => handleQuickComment(comment)}
            className="text-xs h-7 px-2 text-success border-success/30 hover:bg-success/10"
          >
            {comment}
          </Button>
        ))}
      </div>

      {/* 中性和负面评语 */}
      <div className="flex flex-wrap gap-1">
        {quickComments.neutral.map((comment) => (
          <Button
            key={comment}
            variant="outline"
            size="sm"
            onClick={() => handleQuickComment(comment)}
            className="text-xs h-7 px-2"
          >
            {comment}
          </Button>
        ))}
        {quickComments.negative.slice(0, 3).map((comment) => (
          <Button
            key={comment}
            variant="outline"
            size="sm"
            onClick={() => handleQuickComment(comment)}
            className="text-xs h-7 px-2 text-error border-error/30 hover:bg-error/10"
          >
            {comment}
          </Button>
        ))}
      </div>
    </div>
  )
}
