'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Paper, Box, Typography, Stack } from '@mui/material'
import type { TrendDataPoint } from '@/lib/mock/results'

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
    <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
          成绩趋势
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
          最近考试成绩变化趋势
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', minWidth: '400px', height: 'auto', maxHeight: '250px' }}
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
                    stroke="var(--muted-foreground)"
                    strokeOpacity={value === 60 ? 0.3 : 0.1}
                    strokeDasharray={value === 60 ? '4 4' : 'none'}
                  />
                  <text
                    x={marginLeft - 8}
                    y={y}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    style={{ fontSize: '0.75rem', fill: 'var(--muted-foreground)' }}
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
                    style={{
                      fontSize: '0.75rem',
                      fill: 'var(--muted-foreground)',
                      cursor: 'pointer',
                      transition: 'fill 0.2s',
                    }}
                    className="[&:hover]:fill-secondary"
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
              stroke="var(--muted-foreground)"
              strokeOpacity={0.5}
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* 成绩线 */}
            <path
              d={scorePath}
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 数据点 */}
            {data.map((d, i) => {
              const x = getX(i)
              const y = getY(d.score)
              return (
                <Link key={d.examId} href={`/exams/${d.examId}/result`}>
                  <g style={{ cursor: 'pointer' }}>
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="var(--secondary)"
                      fillOpacity={0.2}
                      style={{ transition: 'fill-opacity 0.2s' }}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="var(--secondary)"
                    />
                    {/* Tooltip */}
                    <g style={{ opacity: 0, transition: 'opacity 0.2s' }} className="[&:hover]:opacity-100">
                      <rect
                        x={x - 50}
                        y={y - 45}
                        width="100"
                        height="35"
                        rx="4"
                        fill="var(--card)"
                        stroke="var(--border)"
                      />
                      <text
                        x={x}
                        y={y - 32}
                        textAnchor="middle"
                        style={{ fontSize: '0.75rem', fill: 'var(--foreground)', fontWeight: 500 }}
                      >
                        {d.score} 分
                      </text>
                      <text
                        x={x}
                        y={y - 18}
                        textAnchor="middle"
                        style={{ fontSize: '0.75rem', fill: 'var(--muted-foreground)' }}
                      >
                        平均: {d.avgScore} 分
                      </text>
                    </g>
                  </g>
                </Link>
              )
            })}
          </svg>
        </Box>

        {/* 图例 */}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 4, borderRadius: 1, bgcolor: 'var(--secondary)' }} />
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              我的成绩
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 16,
                height: 2,
                bgcolor: 'transparent',
                borderTop: '2px dashed var(--muted-foreground)',
                opacity: 0.5,
              }}
            />
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              班级平均
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  )
}
