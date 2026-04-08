'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useRef, useMemo } from 'react'
import { ResourceType } from '@/types/resource'
import { detectFileType } from '@/lib/mock/resources'
import {
  Box,
  Stack,
  Typography,
} from '@mui/material'
import {
  Upload,
  FileText,
  FileVideo,
  Presentation,
  Microscope,
} from 'lucide-react'

interface FileUploadZoneProps {
  onFilesSelect: (files: File[]) => void
  accept?: ResourceType[]
  multiple?: boolean
  disabled?: boolean
  className?: string
}

const fileTypeIcons: Record<ResourceType, ReactNode> = {
  pdf: <FileText className="w-5 h-5" style={{ color: 'var(--error)' }} />,
  ppt: <Presentation className="w-5 h-5" style={{ color: 'var(--warning)' }} />,
  video: <FileVideo className="w-5 h-5" style={{ color: '#8B5CF6' }} />,
  svs: <Microscope className="w-5 h-5" style={{ color: 'var(--secondary)' }} />,
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
    <Box
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        borderRadius: 3,
        border: '2px dashed',
        borderColor: isDragging ? 'var(--secondary)' : 'var(--border)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        bgcolor: isDragging ? 'color-mix(in srgb, var(--secondary) 5%, transparent)' : 'transparent',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: disabled ? 'var(--border)' : 'color-mix(in srgb, var(--secondary) 50%, transparent)',
          bgcolor: disabled ? 'transparent' : 'color-mix(in srgb, var(--secondary) 5%, transparent)',
        },
      }}
      role="button"
      tabIndex={0}
      aria-label="点击或拖拽文件到此处上传"
      className={className}
    >
      <input
        ref={inputRef}
        type="file"
        accept={acceptedExtensions.join(',')}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
        aria-label="选择文件"
      />

      {/* 图标 */}
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          bgcolor: isDragging ? 'color-mix(in srgb, var(--secondary) 10%, transparent)' : 'var(--muted)',
          transition: 'background-color 0.2s',
        }}
      >
        <Upload
          className="w-8 h-8"
          style={{ color: isDragging ? 'var(--secondary)' : 'var(--muted-foreground)' }}
        />
      </Box>

      {/* 提示文字 */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1" sx={{ fontWeight: 500, color: 'var(--foreground)', mb: 0.5 }}>
          {isDragging ? '释放文件以上传' : '拖拽文件到此处，或点击选择'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mb: 2 }}>
          单个文件最大 2 GB
        </Typography>
      </Box>

      {/* 支持的文件类型 */}
      <Stack direction="row" spacing={2}>
        {acceptedTypes.map(type => (
          <Stack key={type} direction="row" alignItems="center" spacing={0.5}>
            {fileTypeIcons[type]}
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              {fileTypeLabels[type]}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
