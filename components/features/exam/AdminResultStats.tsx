'use client'

import type { ReactNode } from 'react'
import { Paper, Box, Typography, Stack } from '@mui/material'
import { Users, GraduationCap, FileText, TrendingUp } from 'lucide-react'

interface AdminResultStatsProps {
  totalClasses: number
  totalStudents: number
  totalExams: number
  overallAverage: number
  overallPassRate: number
}

export function AdminResultStats({
  totalClasses,
  totalStudents,
  totalExams,
  overallAverage,
}: AdminResultStatsProps): ReactNode {
  const cards = [
    {
      icon: GraduationCap,
      label: '班级数量',
      value: totalClasses,
      iconColor: 'var(--primary)',
      iconBg: 'color-mix(in srgb, var(--primary) 10%, transparent)',
    },
    {
      icon: Users,
      label: '学生总数',
      value: totalStudents,
      iconColor: 'var(--secondary)',
      iconBg: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
    },
    {
      icon: FileText,
      label: '考试场次',
      value: totalExams,
      iconColor: 'var(--info)',
      iconBg: 'color-mix(in srgb, var(--info) 10%, transparent)',
    },
    {
      icon: TrendingUp,
      label: '整体平均分',
      value: overallAverage.toFixed(1),
      iconColor: 'var(--success)',
      iconBg: 'color-mix(in srgb, var(--success) 10%, transparent)',
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
