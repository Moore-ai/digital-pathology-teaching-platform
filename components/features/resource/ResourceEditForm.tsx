'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X, Plus } from 'lucide-react'
import { Resource, ResourceCategory, categoryLabels } from '@/types/resource'
import { formatFileSize } from '@/lib/mock/resources'

interface ResourceEditFormProps {
  resource?: Resource
  file?: File
  onSave: (data: ResourceFormData) => void
  onCancel: () => void
  className?: string
}

export interface ResourceFormData {
  title: string
  description: string
  category: ResourceCategory
  tags: string[]
  isPublic: boolean
  allowDownload: boolean
}

const categories: ResourceCategory[] = [
  'digestive',
  'respiratory',
  'breast',
  'endocrine',
  'urinary',
  'nervous',
  'cardiovascular',
  'reproductive',
  'other',
]

export function ResourceEditForm({
  resource,
  file,
  onSave,
  onCancel,
  className,
}: ResourceEditFormProps): ReactNode {
  const [title, setTitle] = useState(resource?.title || file?.name?.replace(/\.[^/.]+$/, '') || '')
  const [description, setDescription] = useState(resource?.description || '')
  const [category, setCategory] = useState<ResourceCategory>(resource?.category || 'other')
  const [tags, setTags] = useState<string[]>(resource?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(resource?.isPublic ?? true)
  const [allowDownload, setAllowDownload] = useState(resource?.allowDownload ?? false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSave = () => {
    onSave({
      title,
      description,
      category,
      tags,
      isPublic,
      allowDownload,
    })
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 文件信息 */}
      {file && (
        <div className="p-4 rounded-lg bg-muted/50 space-y-2">
          <div className="text-sm font-medium">文件信息</div>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>文件名: <span className="text-foreground">{file.name}</span></div>
            <div>文件大小: <span className="text-foreground">{formatFileSize(file.size)}</span></div>
          </div>
        </div>
      )}

      {/* 资料名称 */}
      <div className="space-y-2">
        <Label htmlFor="title">资料名称 *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入资料名称"
        />
      </div>

      {/* 资料描述 */}
      <div className="space-y-2">
        <Label htmlFor="description">资料描述</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入资料描述（可选）"
          rows={3}
        />
      </div>

      {/* 所属分类 */}
      <div className="space-y-2">
        <Label htmlFor="category">所属分类 *</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as ResourceCategory)}>
          <SelectTrigger id="category">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {categoryLabels[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 标签 */}
      <div className="space-y-2">
        <Label htmlFor="newTag">标签</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-error"
                title={`移除标签 ${tag}`}
                aria-label={`移除标签 ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="newTag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="输入标签后点击添加"
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            title="添加标签"
          >
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
      </div>

      {/* 权限设置 */}
      <div className="space-y-4">
        <Label asChild>
          <span>权限设置</span>
        </Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="isPublic" className="cursor-pointer">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">设为公开资料</div>
                <div className="text-xs text-muted-foreground">学生可以查看此资料</div>
              </div>
            </Label>
            <Switch id="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allowDownload" className="cursor-pointer">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">允许下载</div>
                <div className="text-xs text-muted-foreground">用户可以下载此资料</div>
              </div>
            </Label>
            <Switch id="allowDownload" checked={allowDownload} onCheckedChange={setAllowDownload} />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave} disabled={!title.trim()}>
          保存
        </Button>
      </div>
    </div>
  )
}
