'use client'

import type { ReactNode } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { useDiscussionStore } from '@/stores/discussionStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  ChevronRight,
  MessageSquare,
  Heart,
  Eye,
  Pin,
  CheckCircle,
  Send,
  Share2,
  Flag,
  ThumbsUp,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'

interface DiscussionDetailPageProps {
  params: Promise<{ id: string }>
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  course: { label: '课程讨论', color: 'bg-blue-100 text-blue-800' },
  slice: { label: '切片讨论', color: 'bg-purple-100 text-purple-800' },
  exam: { label: '考试讨论', color: 'bg-amber-100 text-amber-800' },
  general: { label: '综合讨论', color: 'bg-gray-100 text-gray-800' },
  help: { label: '求助问答', color: 'bg-red-100 text-red-800' },
}

export default function DiscussionDetailPage({ params }: DiscussionDetailPageProps): ReactNode {
  const { id } = use(params)
  const { discussions, addReply } = useDiscussionStore()
  const { user } = useAuthStore()
  const [replyContent, setReplyContent] = useState('')

  const discussion = discussions.find(d => d.id === id)

  if (!discussion) {
    notFound()
  }

  const category = categoryConfig[discussion.category]

  const handleSubmitReply = () => {
    if (!replyContent.trim() || !user) return

    addReply(discussion.id, {
      id: `reply-${Date.now()}`,
      content: replyContent.trim(),
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || '',
        role: user.role,
      },
      likes: 0,
      isAccepted: false,
      createdAt: new Date(),
    })

    setReplyContent('')
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/discussions" className="hover:text-foreground transition-colors">
          讨论区
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground line-clamp-1">{discussion.title}</span>
      </nav>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：讨论内容和回复 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 讨论内容卡片 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {discussion.isPinned && (
                      <Pin className="w-4 h-4 text-secondary" />
                    )}
                    <Badge className={category.color}>{category.label}</Badge>
                    {discussion.isSolved && (
                      <Badge className="bg-success/10 text-success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        已解决
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-xl font-heading font-semibold text-foreground">
                    {discussion.title}
                  </h1>
                </div>
              </div>

              {/* 作者信息 */}
              <div className="flex items-center gap-3 mt-4">
                <Avatar>
                  <AvatarImage src={discussion.author.avatar} />
                  <AvatarFallback>{discussion.author.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{discussion.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {discussion.author.role === 'teacher' ? '教师' : discussion.author.role === 'admin' ? '管理员' : '同学'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(discussion.createdAt)}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* 讨论内容 */}
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap">{discussion.content}</p>
              </div>

              {/* 标签 */}
              {discussion.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {discussion.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* 操作栏 */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-secondary transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{discussion.likes}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{discussion.views}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{discussion.replies.length} 回复</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="w-4 h-4" />
                    分享
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Flag className="w-4 h-4" />
                    举报
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 回复区域 */}
          <Card>
            <CardHeader>
              <h2 className="text-base font-medium">全部回复 ({discussion.replies.length})</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 回复输入框 */}
              <TooltipProvider>
                <div className="flex gap-3">
                  <Avatar size="sm">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="写下你的回复..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && replyContent.trim()) {
                          e.preventDefault()
                          handleSubmitReply()
                        }
                      }}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleSubmitReply} disabled={!replyContent.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>发送</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </TooltipProvider>

              <Separator />

              {/* 回复列表 */}
              {discussion.replies.length > 0 ? (
                <div className="space-y-4">
                  {discussion.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar size="sm">
                        <AvatarImage src={reply.author.avatar} />
                        <AvatarFallback>{reply.author.name.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">
                            {reply.author.name}
                          </span>
                          {reply.author.role === 'teacher' && (
                            <Badge variant="secondary" className="text-xs">教师</Badge>
                          )}
                          {reply.isAccepted && (
                            <Badge className="bg-success/10 text-success text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              最佳答案
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-secondary transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{reply.likes}</span>
                          </button>
                          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            回复
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>暂无回复，快来发表你的看法吧！</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：相关信息 */}
        <div className="space-y-6">
          {/* 相关操作 */}
          <Card>
            <CardContent className="py-4">
              <div className="space-y-2">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Heart className="w-4 h-4" />
                  收藏话题
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <MessageSquare className="w-4 h-4" />
                  关注话题
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 相关讨论 */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-medium">相关讨论</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {discussions
                  .filter(d => d.id !== discussion.id && d.category === discussion.category)
                  .slice(0, 3)
                  .map((related) => (
                    <Link
                      key={related.id}
                      href={`/discussions/${related.id}`}
                      className="block p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {related.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {related.replies.length} 回复 · {related.views} 浏览
                      </p>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
