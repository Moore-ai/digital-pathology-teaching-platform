'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { TrendDataPoint } from '@/lib/mock/results'
import { formatDate } from '@/lib/utils'

interface ScoreTrendChartProps {
  data: TrendDataPoint[]
}

export function ScoreTrendChart({ data }: ScoreTrendChartProps): ReactNode {
  if (data.length === 0) return null

  // 计算分数范围
  const minScore = Math.min(...data.map(d => Math.min(d.score, d.avgScore)), 60)
  const maxScore = Math.max(...data.map(d => Math.max(d.score, d.avgScore)), 100)
  const padding = 5
  const yMin = Math.max(0, minScore - padding)
  const yMax = Math.min(100, maxScore + padding)
  const yRange = yMax - yMin

  // 图表尺寸
  const width = 600
  const height = 200
  const marginLeft = 40
  const marginRight = 20
  const marginTop = 20
  const marginBottom = 40
  const chartWidth = width - marginLeft - marginRight
  const chartHeight = height - marginTop - marginBottom

  // 计算点的位置
  const getX = (index: number) => marginLeft + (index / (data.length - 1 || 1)) * chartWidth
  const getY = (score: number) => marginTop + chartHeight - ((score - yMin) / yRange) * chartHeight

  // 生成路径
  const scorePath = data.map((d, i) => {
    const x = getX(i)
    const y = getY(d.score)
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const avgPath = data.map((d, i) => {
    const x = getX(i)
    const y = getY(d.avgScore)
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  // Y轴刻度
  const yTicks = 5
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) => {
    const value = yMin + (yRange * i) / yTicks
    return Math.round(value)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">成绩趋势</CardTitle>
        <CardDescription>最近考试成绩变化趋势</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[400px]"
            style={{ height: 'auto', maxHeight: '250px' }}
          >
            {/* Y轴刻度线 */}
            {yTickValues.map((value, i) => {
              const y = getY(value)
              return (
                <g key={i}>
                  <line
                    x1={marginLeft}
                    y1={y}
                    x2={width - marginRight}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity={value === 60 ? 0.3 : 0.1}
                    strokeDasharray={value === 60 ? '4 4' : 'none'}
                    className="text-muted-foreground"
                  />
                  <text
                    x={marginLeft - 8}
                    y={y}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="text-xs fill-muted-foreground"
                  >
                    {value}
                  </text>
                </g>
              )
            })}

            {/* X轴标签 */}
            {data.map((d, i) => {
              const x = getX(i)
              return (
                <Link key={d.examId} href={`/exams/${d.examId}/result`}>
                  <text
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground hover:fill-secondary cursor-pointer transition-colors"
                  >
                    {d.examName}
                  </text>
                </Link>
              )
            })}

            {/* 班级平均分线（虚线） */}
            <path
              d={avgPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="text-muted-foreground/50"
            />

            {/* 成绩线 */}
            <path
              d={scorePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-secondary"
            />

            {/* 数据点 */}
            {data.map((d, i) => {
              const x = getX(i)
              const y = getY(d.score)
              return (
                <Link key={d.examId} href={`/exams/${d.examId}/result`}>
                  <g className="cursor-pointer group">
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="currentColor"
                      className="text-secondary/20 group-hover:text-secondary/30 transition-colors"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="currentColor"
                      className="text-secondary group-hover:text-secondary/80 transition-colors"
                    />
                    {/* Tooltip */}
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <rect
                        x={x - 50}
                        y={y - 45}
                        width="100"
                        height="35"
                        rx="4"
                        fill="hsl(var(--card))"
                        stroke="hsl(var(--border))"
                        className="shadow-md"
                      />
                      <text
                        x={x}
                        y={y - 32}
                        textAnchor="middle"
                        className="text-xs fill-foreground font-medium"
                      >
                        {d.score} 分
                      </text>
                      <text
                        x={x}
                        y={y - 18}
                        textAnchor="middle"
                        className="text-xs fill-muted-foreground"
                      >
                        平均: {d.avgScore} 分
                      </text>
                    </g>
                  </g>
                </Link>
              )
            })}
          </svg>
        </div>

        {/* 图例 */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 rounded bg-secondary" />
            <span className="text-muted-foreground">我的成绩</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-muted-foreground/50" style={{ backgroundImage: 'repeating-linear-gradient(90deg, currentColor 0, currentColor 4px, transparent 4px, transparent 8px)' }} />
            <span className="text-muted-foreground">班级平均</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
