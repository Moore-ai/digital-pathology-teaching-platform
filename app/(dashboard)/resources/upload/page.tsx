'use client'

import type { ReactNode } from 'react'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout'
import { FileUploadZone, UploadQueueList, ResourceEditForm, ResourceFormData } from '@/components/features/resource'
import { UploadFile, ResourceType } from '@/types/resource'
import { useResourceStore } from '@/stores/resourceStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Upload as UploadIcon } from 'lucide-react'
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
  const simulateUpload = useCallback((id: string) => {
    setUploadQueue(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'uploading' as const } : item
    ))

    // 模拟上传进度
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        // 上传完成，切换到处理状态
        setUploadQueue(prev => prev.map(item =>
          item.id === id ? { ...item, status: 'processing' as const, progress: 100 } : item
        ))

        // 模拟处理完成
        setTimeout(() => {
          // 先获取上传项信息，再更新状态
          let uploadItem: UploadFile | undefined
          setUploadQueue(prev => {
            uploadItem = prev.find(item => item.id === id)
            return prev
          })

          if (!uploadItem) return

          // 获取文件类型
          const fileType = detectFileType(uploadItem.file.name) as ResourceType || 'pdf'

          // 检查是否有编辑过的元数据
          const savedData = pendingResourceData.get(id)

          // 创建资源（在 setState 回调外部调用）
          const newResource = addResource({
            title: savedData?.title || uploadItem.file.name.replace(/\.[^/.]+$/, ''),
            description: savedData?.description || '',
            type: fileType,
            category: savedData?.category || 'other',
            tags: savedData?.tags || [],
            fileName: uploadItem.file.name,
            filePath: `/uploads/${fileType}/${Date.now()}/${uploadItem.file.name}`,
            fileSize: uploadItem.file.size,
            mimeType: uploadItem.file.type || 'application/octet-stream',
            relatedCourses: [],
            isPublic: savedData?.isPublic ?? true,
            allowDownload: savedData?.allowDownload ?? false,
            uploadedBy: user?.id || 'unknown',
          })

          // 更新上传队列状态
          setUploadQueue(prev => prev.map(item =>
            item.id === id ? {
              ...item,
              status: 'success' as const,
              resourceId: newResource.id,
            } : item
          ))
        }, 1000)
      } else {
        setUploadQueue(prev => prev.map(item =>
          item.id === id ? {
            ...item,
            progress: Math.round(progress),
            speed: `${(Math.random() * 3 + 1).toFixed(1)} MB/s`,
            remainingTime: `约 ${Math.ceil((100 - progress) / 10)} 分钟`,
          } : item
        ))
      }
    }, 200)
  }, [addResource, user?.id, pendingResourceData])

  // 全部上传
  const handleUploadAll = useCallback(() => {
    uploadQueue
      .filter(item => item.status === 'pending')
      .forEach(item => simulateUpload(item.id))
  }, [uploadQueue, simulateUpload])

  // 取消上传
  const handleCancel = useCallback((id: string) => {
    setUploadQueue(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'pending' as const, progress: 0 } : item
    ))
  }, [])

  // 重试
  const handleRetry = useCallback((id: string) => {
    simulateUpload(id)
  }, [simulateUpload])

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
      <div className="flex items-center gap-4">
        <Link href="/resources" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">上传资料</h1>
          <p className="text-muted-foreground mt-1">
            上传病例资料，支持 PDF、PPT、视频、SVS 切片文件
          </p>
        </div>
      </div>

      {/* 上传区域 */}
      <Card>
        <CardContent className="pt-6">
          <FileUploadZone onFilesSelect={handleFilesSelect} />
        </CardContent>
      </Card>

      {/* 上传队列 */}
      {uploadQueue.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UploadIcon className="w-5 h-5" />
              上传队列
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UploadQueueList
              items={uploadQueue}
              onCancel={handleCancel}
              onRetry={handleRetry}
              onRemove={handleRemove}
              onEdit={handleEdit}
              onClearAll={handleClearAll}
              onUploadAll={handleUploadAll}
            />
          </CardContent>
        </Card>
      )}

      {/* 编辑对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑资料详情</DialogTitle>
          </DialogHeader>
          {editingFile && (
            <ResourceEditForm
              file={editingFile.file}
              onSave={handleSaveEdit}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}
