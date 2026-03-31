'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Resource } from '@/types/resource'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Microscope, ExternalLink } from 'lucide-react'

interface SliceViewerLinkProps {
  resource: Resource
  className?: string
}

export function SliceViewerLink({ resource, className }: SliceViewerLinkProps): ReactNode {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl p-8 sm:p-12',
        className
      )}
    >
      {/* 图标 */}
      <div className="w-32 h-32 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
        <Microscope className="w-16 h-16 text-secondary" />
      </div>

      {/* 说明 */}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {resource.title}
      </h3>
      <p className="text-muted-foreground text-center mb-4 max-w-md">
        SVS 病理切片需要在专业的切片浏览器中查看，支持高倍率放大、标注、测量等功能。
      </p>

      {/* 信息 */}
      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
        {resource.width && resource.height && (
          <Badge variant="secondary">
            {resource.width.toLocaleString()} × {resource.height.toLocaleString()} px
          </Badge>
        )}
        <Badge variant="secondary">SVS 切片</Badge>
      </div>

      {/* 跳转按钮 */}
      <Link href={`/slices/${resource.id}`}>
        <Button size="lg" className="gap-2">
          <ExternalLink className="w-5 h-5" />
          打开切片浏览器
        </Button>
      </Link>
    </div>
  )
}
