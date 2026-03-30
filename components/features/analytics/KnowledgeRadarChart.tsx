'use client'

import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface KnowledgeRadarChartProps {
  className?: string
  data?: Array<{ subject: string; score: number; fullMark: number }>
}

const defaultData = [
  { subject: '消化系统', score: 85, fullMark: 100 },
  { subject: '呼吸系统', score: 72, fullMark: 100 },
  { subject: '心血管', score: 68, fullMark: 100 },
  { subject: '内分泌', score: 78, fullMark: 100 },
  { subject: '泌尿系统', score: 82, fullMark: 100 },
  { subject: '乳腺', score: 75, fullMark: 100 },
]

// 使用 useSyncExternalStore 检测客户端渲染
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function KnowledgeRadarChart({
  className,
  data = defaultData,
}: KnowledgeRadarChartProps): ReactNode {
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">知识点掌握雷达图</CardTitle>
        <CardDescription>各系统病理知识点掌握程度</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <RadarChart data={data}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 12, fill: '#374151' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#6B7280' }}
                />
                <Radar
                  name="掌握程度"
                  dataKey="score"
                  stroke="#2D8B8B"
                  fill="#2D8B8B"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E3A5F',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value) => [`${value}%`, '掌握程度']}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
