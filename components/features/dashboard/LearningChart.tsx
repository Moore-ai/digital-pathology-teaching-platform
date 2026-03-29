'use client'

import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface LearningChartProps {
  className?: string
}

// 模拟学习数据
const weeklyData = [
  { day: '周一', hours: 2.5 },
  { day: '周二', hours: 1.8 },
  { day: '周三', hours: 3.2 },
  { day: '周四', hours: 2.1 },
  { day: '周五', hours: 1.5 },
  { day: '周六', hours: 4.0 },
  { day: '周日', hours: 3.5 },
]

const monthlyData = [
  { month: '1月', score: 72 },
  { month: '2月', score: 78 },
  { month: '3月', score: 75 },
  { month: '4月', score: 82 },
  { month: '5月', score: 85 },
  { month: '6月', score: 88 },
]

// 使用 useSyncExternalStore 检测客户端渲染
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function LearningChart({ className }: LearningChartProps): ReactNode {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>
      {/* 周学习时长 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">本周学习时长</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E3A5F',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value) => [`${value} 小时`, '学习时长']}
                  />
                  <Bar
                    dataKey="hours"
                    fill="#2D8B8B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>
          <div className="mt-2 text-center">
            <span className="text-2xl font-bold text-primary">18.6</span>
            <span className="text-sm text-muted-foreground ml-1">小时/周</span>
          </div>
        </CardContent>
      </Card>

      {/* 成绩趋势 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">考试成绩趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E3A5F',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value) => [`${value} 分`, '成绩']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#E86A33"
                    strokeWidth={2}
                    dot={{ fill: '#E86A33', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-success">↑ 16 分</span>
            <span className="text-sm text-muted-foreground ml-1">较上学期</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
