'use client'

import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, MessageCircle, CheckCircle, TrendingUp } from 'lucide-react'

interface MyDiscussionStatsProps {
  totalPosts: number
  withReplies: number
  solved: number
  solveRate: number
}

export function MyDiscussionStats({
  totalPosts,
  withReplies,
  solved,
  solveRate,
}: MyDiscussionStatsProps): ReactNode {
  const stats = [
    {
      icon: MessageSquare,
      value: totalPosts,
      label: '我的提问',
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10',
    },
    {
      icon: MessageCircle,
      value: withReplies,
      label: '已获回复',
      iconColor: 'text-info',
      iconBg: 'bg-info/10',
    },
    {
      icon: CheckCircle,
      value: solved,
      label: '已解决',
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      value: `${solveRate}%`,
      label: '解决率',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
