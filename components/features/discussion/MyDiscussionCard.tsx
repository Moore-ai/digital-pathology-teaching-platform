'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Discussion, DiscussionCategory } from '@/types/discussion'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Heart,
  Eye,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export type ReplyStatus = 'solved' | 'discussing' | 'pending'

interface MyDiscussionCardProps {
  className?: string
  discussion: Discussion
  replyStatus: ReplyStatus
  onEdit?: () => void
  onDelete?: () => void
}

const categoryConfig: Record<DiscussionCategory, { label: string; color: string }> = {
  course: { label: '课程讨论', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  slice: { label: '切片讨论', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  exam: { label: '考试讨论', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' },
  general: { label: '综合讨论', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
  help: { label: '求助问答', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
}

const statusConfig: Record<ReplyStatus, { color: string; label: string }> = {
  solved: { color: 'bg-success', label: '已解决' },
  discussing: { color: 'bg-info', label: '讨论中' },
  pending: { color: 'bg-warning', label: '待回复' },
}

export function MyDiscussionCard({
  className,
  discussion,
  replyStatus,
  onEdit,
  onDelete,
}: MyDiscussionCardProps): ReactNode {
  const category = categoryConfig[discussion.category]
  const status = statusConfig[replyStatus]

  // 获取最后回复
  const lastReply = discussion.replies.length > 0
    ? discussion.replies[discussion.replies.length - 1]
    : null

  return (
    <Card className={cn(
      "group hover:shadow-md transition-all cursor-pointer relative overflow-hidden h-full flex flex-col",
      className
    )}>
      {/* 状态指示条 */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        status.color
      )} />

      <CardContent className="pt-4 pb-2 pl-5 flex-1">
        {/* 标题行 */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/discussions/${discussion.id}`} className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
              {discussion.title}
            </h3>
          </Link>
          <Badge className={cn("shrink-0", category.color)}>{category.label}</Badge>
        </div>

        {/* 状态标签 */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className={cn(
              replyStatus === 'solved' && "border-success/50 text-success",
              replyStatus === 'discussing' && "border-info/50 text-info",
              replyStatus === 'pending' && "border-warning/50 text-warning",
            )}
          >
            {replyStatus === 'solved' && <CheckCircle className="w-3 h-3 mr-1" />}
            {replyStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
            {status.label}
          </Badge>
        </div>

        {/* 内容预览 */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {discussion.content}
        </p>

        {/* 最后回复或发布时间 */}
        {lastReply ? (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 text-sm">
            <Avatar className="w-6 h-6">
              <AvatarImage src={lastReply.author.avatar} />
              <AvatarFallback className="text-xs">
                {lastReply.author.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <span className="text-muted-foreground">
                <span className="font-medium text-foreground">{lastReply.author.name}</span>
                {' · '}
                {formatDate(lastReply.createdAt)}
              </span>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {lastReply.content}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            发布于 {formatDate(discussion.createdAt)}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pl-5 mt-auto flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            {discussion.replies.length}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            {discussion.likes}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {discussion.views}
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.preventDefault()
              onEdit()
            }}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.preventDefault()
                onDelete()
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
