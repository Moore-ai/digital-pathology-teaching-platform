'use client'

import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, GraduationCap, FileText, TrendingUp } from 'lucide-react'

interface AdminResultStatsProps {
  totalClasses: number
  totalStudents: number
  totalExams: number
  overallAverage: number
  overallPassRate: number
}

export function AdminResultStats({
  totalClasses,
  totalStudents,
  totalExams,
  overallAverage,
  overallPassRate,
}: AdminResultStatsProps): ReactNode {
  const cards = [
    {
      icon: GraduationCap,
      label: '班级数量',
      value: totalClasses,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
    },
    {
      icon: Users,
      label: '学生总数',
      value: totalStudents,
      iconColor: 'text-secondary',
      iconBg: 'bg-secondary/10',
    },
    {
      icon: FileText,
      label: '考试场次',
      value: totalExams,
      iconColor: 'text-info',
      iconBg: 'bg-info/10',
    },
    {
      icon: TrendingUp,
      label: '整体平均分',
      value: overallAverage.toFixed(1),
      iconColor: 'text-success',
      iconBg: 'bg-success/10',
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
