'use client'

import type { ReactNode } from 'react'
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material'
import { SliceUploadItem as SliceUploadItemType, SliceUploadStatus } from '@/types/slice'
import {
  Microscope,
  Pause,
  Play,
  X,
  RotateCcw,
  Edit3,
  Eye,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  Clock,
  Zap,
} from 'lucide-react'

interface SliceUploadItemProps {
  item: SliceUploadItemType
  onEdit: () => void
  onPause: () => void
  onResume: () => void
  onCancel: () => void
  onRetry: () => void
  onRemove: () => void
  onPreview?: () => void
}

const statusConfig: Record<SliceUploadStatus, {
  label: string
  icon: ReactNode
  color: string
  bgColor: string
}> = {
  pending: {
    label: '待上传',
    icon: <Clock className="w-4 h-4" />,
    color: 'var(--muted-foreground)',
    bgColor: 'var(--muted)',
  },
  uploading: {
    label: '上传中',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    color: 'var(--primary)',
    bgColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
  },
  paused: {
    label: '已暂停',
    icon: <Pause className="w-4 h-4" />,
    color: 'var(--warning)',
    bgColor: 'color-mix(in srgb, var(--warning) 10%, transparent)',
  },
  processing: {
    label: '处理中',
    icon: <Settings className="w-4 h-4 animate-spin" />,
    color: 'var(--info)',
    bgColor: 'color-mix(in srgb, var(--info) 10%, transparent)',
  },
  success: {
    label: '完成',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'var(--success)',
    bgColor: 'color-mix(in srgb, var(--success) 10%, transparent)',
  },
  error: {
    label: '失败',
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'var(--error)',
    bgColor: 'color-mix(in srgb, var(--error) 10%, transparent)',
  },
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}秒`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟`
  return `${Math.floor(seconds / 3600)}小时${Math.floor((seconds % 3600) / 60)}分钟`
}

export function SliceUploadItem({
  item,
  onEdit,
  onPause,
  onResume,
  onRetry,
  onRemove,
  onPreview,
}: SliceUploadItemProps): ReactNode {
  const status = statusConfig[item.status]
  const progress = item.progress

  const renderActions = () => {
    switch (item.status) {
      case 'pending':
        return (
          <>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onEdit}>
              <Edit3 className="w-4 h-4" style={{ marginRight: 4 }} />
              编辑
            </Button>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onRemove}>
              <X className="w-4 h-4" style={{ marginRight: 4 }} />
              移除
            </Button>
          </>
        )

      case 'uploading':
        return (
          <>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onEdit}>
              <Edit3 className="w-4 h-4" style={{ marginRight: 4 }} />
              编辑
            </Button>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onPause}>
              <Pause className="w-4 h-4" style={{ marginRight: 4 }} />
              暂停
            </Button>
          </>
        )

      case 'paused':
        return (
          <>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onEdit}>
              <Edit3 className="w-4 h-4" style={{ marginRight: 4 }} />
              编辑
            </Button>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onResume}>
              <Play className="w-4 h-4" style={{ marginRight: 4 }} />
              继续
            </Button>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onRemove}>
              <X className="w-4 h-4" style={{ marginRight: 4 }} />
              移除
            </Button>
          </>
        )

      case 'processing':
        return (
          <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onEdit}>
            <Edit3 className="w-4 h-4" style={{ marginRight: 4 }} />
            编辑
          </Button>
        )

      case 'success':
        return (
          <>
            {onPreview && (
              <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onPreview}>
                <Eye className="w-4 h-4" style={{ marginRight: 4 }} />
                预览
              </Button>
            )}
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onEdit}>
              <Edit3 className="w-4 h-4" style={{ marginRight: 4 }} />
              编辑
            </Button>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onRemove}>
              <X className="w-4 h-4" style={{ marginRight: 4 }} />
              移除
            </Button>
          </>
        )

      case 'error':
        return (
          <>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onRetry}>
              <RotateCcw className="w-4 h-4" style={{ marginRight: 4 }} />
              重试
            </Button>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onEdit}>
              <Edit3 className="w-4 h-4" style={{ marginRight: 4 }} />
              编辑
            </Button>
            <Button size="small" sx={{ color: 'var(--muted-foreground)', '&:hover': { bgcolor: 'var(--muted)' } }} onClick={onRemove}>
              <X className="w-4 h-4" style={{ marginRight: 4 }} />
              移除
            </Button>
          </>
        )

      default:
        return null
    }
  }

  // 获取边框颜色
  const getBorderColor = () => {
    if (item.status === 'success') return 'color-mix(in srgb, var(--success) 30%, transparent)'
    if (item.status === 'error') return 'color-mix(in srgb, var(--error) 30%, transparent)'
    return 'var(--border)'
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2,
        borderRadius: 1,
        border: '1px solid',
        borderColor: getBorderColor(),
        bgcolor: 'var(--card)',
        transition: 'all 0.2s',
      }}
    >
      {/* 缩略图/图标 */}
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          bgcolor: status.bgColor,
        }}
      >
        {item.thumbnailUrl ? (
          <Box
            component="img"
            src={item.thumbnailUrl}
            alt={item.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }}
          />
        ) : (
          <Microscope className="w-8 h-8" style={{ color: status.color }} />
        )}
      </Box>

      {/* 信息区 */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* 标题行 */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Typography
            sx={{
              fontWeight: 500,
              color: 'var(--foreground)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {item.title}
          </Typography>
          <Chip
            size="small"
            label={
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {status.icon}
                <span>{status.label}</span>
              </Stack>
            }
            sx={{
              height: 24,
              fontSize: '0.75rem',
              bgcolor: status.bgColor,
              '& .MuiChip-label': { color: status.color, display: 'flex', alignItems: 'center', gap: 0.5 },
            }}
          />
        </Stack>

        {/* 文件名 */}
        <Typography
          variant="body2"
          sx={{
            color: 'var(--muted-foreground)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1,
          }}
        >
          {item.file.name}
        </Typography>

        {/* 进度条 */}
        {(item.status === 'uploading' || item.status === 'paused') && (
          <Box sx={{ mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress.percent}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: 'var(--muted)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: item.status === 'paused' ? 'var(--warning)' : 'var(--primary)',
                  borderRadius: 1,
                },
              }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                {progress.percent}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                {formatBytes(progress.uploadedBytes)} / {formatBytes(progress.totalBytes)}
              </Typography>
            </Stack>
          </Box>
        )}

        {/* 处理中状态 */}
        {item.status === 'processing' && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'var(--info)' }}>
            <Settings className="w-4 h-4 animate-spin" />
            <Typography variant="body2" sx={{ color: 'var(--info)' }}>
              正在处理切片数据...
            </Typography>
          </Stack>
        )}

        {/* 上传速度和剩余时间 */}
        {item.status === 'uploading' && progress.speed && progress.remainingTime && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Zap className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                {progress.speed.toFixed(1)} MB/s
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Clock className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                剩余 {formatTime(progress.remainingTime)}
              </Typography>
            </Stack>
          </Stack>
        )}

        {/* 元数据 */}
        {item.metadata && item.status === 'success' && (
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              {item.metadata.magnification}x
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>·</Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              {(item.metadata.width / 1000).toFixed(0)}K × {(item.metadata.height / 1000).toFixed(0)}K
            </Typography>
          </Stack>
        )}

        {/* 错误信息 */}
        {item.status === 'error' && item.error && (
          <Typography variant="body2" sx={{ color: 'var(--error)', mt: 0.5 }}>
            {item.error}
          </Typography>
        )}
      </Box>

      {/* 操作按钮 */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
        {renderActions()}
      </Stack>
    </Box>
  )
}
