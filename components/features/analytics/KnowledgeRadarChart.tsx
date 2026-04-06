'use client'

import type { ReactNode } from 'react'
import { useEffect, useState, useRef } from 'react'
import {
  Box,
  Paper,
  Typography,
  Skeleton,
} from '@mui/material'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

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

    // 初始测量
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

export function KnowledgeRadarChart({
  className,
  data = defaultData,
}: KnowledgeRadarChartProps): ReactNode {
  return (
    <Paper
      className={className}
      sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
          知识点掌握雷达图
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
          各系统病理知识点掌握程度
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <ChartContainer className="h-80 w-full">
          <RadarChart data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: 'var(--foreground)' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            />
            <Radar
              name="掌握程度"
              dataKey="score"
              stroke="var(--secondary)"
              fill="var(--secondary)"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => [`${value}%`, '掌握程度']}
            />
          </RadarChart>
        </ChartContainer>
      </Box>
    </Paper>
  )
}
