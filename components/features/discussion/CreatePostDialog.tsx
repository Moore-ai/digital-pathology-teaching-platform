'use client'

import type { ReactNode, ReactElement } from 'react'
import { useState } from 'react'
import { DiscussionCategory } from '@/types/discussion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Send } from 'lucide-react'

interface CreatePostDialogProps {
  trigger?: ReactElement
  onSubmit?: (data: { title: string; content: string; category: DiscussionCategory; tags: string[] }) => void
}

const categories: Array<{ value: DiscussionCategory; label: string }> = [
  { value: 'course', label: '课程讨论' },
  { value: 'slice', label: '切片讨论' },
  { value: 'exam', label: '考试讨论' },
  { value: 'help', label: '求助问答' },
  { value: 'general', label: '综合讨论' },
]

export function CreatePostDialog({ trigger, onSubmit }: CreatePostDialogProps): ReactNode {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<DiscussionCategory>('general')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return

    onSubmit?.({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
    })

    // 重置表单
    setTitle('')
    setContent('')
    setCategory('general')
    setTags([])
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger || (
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          发起讨论
        </Button>
      )} />
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>发起讨论</DialogTitle>
          <DialogDescription>
            发布问题或想法，与同学和老师交流讨论
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 标题 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">标题</label>
            <Input
              placeholder="请输入讨论标题..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 分类 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">分类</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={category === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 内容 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">内容</label>
            <textarea
              className="w-full min-h-[150px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="请输入讨论内容..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 标签 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">标签（最多5个）</label>
            <div className="flex gap-2">
              <Input
                placeholder="输入标签后按回车添加..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
              />
              <Button variant="outline" onClick={handleAddTag}>添加</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            发布
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
