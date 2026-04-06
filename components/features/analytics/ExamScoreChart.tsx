'use client'

import type { ReactNode } from 'react'
import { useEffect, useState, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Skeleton,
} from '@mui/material'
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

// 图表容器组件 - 处理尺寸问题
function ChartContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      const { width, height } = container.getBoundingClientRect()
      if (width > 0 && height > 0) {
        setDimensions({ width, height })
      }
    }

    updateDimensions()

    const observer = new ResizeObserver(() => {
      updateDimensions()
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <Box ref={containerRef} className={className}>
      {dimensions ? (
        <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
          {children}
        </ResponsiveContainer>
      ) : (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      )}
    </Box>
  )
}

export function ExamScoreChart({ className }: ExamScoreChartProps): ReactNode {
  const latestScore = examScoreData[examScoreData.length - 1].score
  const firstScore = examScoreData[0].score
  const improvement = latestScore - firstScore

  return (
    <Paper
      className={className}
      sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
              考试成绩趋势
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
              个人成绩与班级平均对比
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
              {latestScore}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {improvement > 0 ? (
                <Chip
                  size="small"
                  label={`↑ ${improvement} 分`}
                  sx={{
                    height: 24,
                    bgcolor: 'color-mix(in srgb, var(--success) 10%, transparent)',
                    color: 'var(--success)',
                    '& .MuiChip-label': { color: 'var(--success)' },
                  }}
                />
              ) : (
                <Chip
                  size="small"
                  label={`↓ ${Math.abs(improvement)} 分`}
                  sx={{
                    height: 24,
                    bgcolor: 'color-mix(in srgb, var(--error) 10%, transparent)',
                    color: 'var(--error)',
                    '& .MuiChip-label': { color: 'var(--error)' },
                  }}
                />
              )}
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box sx={{ p: 2 }}>
        <ChartContainer className="h-72 w-full">
          <LineChart data={examScoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              domain={[60, 100]}
              tick={{ fontSize: 12 }}
              stroke="var(--muted-foreground)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <ReferenceLine
              y={80}
              stroke="var(--accent)"
              strokeDasharray="5 5"
              label={{ value: '优秀线', fill: 'var(--accent)', fontSize: 10 }}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="var(--muted-foreground)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="班级平均"
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--secondary)"
              strokeWidth={3}
              dot={{ fill: 'var(--secondary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="我的成绩"
            />
          </LineChart>
        </ChartContainer>

        {/* 图例 */}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 2, bgcolor: 'var(--secondary)' }} />
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              我的成绩
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 16, height: 0, borderTop: '2px dashed', borderColor: 'var(--muted-foreground)' }} />
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              班级平均
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  )
}
