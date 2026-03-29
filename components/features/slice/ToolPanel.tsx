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
  ZoomIn,
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
}

interface ToolItem {
  id: ToolType
  icon: typeof Move
  label: string
  shortcut?: string
}

const tools: ToolItem[] = [
  { id: 'pan', icon: Move, label: '平移', shortcut: 'P' },
  { id: 'zoom', icon: ZoomIn, label: '缩放', shortcut: 'Z' },
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
}: ToolPanelProps): ReactNode {
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
