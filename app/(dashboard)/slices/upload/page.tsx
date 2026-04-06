'use client'

import type { ReactNode } from 'react'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { SliceUploadZone, SliceUploadItem, SliceEditForm } from '@/components/features/slice'
import { useSliceUploadStore } from '@/stores/sliceUploadStore'
import { useAuthStore } from '@/stores/authStore'
import { SliceFormData } from '@/types/slice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Upload, Trash2, Play, Pause } from 'lucide-react'

export default function SliceUploadPage(): ReactNode {
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    queue,
    addToQueue,
    removeFromQueue,
    updateFormData,
    startUpload,
    pauseUpload,
    resumeUpload,
    retryUpload,
    cancelUpload,
    uploadAll,
    pauseAll,
    clearCompleted,
    clearAll,
    getItem,
  } = useSliceUploadStore()

  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // 处理文件选择
  const handleFilesSelect = useCallback(async (files: File[]) => {
    if (files.length === 0) return
    await addToQueue(files)
  }, [addToQueue])

  // 编辑
  const handleEdit = useCallback((id: string) => {
    setEditingItemId(id)
    setShowEditDialog(true)
  }, [])

  // 保存编辑
  const handleSaveEdit = useCallback((data: SliceFormData) => {
    if (!editingItemId) return
    updateFormData(editingItemId, data)
    setShowEditDialog(false)
    setEditingItemId(null)
  }, [editingItemId, updateFormData])

  // 预览
  const handlePreview = useCallback((sliceId: string) => {
    router.push(`/slices/${sliceId}`)
  }, [router])

  // 计算统计
  const pendingCount = queue.filter((item) => item.status === 'pending').length
  const uploadingCount = queue.filter(
    (item) => item.status === 'uploading' || item.status === 'processing'
  ).length
  const completedCount = queue.filter((item) => item.status === 'success').length
  const pausedCount = queue.filter((item) => item.status === 'paused').length

  const editingItem = editingItemId ? getItem(editingItemId) : undefined

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center gap-4">
        <Link href="/slices" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">上传切片</h1>
          <p className="text-muted-foreground mt-1">
            将 SVS 数字病理切片添加到切片库
          </p>
        </div>
      </div>

      {/* 上传区域 */}
      <Card>
        <CardContent className="pt-6">
          <SliceUploadZone onFilesSelect={handleFilesSelect} />
        </CardContent>
      </Card>

      {/* 上传队列 */}
      {queue.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="w-5 h-5" />
                上传队列
                <span className="text-muted-foreground font-normal">
                  ({queue.length})
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                {/* 状态统计 */}
                <div className="flex items-center gap-3 text-sm text-muted-foreground mr-4">
                  {pendingCount > 0 && (
                    <span>待上传 {pendingCount}</span>
                  )}
                  {uploadingCount > 0 && (
                    <span className="text-primary">上传中 {uploadingCount}</span>
                  )}
                  {pausedCount > 0 && (
                    <span className="text-warning">已暂停 {pausedCount}</span>
                  )}
                  {completedCount > 0 && (
                    <span className="text-success">已完成 {completedCount}</span>
                  )}
                </div>

                {/* 批量操作 */}
                {pendingCount > 0 && (
                  <Button size="sm" onClick={uploadAll} className="gap-2">
                    <Play className="w-4 h-4" />
                    全部上传
                  </Button>
                )}
                {uploadingCount > 0 && (
                  <Button size="sm" variant="outline" onClick={pauseAll} className="gap-2">
                    <Pause className="w-4 h-4" />
                    全部暂停
                  </Button>
                )}
                {completedCount > 0 && (
                  <Button size="sm" variant="outline" onClick={clearCompleted}>
                    清除已完成
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearAll}
                  className="gap-2 text-muted-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                  清空
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {queue.map((item) => (
              <SliceUploadItem
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item.id)}
                onPause={() => pauseUpload(item.id)}
                onResume={() => resumeUpload(item.id)}
                onCancel={() => cancelUpload(item.id)}
                onRetry={() => retryUpload(item.id)}
                onRemove={() => removeFromQueue(item.id)}
                onPreview={
                  item.sliceId
                    ? () => handlePreview(item.sliceId!)
                    : undefined
                }
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* 使用提示 */}
      {queue.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                SVS 文件是数字病理切片的标准格式，通常包含多分辨率层级的显微镜图像。
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium text-foreground">支持格式</div>
                  <div>.svs</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">文件大小</div>
                  <div>最大 5GB</div>
                </div>
                <div>
                  <div className="font-medium text-foreground">上传方式</div>
                  <div>拖拽或点击选择</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 编辑对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑切片信息</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <SliceEditForm
              item={editingItem}
              onSave={handleSaveEdit}
              onCancel={() => {
                setShowEditDialog(false)
                setEditingItemId(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}
