'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Search,
  FolderOpen,
  FileQuestion,
  Inbox,
  AlertCircle,
} from 'lucide-react'

interface EmptyStateProps {
  className?: string
  type?: 'default' | 'search' | 'folder' | 'error' | 'inbox'
  title?: string
  description?: string
  icon?: typeof FileText
  action?: {
    label: string
    onClick: () => void
  }
}

const typeConfig = {
  default: {
    icon: FileQuestion,
    title: '暂无数据',
    description: '这里还没有任何内容',
  },
  search: {
    icon: Search,
    title: '未找到结果',
    description: '尝试调整搜索条件或筛选选项',
  },
  folder: {
    icon: FolderOpen,
    title: '文件夹为空',
    description: '这里还没有任何文件',
  },
  error: {
    icon: AlertCircle,
    title: '加载失败',
    description: '数据加载出错，请稍后重试',
  },
  inbox: {
    icon: Inbox,
    title: '收件箱为空',
    description: '没有新消息',
  },
}

export function EmptyState({
  className,
  type = 'default',
  title,
  description,
  icon,
  action,
}: EmptyStateProps): ReactNode {
  const config = typeConfig[type]
  const Icon = icon || config.icon

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 text-center",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">
        {title || config.title}
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        {description || config.description}
      </p>
      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
