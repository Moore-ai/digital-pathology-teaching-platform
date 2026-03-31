'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClassScoreDistribution } from '@/lib/mock/results'
import { cn } from '@/lib/utils'

interface ClassScoreDistributionProps {
  distribution: ClassScoreDistribution
  totalStudents: number
}

export function ClassScoreDistribution({ distribution, totalStudents }: ClassScoreDistributionProps): ReactNode {
  const items = [
    { label: '优秀', count: distribution.excellent, color: 'bg-success', textColor: 'text-success' },
    { label: '良好', count: distribution.good, color: 'bg-secondary', textColor: 'text-secondary' },
    { label: '及格', count: distribution.pass, color: 'bg-warning', textColor: 'text-warning' },
    { label: '不及格', count: distribution.fail, color: 'bg-error', textColor: 'text-error' },
  ]

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const percentage = totalStudents > 0 ? (item.count / totalStudents) * 100 : 0
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className={cn("font-medium", item.textColor)}>
                {item.count} 人 ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", item.color)}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
