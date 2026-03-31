'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { X, FileCheck } from 'lucide-react'
import Link from 'next/link'

interface GradingHeaderProps {
  examTitle: string
  currentIndex: number
  totalCount: number
  className?: string
}

export function GradingHeader({
  examTitle,
  currentIndex,
  totalCount,
  className,
}: GradingHeaderProps): ReactNode {
  const percentage = totalCount > 0 ? Math.round((currentIndex / totalCount) * 100) : 0

  return (
    <div className={cn('flex items-center justify-between h-full px-6', className)}>
      {/* 左侧：标题和进度 */}
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-semibold text-foreground">
          批改：{examTitle}
        </h1>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            当前考生 {currentIndex}/{totalCount}
          </Badge>
          <Progress value={percentage} className="w-24" />
        </div>
      </div>

      {/* 右侧：退出按钮 */}
      <Link href="/exams">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
          退出批改
        </Button>
      </Link>
    </div>
  )
}
