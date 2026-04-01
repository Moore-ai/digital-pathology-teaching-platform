'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Save } from 'lucide-react'

interface ActionFooterProps {
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onSave: () => void
  onSaveAndNext: () => void
  className?: string
}

export function ActionFooter({
  hasPrevious,
  onPrevious,
  onSave,
  onSaveAndNext,
  className,
}: ActionFooterProps): ReactNode {
  return (
    <div className={cn('flex items-center justify-between h-full px-6', className)}>
      {/* 左侧：上一考生 */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        上一考生
      </Button>

      {/* 右侧：保存操作 */}
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onSave} className="gap-2">
          <Save className="w-4 h-4" />
          保存
        </Button>
        <Button onClick={onSaveAndNext} className="gap-2">
          保存并下一考生
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
