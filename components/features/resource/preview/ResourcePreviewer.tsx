'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Resource } from '@/types/resource'
import { VideoPlayer } from './VideoPlayer'
import { DocumentViewer } from './DocumentViewer'
import { SliceViewerLink } from './SliceViewerLink'

interface ResourcePreviewerProps {
  resource: Resource
  className?: string
}

export function ResourcePreviewer({ resource, className }: ResourcePreviewerProps): ReactNode {
  // 根据资源类型渲染不同的预览组件
  const renderPreview = (): ReactNode => {
    switch (resource.type) {
      case 'video':
        return <VideoPlayer resource={resource} />

      case 'pdf':
      case 'ppt':
        return <DocumentViewer resource={resource} />

      case 'svs':
        return <SliceViewerLink resource={resource} />

      default:
        return (
          <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">不支持的文件类型</p>
          </div>
        )
    }
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {renderPreview()}
    </div>
  )
}
