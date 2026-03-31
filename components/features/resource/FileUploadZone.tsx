'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useRef, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Upload, FileText, FileVideo, Presentation, Microscope } from 'lucide-react'
import { ResourceType } from '@/types/resource'
import { detectFileType } from '@/lib/mock/resources'

interface FileUploadZoneProps {
  onFilesSelect: (files: File[]) => void
  accept?: ResourceType[]
  multiple?: boolean
  disabled?: boolean
  className?: string
}

const fileTypeIcons: Record<ResourceType, ReactNode> = {
  pdf: <FileText className="w-5 h-5 text-error" />,
  ppt: <Presentation className="w-5 h-5 text-warning" />,
  video: <FileVideo className="w-5 h-5 text-purple-500" />,
  svs: <Microscope className="w-5 h-5 text-secondary" />,
}

const fileTypeLabels: Record<ResourceType, string> = {
  pdf: 'PDF',
  ppt: 'PPT',
  video: '视频',
  svs: 'SVS切片',
}

const defaultAcceptedTypes: ResourceType[] = ['pdf', 'ppt', 'video', 'svs']

const extensionMap: Record<ResourceType, string[]> = {
  pdf: ['.pdf'],
  ppt: ['.ppt', '.pptx'],
  video: ['.mp4', '.avi', '.mov', '.mkv'],
  svs: ['.svs', '.ndpi', '.tiff', '.tif'],
}

export function FileUploadZone({
  onFilesSelect,
  accept,
  multiple = true,
  disabled = false,
  className,
}: FileUploadZoneProps): ReactNode {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // 使用 useMemo 包装 acceptedTypes
  const acceptedTypes = useMemo(() => accept || defaultAcceptedTypes, [accept])

  // 使用 useMemo 包装 acceptedExtensions
  const acceptedExtensions = useMemo(() => {
    return acceptedTypes.flatMap(type => extensionMap[type] || [])
  }, [acceptedTypes])

  // 处理拖拽事件
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

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

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const fileType = detectFileType(file.name)
      return fileType && acceptedTypes.includes(fileType)
    })

    if (validFiles.length > 0) {
      onFilesSelect(multiple ? validFiles : [validFiles[0]])
    }
  }, [disabled, acceptedTypes, multiple, onFilesSelect])

  // 处理点击选择
  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }, [disabled])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelect(multiple ? files : [files[0]])
    }
    // 重置 input 值，允许选择相同文件
    e.target.value = ''
  }, [multiple, onFilesSelect])

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all',
        'hover:border-secondary/50 hover:bg-secondary/5',
        isDragging && 'border-secondary bg-secondary/5',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
      role="button"
      tabIndex={0}
      aria-label="点击或拖拽文件到此处上传"
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedExtensions.join(',')}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        aria-label="选择文件"
      />

      {/* 图标 */}
      <div className={cn(
        'w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors',
        isDragging ? 'bg-secondary/10' : 'bg-muted',
      )}>
        <Upload className={cn(
          'w-8 h-8 transition-colors',
          isDragging ? 'text-secondary' : 'text-muted-foreground',
        )} />
      </div>

      {/* 提示文字 */}
      <div className="text-center">
        <p className="text-base font-medium text-foreground mb-1">
          {isDragging ? '释放文件以上传' : '拖拽文件到此处，或点击选择'}
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          单个文件最大 2 GB
        </p>
      </div>

      {/* 支持的文件类型 */}
      <div className="flex items-center gap-4">
        {acceptedTypes.map(type => (
          <div key={type} className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {fileTypeIcons[type]}
            <span>{fileTypeLabels[type]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
