'use client'

import type { ReactNode } from 'react'
import { Paper, Box, Typography, Stack, Chip } from '@mui/material'
import type { ClassResultStats } from '@/lib/mock/results'
import { Button } from '@/components/ui/button'
import { ClassScoreDistribution } from './ClassScoreDistribution'
import { Eye } from 'lucide-react'
import Link from 'next/link'

interface ClassResultCardProps {
  className?: string
  result: ClassResultStats
}

export function ClassResultCard({ className, result }: ClassResultCardProps): ReactNode {
  return (
    <Paper
      className={className}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        bgcolor: 'var(--card)',
        border: '1px solid var(--border)',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: 'var(--foreground)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {result.examTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
              {result.className}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={`${result.passRate.toFixed(1)}% 及格`}
            sx={{
              height: 24,
              bgcolor: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
              color: 'var(--secondary)',
              '& .MuiChip-label': { color: 'var(--secondary)' },
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ p: 2, pt: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 核心统计 */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5, mb: 2 }}>
          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'var(--secondary)' }}>
              {result.averageScore.toFixed(1)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              平均分
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'var(--success)' }}>
              {result.highestScore}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              最高分
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'var(--warning)' }}>
              {result.lowestScore}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              最低分
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
              {result.submissionCount}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              提交
            </Typography>
          </Box>
        </Box>

        {/* 成绩分布 */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mb: 1 }}>
            成绩分布
          </Typography>
          <ClassScoreDistribution
            distribution={result.distribution}
            totalStudents={result.totalStudents}
          />
        </Box>

        {/* 操作按钮 */}
        <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid var(--border)' }}>
          <Link href={`/exams/${result.examId}`} style={{ display: 'block' }}>
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Eye className="w-4 h-4" />
              查看考试
            </Button>
          </Link>
        </Box>
      </Box>
    </Paper>
  )
}
