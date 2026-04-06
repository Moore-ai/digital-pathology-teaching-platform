'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ToolType } from '@/types/slice'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Move,
  Pencil,
  Ruler,
  Hash,
  Tag,
  MessageSquare,
  Undo,
  Redo,
  Trash2,
} from 'lucide-react'

interface ToolPanelProps {
  className?: string
  currentTool: ToolType
  onToolChange: (tool: ToolType) => void
  onUndo?: () => void
  onRedo?: () => void
  onClear?: () => void
  canUndo?: boolean
  canRedo?: boolean
  hasAnnotations?: boolean
  currentColor?: string
  onColorChange?: (color: string) => void
}

interface ToolItem {
  id: ToolType
  icon: typeof Move
  label: string
  shortcut?: string
}

const tools: ToolItem[] = [
  { id: 'pan', icon: Move, label: '平移', shortcut: 'P' },
  { id: 'pen', icon: Pencil, label: '画笔标注', shortcut: 'B' },
  { id: 'measure', icon: Ruler, label: '测量', shortcut: 'M' },
  { id: 'count', icon: Hash, label: '计数', shortcut: 'C' },
  { id: 'label', icon: Tag, label: '标签', shortcut: 'L' },
  { id: 'discuss', icon: MessageSquare, label: '讨论', shortcut: 'D' },
]

export function ToolPanel({
  className,
  currentTool,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  canUndo = false,
  canRedo = false,
  hasAnnotations = false,
  currentColor,
  onColorChange,
}: ToolPanelProps): ReactNode {
  // 预设颜色
  const presetColors = [
    '#E86A33', // 诊断橙
    '#8B5CF6', // 病理紫
    '#10B981', // 医疗绿
    '#3B82F6', // 脑脊液蓝
    '#EF4444', // 动脉红
    '#F59E0B', // 胆汁黄
  ]

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col gap-2 p-3 bg-card border rounded-lg", className)}>
        {/* 工具按钮 */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground px-2 mb-1">工具</span>
          {tools.map((tool) => {
            const Icon = tool.icon
            const isActive = currentTool === tool.id
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "justify-start gap-2 w-full",
                      isActive && "bg-primary text-white"
                    )}
                    onClick={() => onToolChange(tool.id)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{tool.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{tool.label} {tool.shortcut && `(${tool.shortcut})`}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>

        {/* 颜色选择器（画笔/测量模式） */}
        {(currentTool === 'pen' || currentTool === 'measure') && onColorChange && (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground px-2 mb-1">颜色</span>
            <div className="flex flex-wrap gap-1.5 px-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                    currentColor === color ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                />
              ))}
            </div>
          </div>
        )}

        <Separator className="my-2" />

        {/* 操作按钮 */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground px-2 mb-1">操作</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 w-full"
                disabled={!canUndo}
                onClick={onUndo}
              >
                <Undo className="w-4 h-4" />
                <span className="hidden lg:inline">撤销</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>撤销 (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 w-full"
                disabled={!canRedo}
                onClick={onRedo}
              >
                <Redo className="w-4 h-4" />
                <span className="hidden lg:inline">重做</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>重做 (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start gap-2 w-full text-destructive hover:text-destructive"
                disabled={!hasAnnotations}
                onClick={onClear}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden lg:inline">清除</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>清除所有标注</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
