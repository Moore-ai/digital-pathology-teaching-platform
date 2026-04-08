'use client'

import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FileText,
  FileVideo,
  Presentation,
  Microscope,
  Download,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  File,
  Globe,
  Lock,
} from 'lucide-react'
import { Resource, ResourceType, categoryLabels } from '@/types/resource'
import { formatFileSize, formatDuration } from '@/lib/mock/resources'
import { formatDate } from '@/lib/utils'

interface ResourceCardProps {
  resource: Resource
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onDownload?: () => void
  className?: string
}

const fileTypeIcons: Record<ResourceType, ReactNode> = {
  pdf: <FileText className="w-8 h-8 text-error" />,
  ppt: <Presentation className="w-8 h-8 text-warning" />,
  video: <FileVideo className="w-8 h-8 text-purple-500" />,
  svs: <Microscope className="w-8 h-8 text-secondary" />,
}

const fileTypeLabels: Record<ResourceType, string> = {
  pdf: 'PDF',
  ppt: 'PPT',
  video: '视频',
  svs: '切片',
}

// 使用 CSS 变量确保深浅色模式正确显示
const categoryStyles: Record<string, React.CSSProperties> = {
  digestive: { backgroundColor: 'color-mix(in srgb, #F59E0B 15%, transparent)', color: '#F59E0B' },
  respiratory: { backgroundColor: 'color-mix(in srgb, #0EA5E9 15%, transparent)', color: '#0EA5E9' },
  breast: { backgroundColor: 'color-mix(in srgb, #EC4899 15%, transparent)', color: '#EC4899' },
  endocrine: { backgroundColor: 'color-mix(in srgb, #8B5CF6 15%, transparent)', color: '#8B5CF6' },
  urinary: { backgroundColor: 'color-mix(in srgb, #10B981 15%, transparent)', color: '#10B981' },
  nervous: { backgroundColor: 'color-mix(in srgb, #6366F1 15%, transparent)', color: '#6366F1' },
  cardiovascular: { backgroundColor: 'color-mix(in srgb, #F43F5E 15%, transparent)', color: '#F43F5E' },
  reproductive: { backgroundColor: 'color-mix(in srgb, #D946EF 15%, transparent)', color: '#D946EF' },
  other: { backgroundColor: 'var(--muted)', color: 'var(--foreground)' },
}

export function ResourceCard({
  resource,
  onView,
  onEdit,
  onDelete,
  onDownload,
  className,
}: ResourceCardProps): ReactNode {
  // 是否可以下载
  const canDownload = resource.allowDownload && onDownload
  // 是否有操作按钮
  const hasActions = onEdit || onDelete

  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col ${className || ''}`}>
      {/* 缩略图区域 */}
      <div className="relative aspect-4/3 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden shrink-0">
        {/* 文件类型图标居中 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${
            resource.type === 'pdf' ? 'bg-error/10' :
            resource.type === 'ppt' ? 'bg-warning/10' :
            resource.type === 'video' ? 'bg-purple-500/10' :
            'bg-secondary/10'
          }`}>
            {fileTypeIcons[resource.type]}
          </div>
        </div>

        {/* 文件类型标签 */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs">
            {fileTypeLabels[resource.type]}
          </Badge>
        </div>

        {/* 分类标签 */}
        <div className="absolute top-3 right-3">
          <span
            className="inline-flex h-5 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium"
            style={categoryStyles[resource.category] || categoryStyles.other}
          >
            {categoryLabels[resource.category]}
          </span>
        </div>

        {/* 视频时长 */}
        {resource.type === 'video' && resource.duration && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-black/60 text-white border-0 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(resource.duration)}
            </Badge>
          </div>
        )}

        {/* 悬停操作 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          {onView && (
            <Button size="sm" variant="secondary" onClick={onView} className="gap-1">
              <Eye className="w-4 h-4" />
              查看
            </Button>
          )}
          {canDownload && (
            <Button size="sm" variant="secondary" onClick={onDownload} className="gap-1">
              <Download className="w-4 h-4" />
              下载
            </Button>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base line-clamp-1">{resource.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {resource.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-2 flex-1">
          {/* 标签 */}
          <div className="flex flex-wrap gap-1">
            {resource.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {resource.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(resource.uploadedAt)}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            {/* 公开/私密状态 */}
            {resource.isPublic ? (
              <span className="flex items-center gap-0.5 text-success" title="公开资料">
                <Globe className="w-3 h-3" />
                <span className="hidden sm:inline">公开</span>
              </span>
            ) : (
              <span className="flex items-center gap-0.5 text-warning" title="私密资料">
                <Lock className="w-3 h-3" />
                <span className="hidden sm:inline">私密</span>
              </span>
            )}
            {/* 文件大小 */}
            <span className="flex items-center gap-0.5">
              <File className="w-3 h-3" />
              {formatFileSize(resource.fileSize)}
            </span>
            {/* 允许下载 */}
            {resource.allowDownload && (
              <span className="flex items-center gap-0.5 text-secondary" title="允许下载">
                <Download className="w-3 h-3" />
              </span>
            )}
          </div>
        </CardFooter>
      </div>

      {/* 操作按钮（非悬停状态） */}
      {hasActions && (
        <div className="border-t p-2 flex items-center justify-end gap-1 shrink-0">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 px-2 text-xs">
              <Pencil className="w-3 h-3 mr-1" />
              编辑
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 px-2 text-xs text-error hover:text-error">
              <Trash2 className="w-3 h-3 mr-1" />
              删除
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
