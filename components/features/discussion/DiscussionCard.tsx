'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Discussion, DiscussionCategory } from '@/types/discussion'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  MessageSquare,
  Heart,
  Eye,
  Pin,
  CheckCircle,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface DiscussionCardProps {
  className?: string
  discussion: Discussion
}

const categoryConfig: Record<DiscussionCategory, { label: string; color: string }> = {
  course: { label: '课程讨论', color: 'bg-blue-100 text-blue-800' },
  slice: { label: '切片讨论', color: 'bg-purple-100 text-purple-800' },
  exam: { label: '考试讨论', color: 'bg-amber-100 text-amber-800' },
  general: { label: '综合讨论', color: 'bg-gray-100 text-gray-800' },
  help: { label: '求助问答', color: 'bg-red-100 text-red-800' },
}

export function DiscussionCard({ className, discussion }: DiscussionCardProps): ReactNode {
  const category = categoryConfig[discussion.category]
  const roleColors: Record<string, string> = {
    student: 'text-muted-foreground',
    teacher: 'text-secondary',
    admin: 'text-primary',
  }

  return (
    <Link href={`/discussions/${discussion.id}`}>
      <Card className={cn(
        "group hover:shadow-md transition-all cursor-pointer",
        discussion.isPinned && "border-secondary/50 bg-secondary/5",
        className
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            {/* 作者头像 */}
            <Avatar>
              <AvatarImage src={discussion.author.avatar} />
              <AvatarFallback>{discussion.author.name.slice(0, 1)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              {/* 标题 */}
              <div className="flex items-center gap-2">
                {discussion.isPinned && (
                  <Pin className="w-4 h-4 text-secondary flex-shrink-0" />
                )}
                <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
                  {discussion.title}
                </h3>
              </div>

              {/* 元信息 */}
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span className={roleColors[discussion.author.role]}>
                  {discussion.author.name}
                </span>
                <span>·</span>
                <span>{formatDate(discussion.createdAt)}</span>
              </div>
            </div>

            {/* 分类标签 */}
            <Badge className={category.color}>{category.label}</Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          {/* 内容预览 */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {discussion.content}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {discussion.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
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

          {discussion.isSolved && (
            <Badge className="ml-auto bg-success/10 text-success">
              <CheckCircle className="w-3 h-3 mr-1" />
              已解决
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
