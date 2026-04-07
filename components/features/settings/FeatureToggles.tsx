'use client'

import type { ReactNode } from 'react'
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Switch,
} from '@mui/material'

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
    <Paper className={className} sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
          功能开关
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
          控制系统功能的开启与关闭
        </Typography>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Object.entries(groupedFeatures).map(([category, featureList]) => (
          <Box key={category}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--muted-foreground)', mb: 1.5 }}>
              {categoryLabels[category as keyof typeof categoryLabels]}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {featureList.map((feature) => (
                <Stack
                  key={feature.id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    border: '1px solid var(--border)',
                  }}
                >
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                        {feature.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={feature.enabled ? '已开启' : '已关闭'}
                        sx={{
                          height: 20,
                          fontSize: '0.625rem',
                          bgcolor: feature.enabled
                            ? 'color-mix(in srgb, var(--success) 10%, transparent)'
                            : 'var(--muted)',
                          '& .MuiChip-label': {
                            color: feature.enabled ? 'var(--success)' : 'var(--muted-foreground)',
                          },
                        }}
                      />
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                  <Switch
                    checked={feature.enabled}
                    onChange={(e) => onToggle?.(feature.id, e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary)' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--primary)' },
                    }}
                  />
                </Stack>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
