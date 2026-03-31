'use client'

import type { ReactNode } from 'react'
import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout'
import { ResourceCard, FileTypeFilter, ResourceEditForm, ResourceFormData } from '@/components/features/resource'
import { ResourceType, Resource } from '@/types/resource'
import { useResourceStore } from '@/stores/resourceStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Search, Plus, SlidersHorizontal } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function ResourcesPage(): ReactNode {
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [deletingResource, setDeletingResource] = useState<Resource | null>(null)

  const { user } = useAuthStore()
  const { resources, updateResource, deleteResource, searchResources } = useResourceStore()

  const canUpload = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  // 筛选资料
  const filteredResources = useMemo(() => {
    let result = resources

    // 学生只能查看公开资料
    if (isStudent) {
      result = result.filter(r => r.isPublic)
    }

    // 类型筛选
    if (selectedType !== 'all') {
      result = result.filter(r => r.type === selectedType)
    }

    // 关键词搜索
    if (searchKeyword.trim()) {
      result = searchResources(searchKeyword.trim())
    }

    return result
  }, [selectedType, searchKeyword, resources, searchResources, isStudent])

  // 编辑资源
  const handleEdit = useCallback((resource: Resource) => {
    setEditingResource(resource)
  }, [])

  // 保存编辑
  const handleSaveEdit = useCallback((data: ResourceFormData) => {
    if (editingResource) {
      updateResource(editingResource.id, data)
      setEditingResource(null)
    }
  }, [editingResource, updateResource])

  // 删除资源
  const handleDelete = useCallback((resource: Resource) => {
    setDeletingResource(resource)
  }, [])

  // 确认删除
  const handleConfirmDelete = useCallback(() => {
    if (deletingResource) {
      deleteResource(deletingResource.id)
      setDeletingResource(null)
    }
  }, [deletingResource, deleteResource])

  // 下载资源
  const handleDownload = useCallback((resource: Resource) => {
    // 前端原型：模拟下载
    alert(`模拟下载：${resource.fileName}\n\n实际项目中应调用后端 API 进行文件下载。`)
  }, [])

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">病例资料</h1>
          <p className="text-muted-foreground mt-1">
            管理教学资料，包括PDF文档、PPT课件、视频和病理切片
          </p>
        </div>
        {canUpload && (
          <Link href="/resources/upload">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              上传资料
            </Button>
          </Link>
        )}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索资料名称、描述或标签..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span>共 {filteredResources.length} 份资料</span>
        </div>
      </div>

      {/* 类型筛选 */}
      <FileTypeFilter
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* 资料网格 */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              showActions={canUpload}
              onEdit={() => handleEdit(resource)}
              onDelete={() => handleDelete(resource)}
              onDownload={() => handleDownload(resource)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">未找到资料</h3>
          <p className="text-sm text-muted-foreground mt-1">
            尝试调整搜索条件或筛选类型
          </p>
        </div>
      )}

      {/* 编辑对话框 */}
      <Dialog open={!!editingResource} onOpenChange={(open) => !open && setEditingResource(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑资料详情</DialogTitle>
          </DialogHeader>
          {editingResource && (
            <ResourceEditForm
              resource={editingResource}
              onSave={handleSaveEdit}
              onCancel={() => setEditingResource(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deletingResource} onOpenChange={(open) => !open && setDeletingResource(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除资料「{deletingResource?.title}」吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-error text-white hover:bg-error/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  )
}
