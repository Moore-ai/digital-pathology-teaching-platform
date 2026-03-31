'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { UploadFile } from '@/types/resource'
import { UploadQueueItem } from './UploadQueueItem'

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
    <div className={cn('space-y-4', className)}>
      {/* 标题和统计 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">
            上传队列 ({items.length} 个文件)
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {uploadingCount > 0 && (
              <span className="text-secondary">{uploadingCount} 个上传中</span>
            )}
            {successCount > 0 && (
              <span className="text-success">{successCount} 个完成</span>
            )}
            {errorCount > 0 && (
              <span className="text-error">{errorCount} 个失败</span>
            )}
            {pendingCount > 0 && (
              <span>{pendingCount} 个等待中</span>
            )}
          </div>
        </div>
      </div>

      {/* 队列列表 */}
      <div className="space-y-2">
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
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {items.some(i => i.status === 'pending') && onUploadAll && (
          <Button onClick={onUploadAll}>
            全部上传
          </Button>
        )}
        {items.length > 0 && onClearAll && (
          <Button variant="outline" onClick={onClearAll}>
            清空队列
          </Button>
        )}
      </div>
    </div>
  )
}
