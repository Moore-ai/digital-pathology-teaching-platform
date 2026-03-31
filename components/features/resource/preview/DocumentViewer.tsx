'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Resource } from '@/types/resource'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  FileText,
  Presentation,
} from 'lucide-react'

interface DocumentViewerProps {
  resource: Resource
  className?: string
}

export function DocumentViewer({ resource, className }: DocumentViewerProps): ReactNode {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const totalPages = resource.pageCount || 10
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const handlePrevPage = useCallback(() => {
    goToPage(currentPage - 1)
  }, [currentPage, goToPage])

  const handleNextPage = useCallback(() => {
    goToPage(currentPage + 1)
  }, [currentPage, goToPage])

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 25, 200))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 25, 50))
  }, [])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return

      switch (e.key) {
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          handlePrevPage()
          break
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault()
          handleNextPage()
          break
        case 'Home':
          e.preventDefault()
          goToPage(1)
          break
        case 'End':
          e.preventDefault()
          goToPage(totalPages)
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
          e.preventDefault()
          handleZoomOut()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrevPage, handleNextPage, goToPage, totalPages, handleZoomIn, handleZoomOut])

  const isPdf = resource.type === 'pdf'
  const FileIcon = isPdf ? FileText : Presentation
  const fileTypeLabel = isPdf ? 'PDF' : 'PPT'

  return (
    <div
      className={cn(
        'flex flex-col bg-muted/30 rounded-xl overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50 bg-background rounded-none',
        className
      )}
    >
      {/* 文档主区域 */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-auto">
        <div
          className={cn(
            'relative bg-white shadow-2xl rounded-lg overflow-hidden transition-transform duration-200',
            isPdf ? 'aspect-[1/1.4]' : 'aspect-video'
          )}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            width: '100%',
            maxWidth: isPdf ? '720px' : '960px',
          }}
        >
          {/* 文档占位内容 */}
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
            <div className="text-center p-8">
              <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center mb-4 mx-auto">
                <FileIcon className={cn(
                  'w-10 h-10',
                  isPdf ? 'text-error' : 'text-warning'
                )} />
              </div>
              <div className="text-6xl font-bold text-primary/20 mb-4">
                {currentPage}
              </div>
              <p className="text-lg text-muted-foreground">
                {fileTypeLabel} 文档 · 第 {currentPage} 页 / 共 {totalPages} 页
              </p>
              <p className="text-sm text-muted-foreground/70 mt-2">
                {resource.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 控制栏 */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 py-3 px-4 bg-card border-t">
        {/* 第一页 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goToPage(1)}
          disabled={isFirstPage}
          className="h-8 w-8 hidden sm:flex"
          title="第一页 (Home)"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>

        {/* 上一页 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={isFirstPage}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">上一页</span>
        </Button>

        {/* 页码显示 */}
        <div className="flex items-center gap-1.5 text-sm min-w-20 justify-center">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value, 10)
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page)
              }
            }}
            className="w-12 h-8 text-center rounded border bg-background focus:outline-none focus:ring-2 focus:ring-secondary"
            aria-label="当前页码"
          />
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground tabular-nums">{totalPages}</span>
        </div>

        {/* 下一页 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={isLastPage}
          className="gap-1"
        >
          <span className="hidden sm:inline">下一页</span>
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* 最后一页 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goToPage(totalPages)}
          disabled={isLastPage}
          className="h-8 w-8 hidden sm:flex"
          title="最后一页 (End)"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

        {/* 缩放控制 */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            className="h-8 w-8"
            title="缩小 (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="min-w-12 text-center text-sm">{zoomLevel}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 200}
            className="h-8 w-8"
            title="放大 (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

        {/* 全屏 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="h-8 w-8"
          title="全屏"
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  )
}
