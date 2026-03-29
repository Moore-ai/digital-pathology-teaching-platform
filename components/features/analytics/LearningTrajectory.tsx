'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, TrendingUp, Award } from 'lucide-react'

interface LearningTrajectoryProps {
  className?: string
}

interface MonthlyStats {
  month: string
  hours: number
  courses: number
  exams: number
}

const trajectoryData: MonthlyStats[] = [
  { month: '2025年10月', hours: 28, courses: 3, exams: 2 },
  { month: '2025年11月', hours: 35, courses: 4, exams: 3 },
  { month: '2025年12月', hours: 42, courses: 5, exams: 2 },
  { month: '2026年1月', hours: 38, courses: 4, exams: 4 },
  { month: '2026年2月', hours: 45, courses: 6, exams: 3 },
  { month: '2026年3月', hours: 52, courses: 7, exams: 5 },
]

export function LearningTrajectory({ className }: LearningTrajectoryProps): ReactNode {
  const totalHours = trajectoryData.reduce((sum, d) => sum + d.hours, 0)
  const totalCourses = trajectoryData[trajectoryData.length - 1].courses
  const totalExams = trajectoryData.reduce((sum, d) => sum + d.exams, 0)

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">学习轨迹</CardTitle>
        <CardDescription>近6个月学习数据统计</CardDescription>
      </CardHeader>
      <CardContent>
        {/* 统计概览 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Clock className="w-5 h-5 mx-auto mb-1 text-secondary" />
            <div className="text-2xl font-bold text-foreground">{totalHours}</div>
            <div className="text-xs text-muted-foreground">累计学习(小时)</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-secondary" />
            <div className="text-2xl font-bold text-foreground">{totalCourses}</div>
            <div className="text-xs text-muted-foreground">完成课程</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Award className="w-5 h-5 mx-auto mb-1 text-secondary" />
            <div className="text-2xl font-bold text-foreground">{totalExams}</div>
            <div className="text-xs text-muted-foreground">参加考试</div>
          </div>
        </div>

        {/* 月度条形图 */}
        <div className="space-y-3">
          {trajectoryData.map((item) => {
            const maxHours = Math.max(...trajectoryData.map(d => d.hours))
            const width = Math.round((item.hours / maxHours) * 100 / 2) * 2 // 四舍五入到最近的偶数

            return (
              <div key={item.month} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <span className="font-medium">{item.hours}h</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-500 progress-bar"
                    data-width={width}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* 趋势标签 */}
        <div className="flex items-center justify-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-muted-foreground">学习时长持续增长</span>
          </div>
          <Badge variant="secondary">+85% 较半年前</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
