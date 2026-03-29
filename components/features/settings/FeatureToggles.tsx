'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

interface Feature {
  id: string
  name: string
  description: string
  enabled: boolean
  category: 'content' | 'interaction' | 'ai'
}

interface FeatureTogglesProps {
  className?: string
  features?: Feature[]
  onToggle?: (id: string, enabled: boolean) => void
}

const defaultFeatures: Feature[] = [
  // 内容管理
  { id: 'slice_upload', name: '切片上传', description: '允许用户上传 SVS 切片文件', enabled: true, category: 'content' },
  { id: 'video_upload', name: '视频上传', description: '允许教师上传教学视频', enabled: true, category: 'content' },
  { id: 'pdf_upload', name: 'PDF上传', description: '允许上传 PDF 文档资料', enabled: true, category: 'content' },
  // 互动功能
  { id: 'discussion', name: '讨论功能', description: '开启讨论区功能', enabled: true, category: 'interaction' },
  { id: 'annotation', name: '切片标注', description: '允许在切片上添加标注', enabled: true, category: 'interaction' },
  { id: 'annotation_share', name: '标注分享', description: '允许分享标注给其他用户', enabled: false, category: 'interaction' },
  // AI功能
  { id: 'rag_analysis', name: 'RAG分析', description: '开启智能分析助手功能', enabled: true, category: 'ai' },
  { id: 'smart_paper', name: '智能组卷', description: '启用 AI 智能组卷功能', enabled: false, category: 'ai' },
  { id: 'auto_grading', name: '自动批改', description: '启用客观题自动批改', enabled: true, category: 'ai' },
]

const categoryLabels = {
  content: '内容管理',
  interaction: '互动功能',
  ai: 'AI 功能',
}

export function FeatureToggles({
  className,
  features = defaultFeatures,
  onToggle,
}: FeatureTogglesProps): ReactNode {
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = []
    }
    acc[feature.category].push(feature)
    return acc
  }, {} as Record<string, Feature[]>)

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>功能开关</CardTitle>
        <CardDescription>控制系统功能的开启与关闭</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedFeatures).map(([category, featureList]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h4>
            <div className="space-y-4">
              {featureList.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{feature.name}</span>
                      {feature.enabled ? (
                        <Badge variant="secondary" className="text-xs bg-success/10 text-success">已开启</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">已关闭</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={(checked) => onToggle?.(feature.id, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
