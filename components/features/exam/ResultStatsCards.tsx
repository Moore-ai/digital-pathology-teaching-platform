'use client'

import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Crown, ArrowDown, Award } from 'lucide-react'
import type { ResultStats } from '@/lib/mock/results'

interface ResultStatsCardsProps {
  stats: ResultStats
}

export function ResultStatsCards({ stats }: ResultStatsCardsProps): ReactNode {
  const cards = [
    {
      icon: TrendingUp,
      label: '平均分',
      value: stats.averageScore.toFixed(1),
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10',
    },
    {
      icon: Crown,
      label: '最高分',
      value: stats.highestScore,
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
    },
    {
      icon: ArrowDown,
      label: '最低分',
      value: stats.lowestScore,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
    },
    {
      icon: Award,
      label: '当前排名',
      value: `${stats.currentRank}/${stats.totalStudents}`,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-sm text-muted-foreground">{card.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
