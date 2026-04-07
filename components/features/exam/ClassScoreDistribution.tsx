'use client'

import type { ReactNode } from 'react'
import { Box, Typography, Stack, LinearProgress } from '@mui/material'
import type { ClassScoreDistribution } from '@/lib/mock/results'

interface ClassScoreDistributionProps {
  distribution: ClassScoreDistribution
  totalStudents: number
}

export function ClassScoreDistribution({ distribution, totalStudents }: ClassScoreDistributionProps): ReactNode {
  const items = [
    { label: '优秀', count: distribution.excellent, color: 'var(--success)' },
    { label: '良好', count: distribution.good, color: 'var(--secondary)' },
    { label: '及格', count: distribution.pass, color: 'var(--warning)' },
    { label: '不及格', count: distribution.fail, color: 'var(--error)' },
  ]

  return (
    <Stack spacing={1.5}>
      {items.map((item) => {
        const percentage = totalStudents > 0 ? (item.count / totalStudents) * 100 : 0
        return (
          <Box key={item.label}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                {item.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500, color: item.color }}>
                {item.count} 人 ({percentage.toFixed(1)}%)
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'var(--muted)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: item.color,
                  transition: 'width 0.5s',
                },
              }}
            />
          </Box>
        )
      })}
    </Stack>
  )
}
