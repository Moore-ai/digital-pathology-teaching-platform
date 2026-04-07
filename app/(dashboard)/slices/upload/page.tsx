'use client'

import type { ReactNode } from 'react'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { SliceUploadZone, SliceUploadItem, SliceEditForm } from '@/components/features/slice'
import { useSliceUploadStore } from '@/stores/sliceUploadStore'
import { SliceFormData } from '@/types/slice'
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  Modal,
  IconButton,
} from '@mui/material'
import { ArrowLeft, Upload, Trash2, Play, Pause } from 'lucide-react'

export default function SliceUploadPage(): ReactNode {
  const router = useRouter()
  const {
    queue,
    addToQueue,
    removeFromQueue,
    updateFormData,
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
      <Stack direction="row" alignItems="flex-start" spacing={2}>
        <Link href="/slices">
          <IconButton
            size="small"
            sx={{
              color: 'var(--muted-foreground)',
              '&:hover': { color: 'var(--foreground)' },
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
            上传切片
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
            将 SVS 数字病理切片添加到切片库
          </Typography>
        </Box>
      </Stack>

      {/* 上传区域 */}
      <Paper sx={{ p: 3, bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
        <SliceUploadZone onFilesSelect={handleFilesSelect} />
      </Paper>

      {/* 上传队列 */}
      {queue.length > 0 && (
        <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
          {/* 队列头部 */}
          <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Upload className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                <Typography variant="h6" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                  上传队列
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                  ({queue.length})
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                {/* 状态统计 */}
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mr: 2 }}>
                  {pendingCount > 0 && (
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                      待上传 {pendingCount}
                    </Typography>
                  )}
                  {uploadingCount > 0 && (
                    <Typography variant="body2" sx={{ color: 'var(--primary)' }}>
                      上传中 {uploadingCount}
                    </Typography>
                  )}
                  {pausedCount > 0 && (
                    <Typography variant="body2" sx={{ color: 'var(--warning)' }}>
                      已暂停 {pausedCount}
                    </Typography>
                  )}
                  {completedCount > 0 && (
                    <Typography variant="body2" sx={{ color: 'var(--success)' }}>
                      已完成 {completedCount}
                    </Typography>
                  )}
                </Stack>

                {/* 批量操作 */}
                {pendingCount > 0 && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={uploadAll}
                    sx={{ bgcolor: 'var(--primary)', '&:hover': { bgcolor: 'var(--primary)' } }}
                  >
                    <Play className="w-4 h-4" style={{ marginRight: 4 }} />
                    全部上传
                  </Button>
                )}
                {uploadingCount > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={pauseAll}
                    sx={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
                    }}
                  >
                    <Pause className="w-4 h-4" style={{ marginRight: 4 }} />
                    全部暂停
                  </Button>
                )}
                {completedCount > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={clearCompleted}
                    sx={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
                    }}
                  >
                    清除已完成
                  </Button>
                )}
                <Button
                  size="small"
                  sx={{
                    color: 'var(--muted-foreground)',
                    '&:hover': { bgcolor: 'var(--muted)' },
                  }}
                  onClick={clearAll}
                >
                  <Trash2 className="w-4 h-4" style={{ marginRight: 4 }} />
                  清空
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* 队列列表 */}
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
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
          </Box>
        </Paper>
      )}

      {/* 使用提示 */}
      {queue.length === 0 && (
        <Paper
          sx={{
            p: 3,
            border: '1px dashed var(--border)',
            bgcolor: 'var(--card)',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mb: 2 }}>
              SVS 文件是数字病理切片的标准格式，通常包含多分辨率层级的显微镜图像。
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={3}
              sx={{ color: 'var(--muted-foreground)' }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                  支持格式
                </Typography>
                <Typography variant="body2">.svs</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                  文件大小
                </Typography>
                <Typography variant="body2">最大 5GB</Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                  上传方式
                </Typography>
                <Typography variant="body2">拖拽或点击选择</Typography>
              </Box>
            </Stack>
          </Box>
        </Paper>
      )}

      {/* 编辑对话框 */}
      <Modal
        open={showEditDialog}
        onClose={() => {
          setShowEditDialog(false)
          setEditingItemId(null)
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            maxHeight: '90vh',
            overflowY: 'auto',
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--foreground)', mb: 2 }}>
            编辑切片信息
          </Typography>
          {editingItem && (
            <SliceEditForm
              key={editingItem.id}
              item={editingItem}
              onSave={handleSaveEdit}
              onCancel={() => {
                setShowEditDialog(false)
                setEditingItemId(null)
              }}
            />
          )}
        </Box>
      </Modal>
    </PageWrapper>
  )
}
