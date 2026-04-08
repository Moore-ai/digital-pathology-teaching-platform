'use client'

import type { ReactNode } from 'react'
import { Box, Stack, Typography, Button, LinearProgress } from '@mui/material'
import {
  FileText,
  FileVideo,
  Presentation,
  Microscope,
  X,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Pencil,
} from 'lucide-react'
import { UploadFile, ResourceType } from '@/types/resource'
import { formatFileSize } from '@/lib/mock/resources'

interface UploadQueueItemProps {
  item: UploadFile
  onCancel?: () => void
  onRetry?: () => void
  onRemove?: () => void
  onEdit?: () => void
}

const fileTypeIcons: Record<ResourceType, ReactNode> = {
  pdf: <FileText className="w-5 h-5" style={{ color: 'var(--error)' }} />,
  ppt: <Presentation className="w-5 h-5" style={{ color: 'var(--warning)' }} />,
  video: <FileVideo className="w-5 h-5" style={{ color: '#8B5CF6' }} />,
  svs: <Microscope className="w-5 h-5" style={{ color: 'var(--secondary)' }} />,
}

const statusConfig = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    label: '等待中',
    color: 'var(--muted-foreground)',
    bgColor: 'color-mix(in srgb, var(--muted) 50%, transparent)',
  },
  uploading: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    label: '上传中',
    color: 'var(--secondary)',
    bgColor: 'color-mix(in srgb, var(--secondary) 5%, transparent)',
  },
  processing: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    label: '处理中',
    color: 'var(--warning)',
    bgColor: 'color-mix(in srgb, var(--warning) 5%, transparent)',
  },
  success: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: '完成',
    color: 'var(--success)',
    bgColor: 'color-mix(in srgb, var(--success) 5%, transparent)',
  },
  error: {
    icon: <AlertCircle className="w-4 h-4" />,
    label: '失败',
    color: 'var(--error)',
    bgColor: 'color-mix(in srgb, var(--error) 5%, transparent)',
  },
}

function getFileTypeFromName(fileName: string): ResourceType {
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'))
  if (ext === '.pdf') return 'pdf'
  if (['.ppt', '.pptx'].includes(ext)) return 'ppt'
  if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) return 'video'
  return 'svs'
}

export function UploadQueueItem({
  item,
  onCancel,
  onRetry,
  onRemove,
  onEdit,
}: UploadQueueItemProps): ReactNode {
  const status = statusConfig[item.status]
  const fileType = getFileTypeFromName(item.file.name)
  const fileSize = formatFileSize(item.file.size)

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      spacing={1.5}
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: '1px solid',
        borderColor: item.status === 'success'
          ? 'color-mix(in srgb, var(--success) 30%, transparent)'
          : item.status === 'error'
            ? 'color-mix(in srgb, var(--error) 30%, transparent)'
            : 'var(--border)',
        bgcolor: status.bgColor,
        transition: 'border-color 0.2s',
      }}
    >
      {/* 文件图标 */}
      <Box sx={{ flexShrink: 0, mt: 0.25 }}>
        {fileTypeIcons[fileType]}
      </Box>

      {/* 文件信息 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'var(--foreground)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.file.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', flexShrink: 0 }}>
            {fileSize}
          </Typography>
        </Stack>

        {/* 进度条 */}
        {(item.status === 'uploading' || item.status === 'processing') && (
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={item.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'var(--muted)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'var(--primary)',
                  borderRadius: 3,
                },
              }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                {item.progress}%
              </Typography>
              {item.speed && (
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                  {item.speed}
                </Typography>
              )}
              {item.remainingTime && (
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                  剩余 {item.remainingTime}
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* 状态信息 */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ color: status.color, display: 'flex' }}>
              {status.icon}
            </Box>
            <Typography variant="body2" sx={{ color: status.color }}>
              {item.status === 'uploading' && '上传中...'}
              {item.status === 'processing' && '处理中...'}
              {item.status === 'success' && '上传完成'}
              {item.status === 'error' && (item.errorMessage || '上传失败')}
              {item.status === 'pending' && '等待上传...'}
            </Typography>
          </Stack>

          {/* 操作按钮 */}
          <Stack direction="row" spacing={0.5}>
            {item.status === 'uploading' && onCancel && (
              <Button
                size="small"
                onClick={onCancel}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.25,
                  fontSize: '0.75rem',
                  color: 'var(--muted-foreground)',
                  '&:hover': { bgcolor: 'var(--muted)' },
                }}
              >
                取消
              </Button>
            )}
            {item.status === 'error' && onRetry && (
              <Button
                size="small"
                onClick={onRetry}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.25,
                  fontSize: '0.75rem',
                  color: 'var(--foreground)',
                  gap: 0.5,
                  '&:hover': { bgcolor: 'var(--muted)' },
                }}
              >
                <RotateCcw className="w-3 h-3" />
                重试
              </Button>
            )}
            {item.status === 'pending' && onRemove && (
              <Button
                size="small"
                onClick={onRemove}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.25,
                  fontSize: '0.75rem',
                  color: 'var(--foreground)',
                  gap: 0.5,
                  '&:hover': { bgcolor: 'var(--muted)' },
                }}
              >
                <X className="w-3 h-3" />
                移除
              </Button>
            )}
            {item.status === 'success' && onEdit && (
              <Button
                size="small"
                onClick={onEdit}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.25,
                  fontSize: '0.75rem',
                  color: 'var(--foreground)',
                  gap: 0.5,
                  '&:hover': { bgcolor: 'var(--muted)' },
                }}
              >
                <Pencil className="w-3 h-3" />
                编辑
              </Button>
            )}
            {item.status === 'error' && onRemove && (
              <Button
                size="small"
                onClick={onRemove}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.25,
                  fontSize: '0.75rem',
                  color: 'var(--foreground)',
                  gap: 0.5,
                  '&:hover': { bgcolor: 'var(--muted)' },
                }}
              >
                <X className="w-3 h-3" />
                移除
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}
