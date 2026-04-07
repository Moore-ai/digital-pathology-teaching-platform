'use client'

import type { ReactNode } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { Button } from '@/components/ui/button'
import { FileBarChart } from 'lucide-react'
import Link from 'next/link'

interface EmptyResultsProps {
  className?: string
}

export function EmptyResults({ className }: EmptyResultsProps): ReactNode {
  return (
    <Stack
      className={className}
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ py: 8, textAlign: 'center' }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FileBarChart className="w-10 h-10" style={{ color: 'var(--muted-foreground)' }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
        暂无成绩记录
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
        完成考试后可在此查看成绩
      </Typography>
      <Link href="/exams">
        <Button variant="outline">
          前往考试中心
        </Button>
      </Link>
    </Stack>
  )
}
