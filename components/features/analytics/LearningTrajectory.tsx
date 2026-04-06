'use client'

import type { ReactNode } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
} from '@mui/material'
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
    <Paper
      className={className}
      sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
          学习轨迹
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
          近6个月学习数据统计
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {/* 统计概览 */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }} useFlexGap flexWrap="wrap">
          <Box sx={{ textAlign: 'center', flex: 1, minWidth: 80, p: 1.5, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
            <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
              {totalHours}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              累计学习(小时)
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1, minWidth: 80, p: 1.5, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
            <TrendingUp className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
              {totalCourses}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              完成课程
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1, minWidth: 80, p: 1.5, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
            <Award className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
              {totalExams}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              参加考试
            </Typography>
          </Box>
        </Stack>

        {/* 月度条形图 */}
        <Stack spacing={1.5}>
          {trajectoryData.map((item) => {
            const maxHours = Math.max(...trajectoryData.map(d => d.hours))
            const width = Math.round((item.hours / maxHours) * 100 / 2) * 2

            return (
              <Box key={item.month}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                    {item.month}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                    {item.hours}h
                  </Typography>
                </Stack>
                <Box sx={{ height: 12, bgcolor: 'var(--muted)', borderRadius: 6, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: `${width}%`,
                      bgcolor: 'var(--secondary)',
                      borderRadius: 6,
                      transition: 'width 0.5s',
                    }}
                  />
                </Box>
              </Box>
            )
          })}
        </Stack>

        {/* 趋势标签 */}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 3 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--success)' }} />
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              学习时长持续增长
            </Typography>
          </Stack>
          <Chip
            size="small"
            label="+85% 较半年前"
            sx={{
              height: 24,
              bgcolor: 'var(--secondary)',
              color: 'var(--secondary-foreground)',
              '& .MuiChip-label': { color: 'var(--secondary-foreground)' },
            }}
          />
        </Stack>
      </Box>
    </Paper>
  )
}
