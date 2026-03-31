'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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
  pdf: <FileText className="w-5 h-5 text-error" />,
  ppt: <Presentation className="w-5 h-5 text-warning" />,
  video: <FileVideo className="w-5 h-5 text-purple-500" />,
  svs: <Microscope className="w-5 h-5 text-secondary" />,
}

const statusConfig = {
  pending: {
    icon: <Clock className="w-4 h-4" />,
    label: '等待中',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
  },
  uploading: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    label: '上传中',
    color: 'text-secondary',
    bgColor: 'bg-secondary/5',
  },
  processing: {
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    label: '处理中',
    color: 'text-warning',
    bgColor: 'bg-warning/5',
  },
  success: {
    icon: <CheckCircle className="w-4 h-4" />,
    label: '完成',
    color: 'text-success',
    bgColor: 'bg-success/5',
  },
  error: {
    icon: <AlertCircle className="w-4 h-4" />,
    label: '失败',
    color: 'text-error',
    bgColor: 'bg-error/5',
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
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg border transition-colors',
      status.bgColor,
      item.status === 'success' && 'border-success/30',
      item.status === 'error' && 'border-error/30',
    )}>
      {/* 文件图标 */}
      <div className="shrink-0 mt-0.5">
        {fileTypeIcons[fileType]}
      </div>

      {/* 文件信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-medium text-foreground truncate">
            {item.file.name}
          </span>
          <span className="text-sm text-muted-foreground shrink-0">
            {fileSize}
          </span>
        </div>

        {/* 进度条 */}
        {(item.status === 'uploading' || item.status === 'processing') && (
          <div className="space-y-1 mb-2">
            <Progress value={item.progress} className="h-1.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.progress}%</span>
              {item.speed && <span>{item.speed}</span>}
              {item.remainingTime && <span>剩余 {item.remainingTime}</span>}
            </div>
          </div>
        )}

        {/* 状态信息 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm">
            <span className={status.color}>{status.icon}</span>
            <span className={cn('text-sm', status.color)}>
              {item.status === 'uploading' && '上传中...'}
              {item.status === 'processing' && '处理中...'}
              {item.status === 'success' && '上传完成'}
              {item.status === 'error' && (item.errorMessage || '上传失败')}
              {item.status === 'pending' && '等待上传...'}
            </span>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-1">
            {item.status === 'uploading' && onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 px-2 text-xs">
                取消
              </Button>
            )}
            {item.status === 'error' && onRetry && (
              <Button variant="ghost" size="sm" onClick={onRetry} className="h-7 px-2 text-xs gap-1">
                <RotateCcw className="w-3 h-3" />
                重试
              </Button>
            )}
            {item.status === 'pending' && onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 px-2 text-xs gap-1">
                <X className="w-3 h-3" />
                移除
              </Button>
            )}
            {item.status === 'success' && onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-7 px-2 text-xs gap-1">
                <Pencil className="w-3 h-3" />
                编辑
              </Button>
            )}
            {item.status === 'error' && onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove} className="h-7 px-2 text-xs gap-1">
                <X className="w-3 h-3" />
                移除
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
