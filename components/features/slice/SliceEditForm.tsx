'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SliceUploadItem, SliceFormData } from '@/types/slice'
import { CourseCategory } from '@/types/course'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { X, Plus, FileImage } from 'lucide-react'

interface SliceEditFormProps {
  item: SliceUploadItem
  onSave: (data: SliceFormData) => void
  onCancel: () => void
}

const categoryOptions: { value: CourseCategory; label: string }[] = [
  { value: 'digestive', label: '消化系统' },
  { value: 'respiratory', label: '呼吸系统' },
  { value: 'breast', label: '乳腺' },
  { value: 'endocrine', label: '内分泌' },
  { value: 'urinary', label: '泌尿系统' },
  { value: 'nervous', label: '神经系统' },
  { value: 'cardiovascular', label: '心血管' },
  { value: 'reproductive', label: '生殖系统' },
  { value: 'other', label: '其他' },
]

const magnificationOptions = [
  { value: 10, label: '10x' },
  { value: 20, label: '20x' },
  { value: 40, label: '40x' },
  { value: 60, label: '60x' },
]

export function SliceEditForm({
  item,
  onSave,
  onCancel,
}: SliceEditFormProps): ReactNode {
  const [formData, setFormData] = useState<SliceFormData>({
    title: item.title,
    description: item.description,
    category: item.category,
    magnification: item.metadata?.magnification || 40,
    tags: item.tags,
    isPublic: item.isPublic,
    allowDownload: item.allowDownload,
  })

  const [newTag, setNewTag] = useState('')

  // 更新表单数据当item变化时
  useEffect(() => {
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      magnification: item.metadata?.magnification || 40,
      tags: item.tags,
      isPublic: item.isPublic,
      allowDownload: item.allowDownload,
    })
  }, [item])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const addTag = () => {
    const tag = newTag.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 文件信息 */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileImage className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {item.file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {(item.file.size / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
      </div>

      {/* 标题 */}
      <div className="space-y-2">
        <Label htmlFor="title">
          切片标题 <span className="text-error">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="输入切片标题"
          required
        />
      </div>

      {/* 描述 */}
      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="输入切片描述信息..."
          rows={3}
        />
      </div>

      {/* 分类和放大倍数 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            分类 <span className="text-error">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value: CourseCategory) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>放大倍数</Label>
          <Select
            value={formData.magnification.toString()}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                magnification: parseInt(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {magnificationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 标签 */}
      <div className="space-y-2">
        <Label>标签</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-error"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="输入标签后按回车添加"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addTag}
            disabled={!newTag.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 元数据（只读） */}
      {item.metadata && (
        <div className="space-y-2">
          <Label className="text-muted-foreground">切片尺寸（自动检测）</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <span className="text-xs text-muted-foreground">宽度</span>
              <p className="font-medium">{item.metadata.width.toLocaleString()} px</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <span className="text-xs text-muted-foreground">高度</span>
              <p className="font-medium">{item.metadata.height.toLocaleString()} px</p>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* 权限设置 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>公开可见</Label>
            <p className="text-sm text-muted-foreground">
              所有用户可以浏览此切片
            </p>
          </div>
          <Switch
            checked={formData.isPublic}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isPublic: checked }))
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>允许下载</Label>
            <p className="text-sm text-muted-foreground">
              允许用户下载原始 SVS 文件
            </p>
          </div>
          <Switch
            checked={formData.allowDownload}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, allowDownload: checked }))
            }
          />
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存</Button>
      </div>
    </form>
  )
}
