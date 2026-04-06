'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { SliceUploadItem as SliceUploadItemType, SliceUploadStatus } from '@/types/slice'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  uploading: {
    label: '上传中',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  paused: {
    label: '已暂停',
    icon: <Pause className="w-4 h-4" />,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  processing: {
    label: '处理中',
    icon: <Settings className="w-4 h-4 animate-spin" />,
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  success: {
    label: '完成',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  error: {
    label: '失败',
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-error',
    bgColor: 'bg-error/10',
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
  onCancel,
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
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              编辑
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="w-4 h-4 mr-1" />
              移除
            </Button>
          </>
        )

      case 'uploading':
        return (
          <>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              编辑
            </Button>
            <Button variant="ghost" size="sm" onClick={onPause}>
              <Pause className="w-4 h-4 mr-1" />
              暂停
            </Button>
          </>
        )

      case 'paused':
        return (
          <>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              编辑
            </Button>
            <Button variant="ghost" size="sm" onClick={onResume}>
              <Play className="w-4 h-4 mr-1" />
              继续
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="w-4 h-4 mr-1" />
              移除
            </Button>
          </>
        )

      case 'processing':
        return (
          <>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              编辑
            </Button>
          </>
        )

      case 'success':
        return (
          <>
            {onPreview && (
              <Button variant="ghost" size="sm" onClick={onPreview}>
                <Eye className="w-4 h-4 mr-1" />
                预览
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              编辑
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="w-4 h-4 mr-1" />
              移除
            </Button>
          </>
        )

      case 'error':
        return (
          <>
            <Button variant="ghost" size="sm" onClick={onRetry}>
              <RotateCcw className="w-4 h-4 mr-1" />
              重试
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit3 className="w-4 h-4 mr-1" />
              编辑
            </Button>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="w-4 h-4 mr-1" />
              移除
            </Button>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn(
      'flex items-start gap-4 p-4 rounded-lg border',
      'bg-background transition-all duration-200',
      item.status === 'success' && 'border-success/30',
      item.status === 'error' && 'border-error/30',
    )}>
      {/* 缩略图/图标 */}
      <div className={cn(
        'w-20 h-20 rounded-lg flex items-center justify-center shrink-0',
        status.bgColor
      )}>
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <Microscope className={cn('w-8 h-8', status.color)} />
        )}
      </div>

      {/* 信息区 */}
      <div className="flex-1 min-w-0">
        {/* 标题行 */}
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-foreground truncate flex-1">
            {item.title}
          </h4>
          <Badge variant="outline" className={cn('text-xs', status.color)}>
            {status.icon}
            <span className="ml-1">{status.label}</span>
          </Badge>
        </div>

        {/* 文件名 */}
        <p className="text-sm text-muted-foreground truncate mb-2">
          {item.file.name}
        </p>

        {/* 进度条 */}
        {(item.status === 'uploading' || item.status === 'paused') && (
          <div className="mb-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  item.status === 'paused' ? 'bg-warning' : 'bg-primary'
                )}
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
              <span>{progress.percent}%</span>
              <span>
                {formatBytes(progress.uploadedBytes)} / {formatBytes(progress.totalBytes)}
              </span>
            </div>
          </div>
        )}

        {/* 处理中状态 */}
        {item.status === 'processing' && (
          <div className="flex items-center gap-2 text-sm text-info">
            <Settings className="w-4 h-4 animate-spin" />
            <span>正在处理切片数据...</span>
          </div>
        )}

        {/* 上传速度和剩余时间 */}
        {item.status === 'uploading' && progress.speed && progress.remainingTime && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>{progress.speed.toFixed(1)} MB/s</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>剩余 {formatTime(progress.remainingTime)}</span>
            </div>
          </div>
        )}

        {/* 元数据 */}
        {item.metadata && item.status === 'success' && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span>{item.metadata.magnification}x</span>
            <span>·</span>
            <span>{(item.metadata.width / 1000).toFixed(0)}K × {(item.metadata.height / 1000).toFixed(0)}K</span>
          </div>
        )}

        {/* 错误信息 */}
        {item.status === 'error' && item.error && (
          <p className="text-sm text-error mt-1">{item.error}</p>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-1 shrink-0">
        {renderActions()}
      </div>
    </div>
  )
}
