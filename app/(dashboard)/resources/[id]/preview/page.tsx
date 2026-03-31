'use client'

import type { ReactNode } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { ResourcePreviewer } from '@/components/features/resource/preview'
import { useResourceStore } from '@/stores/resourceStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Calendar, File, Download, Globe, Lock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { formatFileSize } from '@/lib/mock/resources'
import { categoryLabels } from '@/types/resource'

interface PreviewPageProps {
  params: Promise<{ id: string }>
}

export default function ResourcePreviewPage({ params }: PreviewPageProps): ReactNode {
  const { id } = use(params)
  const { getResourceById } = useResourceStore()

  const resource = getResourceById(id)

  if (!resource) {
    notFound()
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/resources" className="hover:text-foreground transition-colors">
          病例资料
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground truncate">{resource.title}</span>
      </nav>

      {/* 标题区域 */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{resource.type.toUpperCase()}</Badge>
            <Badge variant="outline">{categoryLabels[resource.category]}</Badge>
            {resource.isPublic ? (
              <span className="flex items-center gap-1 text-xs text-success">
                <Globe className="w-3 h-3" />
                公开
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-warning">
                <Lock className="w-3 h-3" />
                私密
              </span>
            )}
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            {resource.title}
          </h1>
          {resource.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {resource.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/resources">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
          </Link>
          {resource.allowDownload && (
            <Button size="sm" className="gap-1.5">
              <Download className="w-4 h-4" />
              下载
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* 预览区域 */}
      <ResourcePreviewer resource={resource} className="min-h-100" />

      {/* 元信息 */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          上传于 {formatDate(resource.uploadedAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <File className="w-4 h-4" />
          {formatFileSize(resource.fileSize)}
        </span>
        <span className="flex items-center gap-1.5">
          文件名: <span className="text-foreground">{resource.fileName}</span>
        </span>
      </div>
    </PageWrapper>
  )
}
