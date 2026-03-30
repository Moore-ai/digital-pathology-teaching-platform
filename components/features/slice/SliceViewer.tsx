'use client'

import type { ReactNode } from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Slice, Annotation, ToolType, Point } from '@/types/slice'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Crosshair,
  Loader2,
} from 'lucide-react'

interface SliceViewerProps {
  className?: string
  slice: Slice
  currentTool: ToolType
  annotations: Annotation[]
  zoom: number
  position: Point
  onZoomChange: (zoom: number) => void
  onPositionChange: (position: Point) => void
  onAddAnnotation: (annotation: Annotation) => void
}

// 模拟放大倍数选项
const magnificationOptions = [1, 2, 4, 10, 20, 40]

export function SliceViewer({
  className,
  slice,
  currentTool,
  annotations,
  zoom,
  position,
  onZoomChange,
  onPositionChange,
  onAddAnnotation,
}: SliceViewerProps): ReactNode {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 })
  const [showLabelDialog, setShowLabelDialog] = useState(false)
  const [pendingPoint, setPendingPoint] = useState<Point | null>(null)
  const [labelText, setLabelText] = useState('')
  const [cursorPosition, setCursorPosition] = useState<Point>({ x: 0, y: 0 })

  // 模拟加载
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [slice.id])

  // 计算当前放大倍数
  const currentMagnification = magnificationOptions.find((m, i) => {
    const nextMag = magnificationOptions[i + 1]
    return zoom >= m && (!nextMag || zoom < nextMag)
  }) || magnificationOptions[magnificationOptions.length - 1]

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (currentTool === 'pan') {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }, [currentTool, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setCursorPosition({
        x: Math.round((e.clientX - rect.left) / zoom),
        y: Math.round((e.clientY - rect.top) / zoom),
      })
    }

    if (isDragging && currentTool === 'pan') {
      onPositionChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }, [isDragging, currentTool, dragStart, zoom, onPositionChange])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 点击添加标注
  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const point: Point = {
      x: Math.round((e.clientX - rect.left - position.x) / zoom),
      y: Math.round((e.clientY - rect.top - position.y) / zoom),
    }

    switch (currentTool) {
      case 'count':
        // 添加计数点
        onAddAnnotation({
          id: `count-${Date.now()}`,
          type: 'point',
          path: [point],
          color: '#8B5CF6',
          lineWidth: 2,
          createdBy: 'current-user',
          createdAt: new Date(),
        })
        break

      case 'label':
        // 添加标签
        setPendingPoint(point)
        setLabelText('')
        setShowLabelDialog(true)
        break

      case 'discuss':
        // 发起讨论（原型演示）
        console.log('发起讨论位置:', point)
        break
    }
  }, [currentTool, position, zoom, onAddAnnotation])

  // 提交标签
  const handleLabelSubmit = () => {
    if (pendingPoint && labelText.trim()) {
      onAddAnnotation({
        id: `label-${Date.now()}`,
        type: 'text',
        path: [pendingPoint],
        color: '#E86A33',
        lineWidth: 1,
        label: labelText.trim(),
        createdBy: 'current-user',
        createdAt: new Date(),
      })
    }
    setShowLabelDialog(false)
    setPendingPoint(null)
    setLabelText('')
  }

  // 获取光标样式
  const getCursorStyle = () => {
    switch (currentTool) {
      case 'pan':
        return isDragging ? 'grabbing' : 'grab'
      case 'pen':
        return 'crosshair'
      case 'measure':
        return 'crosshair'
      case 'count':
        return 'pointer'
      case 'label':
        return 'text'
      case 'discuss':
        return 'help'
      default:
        return 'default'
    }
  }

  // 缩放控制
  const handleZoomIn = () => onZoomChange(Math.min(zoom + 1, 40))
  const handleZoomOut = () => onZoomChange(Math.max(zoom - 1, 1))
  const handleReset = () => {
    onZoomChange(1)
    onPositionChange({ x: 0, y: 0 })
  }

  return (
    <div className={cn("relative bg-slate-900 rounded-lg overflow-hidden", className)}>
      {/* 加载状态 */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900">
          <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
          <p className="text-white/80">正在对焦...</p>
          <p className="text-white/40 text-sm mt-1">加载切片瓦片数据</p>
        </div>
      )}

      {/* 工具栏 */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 rounded-lg p-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={handleZoomOut}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="w-24 px-2">
          <Slider
            value={[zoom]}
            min={1}
            max={40}
            step={1}
            onValueChange={([value]) => onZoomChange(value)}
            className="w-full"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={handleZoomIn}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-white/20 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={handleReset}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* 状态信息 */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <Badge variant="secondary" className="bg-black/50 text-white border-0">
          {currentMagnification}x
        </Badge>
        <Badge variant="secondary" className="bg-black/50 text-white border-0">
          <Crosshair className="w-3 h-3 mr-1" />
          {cursorPosition.x}, {cursorPosition.y}
        </Badge>
      </div>

      {/* 切片视图区域 */}
      <div
        ref={containerRef}
        className="w-full aspect-4/3 relative overflow-hidden"
        style={{ cursor: getCursorStyle() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      >
        {/* 模拟切片视图 */}
        <div
          className="absolute inset-0 transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* 模拟病理切片纹理 */}
          <div className="w-full h-full bg-linear-to-br from-pink-50 via-purple-50 to-rose-50">
            {/* 细胞结构模拟 */}
            <div className="absolute inset-0">
              {/* 细胞群1 */}
              <div className="absolute top-[15%] left-[20%] w-32 h-28 rounded-full bg-pink-200/60 blur-sm transform rotate-12" />
              <div className="absolute top-[18%] left-[22%] w-20 h-18 rounded-full bg-rose-300/40 blur-[1px]" />
              <div className="absolute top-[16%] left-[25%] w-8 h-7 rounded-full bg-purple-400/50" />

              {/* 细胞群2 */}
              <div className="absolute top-[40%] left-[50%] w-40 h-32 rounded-full bg-purple-200/50 blur-sm transform -rotate-6" />
              <div className="absolute top-[42%] left-[52%] w-24 h-20 rounded-full bg-pink-300/40 blur-[1px]" />
              <div className="absolute top-[45%] left-[55%] w-10 h-8 rounded-full bg-rose-400/60" />

              {/* 细胞群3 */}
              <div className="absolute top-[65%] left-[25%] w-36 h-30 rounded-full bg-rose-200/50 blur-sm transform rotate-3" />
              <div className="absolute top-[67%] left-[28%] w-22 h-18 rounded-full bg-purple-300/40 blur-[1px]" />

              {/* 细胞群4 */}
              <div className="absolute top-[30%] left-[70%] w-28 h-24 rounded-full bg-pink-300/40 blur-sm transform -rotate-12" />
              <div className="absolute top-[32%] left-[72%] w-16 h-14 rounded-full bg-rose-200/50" />

              {/* 细胞群5 */}
              <div className="absolute top-[75%] left-[60%] w-30 h-26 rounded-full bg-purple-200/40 blur-sm" />
            </div>

            {/* 网格线（高倍镜时显示） */}
            {zoom >= 10 && (
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(to right, #9333ea 1px, transparent 1px), linear-gradient(to bottom, #9333ea 1px, transparent 1px)',
                  backgroundSize: `${100 / zoom}px ${100 / zoom}px`,
                }}
              />
            )}
          </div>

          {/* 标注层 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {annotations.map((annotation) => (
              <g key={annotation.id}>
                {/* 计数点 */}
                {annotation.type === 'point' && annotation.path[0] && (
                  <circle
                    cx={annotation.path[0].x}
                    cy={annotation.path[0].y}
                    r={8 / zoom}
                    fill={annotation.color}
                    stroke="white"
                    strokeWidth={2 / zoom}
                    className="pointer-events-auto"
                  />
                )}
                {/* 文字标注 */}
                {annotation.type === 'text' && annotation.path[0] && annotation.label && (
                  <g>
                    <circle
                      cx={annotation.path[0].x}
                      cy={annotation.path[0].y}
                      r={6 / zoom}
                      fill={annotation.color}
                    />
                    <text
                      x={annotation.path[0].x + 10 / zoom}
                      y={annotation.path[0].y}
                      fill={annotation.color}
                      fontSize={12 / zoom}
                      fontFamily="sans-serif"
                      className="pointer-events-auto"
                    >
                      {annotation.label}
                    </text>
                  </g>
                )}
                {/* 画笔路径 */}
                {annotation.type === 'pen' && annotation.path.length > 1 && (
                  <path
                    d={`M ${annotation.path.map(p => `${p.x},${p.y}`).join(' L ')}`}
                    fill="none"
                    stroke={annotation.color}
                    strokeWidth={annotation.lineWidth / zoom}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white/80 text-xs p-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>{slice.title}</span>
          <span className="text-white/40">|</span>
          <span>{slice.width.toLocaleString()} × {slice.height.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40">工具:</span>
          <span className="text-secondary">
            {currentTool === 'pan' && '平移'}
            {currentTool === 'pen' && '画笔'}
            {currentTool === 'measure' && '测量'}
            {currentTool === 'count' && '计数'}
            {currentTool === 'label' && '标签'}
            {currentTool === 'discuss' && '讨论'}
          </span>
        </div>
      </div>

      {/* 标签对话框 */}
      <Dialog open={showLabelDialog} onOpenChange={setShowLabelDialog}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>添加标签</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="输入标签文字..."
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLabelDialog(false)}>
              取消
            </Button>
            <Button onClick={handleLabelSubmit}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
