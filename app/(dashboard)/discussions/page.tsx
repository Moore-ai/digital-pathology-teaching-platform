'use client'

import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { PageWrapper } from '@/components/layout'
import { DiscussionCard, CreatePostDialog } from '@/components/features/discussion'
import { useDiscussionStore } from '@/stores/discussionStore'
import type { DiscussionCategory } from '@/types/discussion'
import { discussionStats } from '@/lib/mock/discussions'
import { useAuthStore } from '@/stores/authStore'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Pin,
  Clock,
} from 'lucide-react'

type TabValue = 'all' | 'latest' | 'hot' | 'unsolved' | 'pinned'

export default function DiscussionsPage(): ReactNode {
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { discussions, addDiscussion } = useDiscussionStore()
  const { user } = useAuthStore()

  // 处理发帖
  const handleCreatePost = (data: { title: string; content: string; category: DiscussionCategory; tags: string[] }) => {
    addDiscussion({
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags,
      author: {
        id: user?.id || 'anonymous',
        name: user?.name || '匿名用户',
        avatar: user?.avatar || '',
        role: user?.role || 'student',
      },
      isPinned: false,
      isSolved: false,
    })
  }

  // 筛选讨论
  const filteredDiscussions = useMemo(() => {
    let result = discussions

    // 标签筛选
    switch (activeTab) {
      case 'latest':
        result = [...result].sort((a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime()
        )
        break
      case 'hot':
        result = [...result].sort((a, b) => b.views - a.views)
        break
      case 'unsolved':
        result = result.filter(d => !d.isSolved)
        break
      case 'pinned':
        result = result.filter(d => d.isPinned)
        break
    }

    // 搜索
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase()
      result = result.filter(d =>
        d.title.toLowerCase().includes(keyword) ||
        d.content.toLowerCase().includes(keyword) ||
        d.tags.some(t => t.toLowerCase().includes(keyword))
      )
    }

    return result
  }, [activeTab, searchKeyword, discussions])

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">讨论区</h1>
          <p className="text-muted-foreground mt-1">
            与同学和老师交流学习心得、讨论疑难问题
          </p>
        </div>
        <CreatePostDialog onSubmit={handleCreatePost} />
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{discussionStats.totalDiscussions}</div>
                <div className="text-sm text-muted-foreground">讨论帖</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{discussionStats.totalReplies}</div>
                <div className="text-sm text-muted-foreground">回复数</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{discussionStats.activeUsers}</div>
                <div className="text-sm text-muted-foreground">活跃用户</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{discussionStats.todayPosts}</div>
                <div className="text-sm text-muted-foreground">今日发帖</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和标签页 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索讨论..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="latest" className="gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            最新
          </TabsTrigger>
          <TabsTrigger value="hot" className="gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            热门
          </TabsTrigger>
          <TabsTrigger value="unsolved">未解决</TabsTrigger>
          <TabsTrigger value="pinned" className="gap-1.5">
            <Pin className="w-3.5 h-3.5" />
            置顶
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 讨论列表 */}
      {filteredDiscussions.length > 0 ? (
        <div className="space-y-4">
          {filteredDiscussions.map((discussion) => (
            <DiscussionCard key={discussion.id} discussion={discussion} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">暂无讨论</h3>
          <p className="text-sm text-muted-foreground mt-1">
            成为第一个发起讨论的人吧
          </p>
        </div>
      )}
    </PageWrapper>
  )
}
