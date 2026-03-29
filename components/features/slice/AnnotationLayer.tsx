'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Annotation, AnnotationType } from '@/types/slice'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Pencil,
  Ruler,
  Hash,
  Tag,
  Eye,
  Trash2,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

interface AnnotationLayerProps {
  className?: string
  annotations: Annotation[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  onDelete: (id: string) => void
  onToggleVisibility?: (id: string) => void
}

const annotationIcons: Record<AnnotationType, typeof Pencil> = {
  pen: Pencil,
  line: Ruler,
  area: Ruler,
  point: Hash,
  text: Tag,
}

const annotationLabels: Record<AnnotationType, string> = {
  pen: '画笔标注',
  line: '线段测量',
  area: '区域测量',
  point: '计数点',
  text: '文字标注',
}

export function AnnotationLayer({
  className,
  annotations,
  selectedId,
  onSelect,
  onDelete,
  onToggleVisibility,
}: AnnotationLayerProps): ReactNode {
  const [isExpanded, setIsExpanded] = useState(true)

  if (annotations.length === 0) {
    return (
      <div className={cn("p-4 bg-card border rounded-lg", className)}>
        <p className="text-sm text-muted-foreground text-center">
          暂无标注
        </p>
      </div>
    )
  }

  return (
    <div className={cn("bg-card border rounded-lg overflow-hidden", className)}>
      {/* 标题栏 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">标注图层</span>
          <Badge variant="secondary" className="text-xs">
            {annotations.length}
          </Badge>
        </div>
        <ChevronRight
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-90"
          )}
        />
      </button>

      {/* 标注列表 */}
      {isExpanded && (
        <ScrollArea className="max-h-64">
          <div className="border-t">
            {annotations.map((annotation, index) => {
              const Icon = annotationIcons[annotation.type]
              const isSelected = selectedId === annotation.id

              return (
                <div
                  key={annotation.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 border-b last:border-b-0 cursor-pointer transition-colors",
                    isSelected
                      ? "bg-secondary/10"
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => onSelect(isSelected ? null : annotation.id)}
                >
                  {/* 图标 */}
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center annotation-icon-bg"
                    style={{ '--annotation-color': annotation.color } as React.CSSProperties}
                  >
                    <Icon
                      className="w-3.5 h-3.5 annotation-icon-color"
                    />
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {annotation.label || `${annotationLabels[annotation.type]} ${index + 1}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {annotation.type === 'line' && `${(annotation.path.length * 0.5).toFixed(1)} μm`}
                      {annotation.type === 'area' && `${(annotation.path.length * 0.25).toFixed(1)} μm²`}
                      {annotation.type === 'point' && '计数点'}
                      {annotation.type === 'pen' && `${annotation.path.length} 个点`}
                      {annotation.type === 'text' && annotation.label}
                    </p>
                  </div>

                  {/* 操作 */}
                  <div className="flex items-center gap-1">
                    {onToggleVisibility && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleVisibility(annotation.id)
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(annotation.id)
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
