'use client'

import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface ExamScoreChartProps {
  className?: string
}

const examScoreData = [
  { name: '测验1', score: 72, average: 75 },
  { name: '测验2', score: 78, average: 74 },
  { name: '期中', score: 82, average: 76 },
  { name: '测验3', score: 75, average: 77 },
  { name: '测验4', score: 85, average: 78 },
  { name: '期末', score: 88, average: 79 },
]

// 使用 useSyncExternalStore 检测客户端渲染
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function ExamScoreChart({ className }: ExamScoreChartProps): ReactNode {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  const latestScore = examScoreData[examScoreData.length - 1].score
  const firstScore = examScoreData[0].score
  const improvement = latestScore - firstScore

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium">考试成绩趋势</CardTitle>
            <CardDescription>个人成绩与班级平均对比</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{latestScore}</div>
            <div className="flex items-center gap-1">
              {improvement > 0 ? (
                <>
                  <Badge className="bg-success/10 text-success">↑ {improvement} 分</Badge>
                </>
              ) : (
                <Badge className="bg-destructive/10 text-destructive">↓ {Math.abs(improvement)} 分</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={examScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <YAxis
                  domain={[60, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="#6B7280"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E3A5F',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <ReferenceLine
                  y={80}
                  stroke="#E86A33"
                  strokeDasharray="5 5"
                  label={{ value: '优秀线', fill: '#E86A33', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="班级平均"
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2D8B8B"
                  strokeWidth={3}
                  dot={{ fill: '#2D8B8B', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="我的成绩"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-secondary" />
            <span className="text-muted-foreground">我的成绩</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 border-t-2 border-gray-300 border-dashed" />
            <span className="text-muted-foreground">班级平均</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
