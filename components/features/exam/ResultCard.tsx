'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Paper, Box, Typography, Stack, Chip, Divider } from '@mui/material'
import type { ExamResult, ScoreLevel } from '@/lib/mock/results'
import { scoreLevelConfig } from '@/lib/mock/results'
import { Button } from '@/components/ui/button'
import { Clock, Users, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ResultCardProps {
  className?: string
  result: ExamResult
  showRank?: boolean
}

// 获取状态条颜色
function getStatusBarColor(level: ScoreLevel): string {
  const config = scoreLevelConfig[level]
  // 将 Tailwind 类转换为 CSS 变量
  switch (level) {
    case 'excellent':
      return 'var(--success)'
    case 'good':
      return 'var(--secondary)'
    case 'pass':
      return 'var(--warning)'
    case 'fail':
      return 'var(--error)'
    default:
      return 'var(--muted-foreground)'
  }
}

export function ResultCard({ className, result, showRank = true }: ResultCardProps): ReactNode {
  const levelConfig = scoreLevelConfig[result.level]
  const statusBarColor = getStatusBarColor(result.level)

  // 获取等级标签颜色
  const getLevelColor = (level: ScoreLevel): { bg: string; text: string } => {
    switch (level) {
      case 'excellent':
        return { bg: 'color-mix(in srgb, var(--success) 10%, transparent)', text: 'var(--success)' }
      case 'good':
        return { bg: 'color-mix(in srgb, var(--secondary) 10%, transparent)', text: 'var(--secondary)' }
      case 'pass':
        return { bg: 'color-mix(in srgb, var(--warning) 10%, transparent)', text: 'var(--warning)' }
      case 'fail':
        return { bg: 'color-mix(in srgb, var(--error) 10%, transparent)', text: 'var(--error)' }
      default:
        return { bg: 'var(--muted)', text: 'var(--muted-foreground)' }
    }
  }

  const levelColors = getLevelColor(result.level)

  return (
    <Paper
      className={className}
      sx={{
        position: 'relative',
        overflow: 'hidden',
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
      {/* 成绩状态条 */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          bgcolor: statusBarColor,
        }}
      />

      <Box sx={{ p: 2, pl: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 标题行 */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
          <Link href={`/exams/${result.examId}/result`} style={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: 'var(--foreground)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '&:hover': { color: 'var(--secondary)' },
                transition: 'color 0.2s',
              }}
            >
              {result.examTitle}
            </Typography>
          </Link>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              size="small"
              label={levelConfig.label}
              sx={{
                height: 24,
                bgcolor: levelColors.bg,
                color: levelColors.text,
                '& .MuiChip-label': { color: levelColors.text },
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
              {result.score}
            </Typography>
          </Stack>
        </Stack>

        {/* 考试信息 */}
        <Typography
          variant="body2"
          sx={{
            color: 'var(--muted-foreground)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1.5,
          }}
        >
          {result.examDescription || result.category}
        </Typography>

        {/* 统计信息 */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', mt: 'auto' }}
        >
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
            {result.category}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>·</Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
            {formatDate(result.submittedAt)}
          </Typography>
          {showRank && (
            <>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>·</Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Users className="w-3.5 h-3.5" style={{ color: 'var(--muted-foreground)' }} />
                <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                  排名 {result.rank}/{result.totalStudents}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>

        {/* 详细数据 */}
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--success)' }}>
              {result.correctCount}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              正确
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--error)' }}>
              {result.wrongCount}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              错误
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
              <Clock className="w-3.5 h-3.5" style={{ color: 'var(--muted-foreground)' }} />
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                {result.timeSpent}
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              分钟
            </Typography>
          </Box>
        </Box>

        {/* 操作按钮 */}
        <Box
          sx={{
            mt: 1.5,
            opacity: 0,
            transition: 'opacity 0.2s',
            '.MuiPaper-root:hover &': { opacity: 1 },
          }}
        >
          <Link href={`/exams/${result.examId}/result`} style={{ display: 'block' }}>
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Eye className="w-4 h-4" />
              查看详情
            </Button>
          </Link>
        </Box>
      </Box>
    </Paper>
  )
}
