'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Microscope, Upload, FileImage, AlertCircle } from 'lucide-react'

interface SliceUploadZoneProps {
  onFilesSelect: (files: File[]) => void
  className?: string
}

export function SliceUploadZone({
  onFilesSelect,
  className,
}: SliceUploadZoneProps): ReactNode {
  const [isDragging, setIsDragging] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = useCallback((files: File[]): File[] => {
    const validFiles: File[] = []
    const maxSize = 5 * 1024 * 1024 * 1024 // 5GB

    for (const file of files) {
      // 检查格式
      if (!file.name.toLowerCase().endsWith('.svs')) {
        setValidationError(`"${file.name}" 不是有效的 SVS 文件`)
        continue
      }

      // 检查大小
      if (file.size > maxSize) {
        setValidationError(`"${file.name}" 超过 5GB 限制`)
        continue
      }

      validFiles.push(file)
    }

    return validFiles
  }, [])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsValidating(true)
    setValidationError(null)

    setTimeout(() => {
      const fileArray = Array.from(files)
      const validFiles = validateFiles(fileArray)

      if (validFiles.length > 0) {
        onFilesSelect(validFiles)
      }

      setIsValidating(false)
    }, 300)
  }, [validateFiles, onFilesSelect])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    // 重置input以便可以再次选择相同文件
    e.target.value = ''
  }, [handleFiles])

  return (
    <div className={cn('relative', className)}>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center py-16 px-8',
          'border-2 border-dashed rounded-xl cursor-pointer',
          'transition-all duration-300 ease-out',
          // 默认状态 - 玻片质感
          !isDragging && !validationError && 'border-slate-300 dark:border-slate-600',
          'bg-gradient-to-br from-slate-50 via-white to-slate-100',
          'dark:from-slate-900 dark:via-slate-800 dark:to-slate-900',
          // 悬停/拖拽状态
          isDragging && 'border-primary bg-primary/5 scale-[1.02]',
          // 错误状态
          validationError && 'border-error/50 bg-error/5',
          // 验证中
          isValidating && 'pointer-events-none opacity-70'
        )}
      >
        {/* 玻片内部纹理 */}
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-36 rounded-full bg-pink-100/30 dark:bg-pink-900/20 blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-36 h-28 rounded-full bg-purple-100/20 dark:bg-purple-900/20 blur-2xl" />
          <div className="absolute bottom-1/3 left-1/2 w-40 h-40 rounded-full bg-rose-100/25 dark:bg-rose-900/20 blur-2xl" />
        </div>

        {/* 玻片边框效果 */}
        <div className="absolute inset-6 border border-slate-200/50 dark:border-slate-700/50 rounded-lg pointer-events-none" />

        {/* 内容 */}
        <div className="relative z-10 flex flex-col items-center">
          {/* 图标 */}
          <div className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center mb-6',
            'bg-gradient-to-br from-primary/10 to-secondary/10',
            'transition-transform duration-300',
            isDragging && 'scale-110'
          )}>
            {validationError ? (
              <AlertCircle className="w-10 h-10 text-error" />
            ) : isValidating ? (
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <Microscope className={cn(
                'w-10 h-10 text-primary transition-all duration-300',
                isDragging && 'scale-110 text-secondary'
              )} />
            )}
          </div>

          {/* 文字 */}
          <div className="text-center">
            {validationError ? (
              <>
                <p className="text-lg font-medium text-error mb-2">
                  文件格式错误
                </p>
                <p className="text-sm text-error/70">{validationError}</p>
              </>
            ) : isValidating ? (
              <p className="text-lg font-medium text-muted-foreground">
                正在验证文件...
              </p>
            ) : (
              <>
                <p className={cn(
                  'text-xl font-medium text-foreground mb-3',
                  'transition-colors duration-300',
                  isDragging && 'text-primary'
                )}>
                  {isDragging ? '松开以上传切片' : '将 SVS 切片文件拖拽到此处'}
                </p>

                <div className="flex items-center gap-3 mb-4 w-full max-w-xs mx-auto">
                  <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
                  <span className="text-sm text-muted-foreground shrink-0">或</span>
                  <div className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
                </div>

                <div className={cn(
                  'inline-flex items-center gap-2 px-6 py-2.5 rounded-lg',
                  'bg-primary text-primary-foreground',
                  'hover:bg-primary/90 transition-colors',
                  'shadow-sm'
                )}>
                  <Upload className="w-4 h-4" />
                  <span className="font-medium">选择文件</span>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  支持 <span className="font-medium text-foreground">.svs</span> 格式 ·
                  单文件最大 <span className="font-medium text-foreground">5GB</span> ·
                  批量上传
                </p>
              </>
            )}
          </div>
        </div>

        {/* 拖拽时的叠加效果 */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/5 rounded-xl pointer-events-none" />
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".svs"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
