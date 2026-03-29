'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Slice } from '@/types/slice'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Eye,
  Maximize2,
  Tag,
  Calendar,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SliceCardProps {
  className?: string
  slice: Slice
}

export function SliceCard({ className, slice }: SliceCardProps): ReactNode {
  const categoryColors: Record<string, string> = {
    digestive: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    respiratory: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    breast: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    endocrine: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    urinary: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    nervous: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    cardiovascular: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200',
    reproductive: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  }

  const categoryLabels: Record<string, string> = {
    digestive: '消化系统',
    respiratory: '呼吸系统',
    breast: '乳腺',
    endocrine: '内分泌',
    urinary: '泌尿系统',
    nervous: '神经系统',
    cardiovascular: '心血管',
    reproductive: '生殖系统',
    other: '其他',
  }

  return (
    <Card className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
      {/* 缩略图区域 */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {/* 模拟切片缩略图 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* 模拟病理切片纹理 */}
            <div className="absolute inset-0 opacity-60">
              <div className="absolute top-1/4 left-1/4 w-32 h-24 rounded-full bg-pink-200/40 blur-sm" />
              <div className="absolute top-1/2 right-1/3 w-24 h-20 rounded-full bg-purple-200/30 blur-sm" />
              <div className="absolute bottom-1/3 left-1/2 w-28 h-28 rounded-full bg-rose-200/35 blur-sm" />
              <div className="absolute top-1/3 right-1/4 w-20 h-16 rounded-full bg-amber-200/30 blur-sm" />
            </div>
            {/* 玻片边框效果 */}
            <div className="absolute inset-4 border-2 border-slate-300/50 dark:border-slate-600/50 rounded-lg" />
          </div>
        </div>

        {/* 放大倍数标签 */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
            <Maximize2 className="w-3 h-3 mr-1" />
            {slice.magnification}x
          </Badge>
        </div>

        {/* 分类标签 */}
        <div className="absolute top-3 left-3">
          <Badge className={cn("text-xs", categoryColors[slice.category] || categoryColors.other)}>
            {categoryLabels[slice.category] || '其他'}
          </Badge>
        </div>

        {/* 悬停操作 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link href={`/slices/${slice.id}`}>
            <Button size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              查看切片
            </Button>
          </Link>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{slice.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {slice.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5">
          {slice.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {slice.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{slice.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(slice.uploadedAt)}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span>{(slice.width / 1000).toFixed(0)}K × {(slice.height / 1000).toFixed(0)}K</span>
        </div>
      </CardFooter>
    </Card>
  )
}
