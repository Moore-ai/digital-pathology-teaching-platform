'use client'

import type { ReactNode } from 'react'
import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout'
import { FileUploadZone, UploadQueueList, ResourceEditForm, ResourceFormData } from '@/components/features/resource'
import { UploadFile, ResourceType } from '@/types/resource'
import { useResourceStore } from '@/stores/resourceStore'
import { useAuthStore } from '@/stores/authStore'
import {
  Box,
  Typography,
  Stack,
  Paper,
  Modal,
  IconButton,
} from '@mui/material'
import {
  ArrowLeft,
  Upload as UploadIcon,
} from 'lucide-react'
import { detectFileType } from '@/lib/mock/resources'

// 生成唯一ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export default function ResourceUploadPage(): ReactNode {
  const [uploadQueue, setUploadQueue] = useState<UploadFile[]>([])
  const [editingFile, setEditingFile] = useState<UploadFile | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [pendingResourceData, setPendingResourceData] = useState<Map<string, ResourceFormData>>(new Map())

  // 使用 ref 存储最新的 pendingResourceData，避免闭包问题
  const pendingResourceDataRef = useRef(pendingResourceData)

  useEffect(() => {
    pendingResourceDataRef.current = pendingResourceData
  }, [pendingResourceData])

  const { addResource, updateResource } = useResourceStore()
  const { user } = useAuthStore()

  // 处理文件选择
  const handleFilesSelect = useCallback((files: File[]) => {
    const newItems: UploadFile[] = files.map(file => ({
      id: generateId(),
      file,
      status: 'pending',
      progress: 0,
    }))

    setUploadQueue(prev => [...prev, ...newItems])
  }, [])

  // 模拟上传
  const simulateUpload = useCallback((id: string, file: File) => {
    setUploadQueue(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'uploading' as const } : item
    ))

    // 模拟上传进度
    let currentProgress = 0

    const updateProgress = () => {
      currentProgress += 10 + Math.random() * 15

      if (currentProgress >= 100) {
        // 更新进度到 100%
        setUploadQueue(prev => prev.map(item =>
          item.id === id ? {
            ...item,
            progress: 100,
            speed: '1.5 MB/s',
            remainingTime: '约 0 分钟',
          } : item
        ))

        // 切换到处理状态
        setTimeout(() => {
          setUploadQueue(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'processing' as const } : item
          ))

          // 模拟处理完成
          setTimeout(() => {
            // 获取文件类型
            const fileType = (detectFileType(file.name) as ResourceType) || 'pdf'

            // 检查是否有编辑过的元数据
            const savedData = pendingResourceDataRef.current.get(id)

            // 创建资源
            const newResource = addResource({
              title: savedData?.title || file.name.replace(/\.[^/.]+$/, ''),
              description: savedData?.description || '',
              type: fileType,
              category: savedData?.category || 'other',
              tags: savedData?.tags || [],
              fileName: file.name,
              filePath: `/uploads/${fileType}/${Date.now()}/${file.name}`,
              fileSize: file.size,
              mimeType: file.type || 'application/octet-stream',
              relatedCourses: [],
              isPublic: savedData?.isPublic ?? true,
              allowDownload: savedData?.allowDownload ?? false,
              uploadedBy: user?.id || 'unknown',
            })

            // 更新为成功状态
            setUploadQueue(prev => prev.map(item =>
              item.id === id ? {
                ...item,
                status: 'success' as const,
                resourceId: newResource.id,
              } : item
            ))
          }, 800)
        }, 200)
      } else {
        // 更新进度
        setUploadQueue(prev => prev.map(item =>
          item.id === id ? {
            ...item,
            progress: Math.round(currentProgress),
            speed: `${(Math.random() * 3 + 1).toFixed(1)} MB/s`,
            remainingTime: `约 ${Math.ceil((100 - currentProgress) / 10)} 分钟`,
          } : item
        ))

        // 继续下一次更新
        setTimeout(updateProgress, 200)
      }
    }

    // 开始上传进度更新
    setTimeout(updateProgress, 200)
  }, [addResource, user?.id])

  // 全部上传
  const handleUploadAll = useCallback(() => {
    uploadQueue
      .filter(item => item.status === 'pending')
      .forEach(item => simulateUpload(item.id, item.file))
  }, [uploadQueue, simulateUpload])

  // 取消上传
  const handleCancel = useCallback((id: string) => {
    setUploadQueue(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'pending' as const, progress: 0 } : item
    ))
  }, [])

  // 重试
  const handleRetry = useCallback((id: string) => {
    const item = uploadQueue.find(i => i.id === id)
    if (item) {
      simulateUpload(id, item.file)
    }
  }, [uploadQueue, simulateUpload])

  // 移除
  const handleRemove = useCallback((id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id))
  }, [])

  // 编辑
  const handleEdit = useCallback((id: string) => {
    const item = uploadQueue.find(i => i.id === id)
    if (item) {
      setEditingFile(item)
      setShowEditDialog(true)
    }
  }, [uploadQueue])

  // 保存编辑
  const handleSaveEdit = useCallback((data: ResourceFormData) => {
    if (!editingFile) return

    // 如果资源已创建（上传成功），则更新资源
    if (editingFile.resourceId) {
      updateResource(editingFile.resourceId, {
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
        isPublic: data.isPublic,
        allowDownload: data.allowDownload,
      })
    } else {
      // 如果资源未创建，暂存元数据
      setPendingResourceData(prev => {
        const newMap = new Map(prev)
        newMap.set(editingFile.id, data)
        return newMap
      })
    }

    setShowEditDialog(false)
    setEditingFile(null)
  }, [editingFile, updateResource])

  // 清空队列
  const handleClearAll = useCallback(() => {
    setUploadQueue([])
  }, [])

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        <IconButton
          component={Link}
          href="/resources"
          sx={{
            color: 'var(--muted-foreground)',
            '&:hover': { color: 'var(--foreground)' },
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
            上传资料
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
            上传病例资料，支持 PDF、PPT、视频、SVS 切片文件
          </Typography>
        </Box>
      </Stack>

      {/* 上传区域 */}
      <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
        <Box sx={{ p: 3 }}>
          <FileUploadZone onFilesSelect={handleFilesSelect} />
        </Box>
      </Paper>

      {/* 上传队列 */}
      {uploadQueue.length > 0 && (
        <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <UploadIcon className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                上传队列
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ p: 2 }}>
            <UploadQueueList
              items={uploadQueue}
              onCancel={handleCancel}
              onRetry={handleRetry}
              onRemove={handleRemove}
              onEdit={handleEdit}
              onClearAll={handleClearAll}
              onUploadAll={handleUploadAll}
            />
          </Box>
        </Paper>
      )}

      {/* 编辑对话框 - 黄金分割比例 1.618:1 */}
      <Modal
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        aria-labelledby="edit-dialog-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 900,
            height: 556,
            maxWidth: '95vw',
            maxHeight: '90vh',
            overflow: 'hidden',
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid var(--border)', flexShrink: 0, lineHeight: 1 }}>
            <Typography id="edit-dialog-title" variant="body2" sx={{ fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.5 }}>
              编辑资料详情
            </Typography>
          </Box>
          <Box sx={{ px: 2, py: 1.5, overflow: 'auto', flex: 1 }}>
            {editingFile && (
              <ResourceEditForm
                file={editingFile.file}
                onSave={handleSaveEdit}
                onCancel={() => setShowEditDialog(false)}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </PageWrapper>
  )
}
