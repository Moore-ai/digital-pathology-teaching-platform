'use client'

import type { ReactNode } from 'react'
import { Paper, Box, Typography, Stack } from '@mui/material'
import { TrendingUp, Crown, ArrowDown, Award } from 'lucide-react'
import type { ResultStats } from '@/lib/mock/results'

interface ResultStatsCardsProps {
  stats: ResultStats
}

export function ResultStatsCards({ stats }: ResultStatsCardsProps): ReactNode {
  const cards = [
    {
      icon: TrendingUp,
      label: '平均分',
      value: stats.averageScore.toFixed(1),
      iconColor: 'var(--secondary)',
      iconBg: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
    },
    {
      icon: Crown,
      label: '最高分',
      value: stats.highestScore,
      iconColor: 'var(--success)',
      iconBg: 'color-mix(in srgb, var(--success) 10%, transparent)',
    },
    {
      icon: ArrowDown,
      label: '最低分',
      value: stats.lowestScore,
      iconColor: 'var(--warning)',
      iconBg: 'color-mix(in srgb, var(--warning) 10%, transparent)',
    },
    {
      icon: Award,
      label: '当前排名',
      value: `${stats.currentRank}/${stats.totalStudents}`,
      iconColor: 'var(--primary)',
      iconBg: 'color-mix(in srgb, var(--primary) 10%, transparent)',
    },
  ]

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
      {cards.map((card, index) => (
        <Paper key={index} sx={{ p: 2, bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: card.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                {card.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                {card.label}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      ))}
    </Box>
  )
}
