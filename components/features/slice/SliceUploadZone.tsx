'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useRef } from 'react'
import {
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress,
} from '@mui/material'
import { Microscope, Upload, AlertCircle } from 'lucide-react'

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

  // 获取边框颜色
  const getBorderColor = () => {
    if (validationError) return 'var(--error)'
    if (isDragging) return 'var(--primary)'
    return 'var(--border)'
  }

  return (
    <Box className={className} sx={{ position: 'relative' }}>
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
          py: 8,
          px: 4,
          border: '2px dashed',
          borderColor: getBorderColor(),
          borderRadius: 3,
          cursor: isValidating ? 'wait' : 'pointer',
          bgcolor: isDragging
            ? 'color-mix(in srgb, var(--primary) 5%, transparent)'
            : 'var(--card)',
          transition: 'all 0.2s',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          opacity: isValidating ? 0.7 : 1,
          '&:hover': {
            borderColor: validationError ? 'var(--error)' : 'var(--primary)',
          },
        }}
      >
        {/* 玻片内部纹理 */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            borderRadius: 3,
            pointerEvents: 'none',
          }}
        >
          <Box sx={{ position: 'absolute', top: '25%', left: '25%', width: 192, height: 144, borderRadius: '50%', bgcolor: 'color-mix(in srgb, var(--primary) 5%, transparent)', filter: 'blur(40px)' }} />
          <Box sx={{ position: 'absolute', top: '50%', right: '25%', width: 144, height: 112, borderRadius: '50%', bgcolor: 'color-mix(in srgb, var(--secondary) 5%, transparent)', filter: 'blur(40px)' }} />
        </Box>

        {/* 玻片边框效果 */}
        <Box
          sx={{
            position: 'absolute',
            inset: 3,
            border: '1px solid var(--border)',
            borderRadius: 2,
            pointerEvents: 'none',
            opacity: 0.5,
          }}
        />

        {/* 内容 */}
        <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* 图标 */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              transition: 'transform 0.2s',
              transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {validationError ? (
              <AlertCircle className="w-10 h-10" style={{ color: 'var(--error)' }} />
            ) : isValidating ? (
              <CircularProgress size={40} sx={{ color: 'var(--primary)' }} />
            ) : (
              <Microscope
                className="w-10 h-10"
                style={{
                  color: isDragging ? 'var(--secondary)' : 'var(--primary)',
                  transition: 'color 0.2s',
                }}
              />
            )}
          </Box>

          {/* 文字 */}
          <Box sx={{ textAlign: 'center' }}>
            {validationError ? (
              <>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--error)', mb: 1 }}>
                  文件格式错误
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--error)', opacity: 0.7 }}>
                  {validationError}
                </Typography>
              </>
            ) : isValidating ? (
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>
                正在验证文件...
              </Typography>
            ) : (
              <>
                <Typography
                  sx={{
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    color: isDragging ? 'var(--primary)' : 'var(--foreground)',
                    mb: 1.5,
                    transition: 'color 0.2s',
                  }}
                >
                  {isDragging ? '松开以上传切片' : '将 SVS 切片文件拖拽到此处'}
                </Typography>

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <Box sx={{ height: 1, flex: 1, bgcolor: 'var(--border)' }} />
                  <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                    或
                  </Typography>
                  <Box sx={{ height: 1, flex: 1, bgcolor: 'var(--border)' }} />
                </Stack>

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 },
                    boxShadow: 1,
                  }}
                >
                  <Upload className="w-4 h-4" style={{ marginRight: 8 }} />
                  选择文件
                </Button>

                <Typography variant="body2" sx={{ mt: 3, color: 'var(--muted-foreground)' }}>
                  支持 <Box component="span" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>.svs</Box> 格式 ·
                  单文件最大 <Box component="span" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>5GB</Box> ·
                  批量上传
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* 拖拽时的叠加效果 */}
        {isDragging && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
              borderRadius: 3,
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".svs"
        multiple
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
    </Box>
  )
}
