'use client'

import type { ReactNode } from 'react'
import { UploadFile } from '@/types/resource'
import { UploadQueueItem } from './UploadQueueItem'
import {
  Box,
  Stack,
  Typography,
  Button,
  Chip,
} from '@mui/material'

interface UploadQueueListProps {
  items: UploadFile[]
  onCancel?: (id: string) => void
  onRetry?: (id: string) => void
  onRemove?: (id: string) => void
  onEdit?: (id: string) => void
  onClearAll?: () => void
  onUploadAll?: () => void
  className?: string
}

export function UploadQueueList({
  items,
  onCancel,
  onRetry,
  onRemove,
  onEdit,
  onClearAll,
  onUploadAll,
  className,
}: UploadQueueListProps): ReactNode {
  if (items.length === 0) return null

  const uploadingCount = items.filter(i => i.status === 'uploading' || i.status === 'processing').length
  const successCount = items.filter(i => i.status === 'success').length
  const errorCount = items.filter(i => i.status === 'error').length
  const pendingCount = items.filter(i => i.status === 'pending').length

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} className={className}>
      {/* 标题和统计 */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
            上传队列 ({items.length} 个文件)
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            {uploadingCount > 0 && (
              <Chip
                size="small"
                label={`${uploadingCount} 个上传中`}
                sx={{
                  height: 20,
                  fontSize: '0.625rem',
                  bgcolor: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
                  '& .MuiChip-label': { color: 'var(--secondary)' },
                }}
              />
            )}
            {successCount > 0 && (
              <Chip
                size="small"
                label={`${successCount} 个完成`}
                sx={{
                  height: 20,
                  fontSize: '0.625rem',
                  bgcolor: 'color-mix(in srgb, var(--success) 10%, transparent)',
                  '& .MuiChip-label': { color: 'var(--success)' },
                }}
              />
            )}
            {errorCount > 0 && (
              <Chip
                size="small"
                label={`${errorCount} 个失败`}
                sx={{
                  height: 20,
                  fontSize: '0.625rem',
                  bgcolor: 'color-mix(in srgb, var(--error) 10%, transparent)',
                  '& .MuiChip-label': { color: 'var(--error)' },
                }}
              />
            )}
            {pendingCount > 0 && (
              <Chip
                size="small"
                label={`${pendingCount} 个等待中`}
                sx={{
                  height: 20,
                  fontSize: '0.625rem',
                  bgcolor: 'var(--muted)',
                  '& .MuiChip-label': { color: 'var(--muted-foreground)' },
                }}
              />
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* 队列列表 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map(item => (
          <UploadQueueItem
            key={item.id}
            item={item}
            onCancel={() => onCancel?.(item.id)}
            onRetry={() => onRetry?.(item.id)}
            onRemove={() => onRemove?.(item.id)}
            onEdit={() => onEdit?.(item.id)}
          />
        ))}
      </Box>

      {/* 操作按钮 */}
      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ pt: 1 }}>
        {items.some(i => i.status === 'pending') && onUploadAll && (
          <Button
            variant="contained"
            onClick={onUploadAll}
            sx={{ bgcolor: 'var(--primary)', '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 } }}
          >
            全部上传
          </Button>
        )}
        {items.length > 0 && onClearAll && (
          <Button
            variant="outlined"
            onClick={onClearAll}
            sx={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
            }}
          >
            清空队列
          </Button>
        )}
      </Stack>
    </Box>
  )
}
