'use client'

import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { PageWrapper } from '@/components/layout'
import {
  DiscussionCard,
  CreatePostDialog,
  MyDiscussionCard,
  MyDiscussionStats,
  MyDiscussionsEmpty,
} from '@/components/features/discussion'
import type { ReplyStatus } from '@/components/features/discussion/MyDiscussionCard'
import { useDiscussionStore } from '@/stores/discussionStore'
import type { DiscussionCategory } from '@/types/discussion'
import { discussionStats } from '@/lib/mock/discussions'
import { useAuthStore } from '@/stores/authStore'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  MessageSquare,
  Users,
  TrendingUp,
  Pin,
  Clock,
  UserCircle,
  CheckCircle,
  MessageCircle,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TabValue = 'all' | 'latest' | 'hot' | 'unsolved' | 'pinned' | 'mine'
type MineStatusFilter = 'all' | 'pending' | 'discussing' | 'solved'

// 辅助函数：将日期转换为时间戳（处理 Date 对象和字符串）
function getTimestamp(date: Date | string): number {
  return typeof date === 'string' ? new Date(date).getTime() : date.getTime()
}

// 判断回复状态
function getReplyStatus(discussion: { isSolved: boolean; replies: unknown[] }): ReplyStatus {
  if (discussion.isSolved) return 'solved'
  if (discussion.replies.length > 0) return 'discussing'
  return 'pending'
}

export default function DiscussionsPage(): ReactNode {
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const [mineStatusFilter, setMineStatusFilter] = useState<MineStatusFilter>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { discussions, addDiscussion, removeDiscussion } = useDiscussionStore()
  const { user } = useAuthStore()

  // 我的提问
  const myDiscussions = useMemo(() => {
    return discussions.filter(d => d.author.id === user?.id)
  }, [discussions, user])

  // 我的提问统计
  const myStats = useMemo(() => {
    const totalPosts = myDiscussions.length
    const withReplies = myDiscussions.filter(d => d.replies.length > 0).length
    const solved = myDiscussions.filter(d => d.isSolved).length
    const solveRate = totalPosts > 0 ? Math.round((solved / totalPosts) * 100) : 0
    return { totalPosts, withReplies, solved, solveRate }
  }, [myDiscussions])

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
          getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
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
      case 'mine':
        result = myDiscussions
        // 我的提问状态筛选
        if (mineStatusFilter !== 'all') {
          result = result.filter(d => getReplyStatus(d) === mineStatusFilter)
        }
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
  }, [activeTab, searchKeyword, discussions, myDiscussions, mineStatusFilter])

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

      {/* 统计卡片 - 非我的提问标签下显示全局统计 */}
      {activeTab !== 'mine' ? (
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
      ) : (
        /* 我的提问统计 */
        <MyDiscussionStats
          totalPosts={myStats.totalPosts}
          withReplies={myStats.withReplies}
          solved={myStats.solved}
          solveRate={myStats.solveRate}
        />
      )}

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

      <div className="space-y-4">
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
            <TabsTrigger value="mine" className="gap-1.5">
              <UserCircle className="w-3.5 h-3.5" />
              我的提问
              {myDiscussions.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {myDiscussions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* 我的提问状态筛选 */}
        {activeTab === 'mine' && myDiscussions.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">状态：</span>
            <div className="flex gap-1">
              {[
                { value: 'all', label: '全部', icon: null },
                { value: 'pending', label: '待回复', icon: AlertCircle },
                { value: 'discussing', label: '讨论中', icon: MessageCircle },
                { value: 'solved', label: '已解决', icon: CheckCircle },
              ].map((status) => (
                <button
                  key={status.value}
                  onClick={() => setMineStatusFilter(status.value as MineStatusFilter)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5",
                    mineStatusFilter === status.value
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {status.icon && <status.icon className="w-3.5 h-3.5" />}
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 讨论列表 */}
      {activeTab === 'mine' ? (
        // 我的提问列表
        myDiscussions.length === 0 ? (
          <MyDiscussionsEmpty onCreatePost={() => {
            // 触发发帖对话框
            const button = document.querySelector('[data-create-post]') as HTMLButtonElement
            button?.click()
          }} />
        ) : filteredDiscussions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">暂无匹配的提问</h3>
            <p className="text-sm text-muted-foreground mt-1">
              尝试切换其他状态筛选
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {filteredDiscussions.map((discussion) => (
              <MyDiscussionCard
                key={discussion.id}
                discussion={discussion}
                replyStatus={getReplyStatus(discussion)}
                onDelete={() => removeDiscussion(discussion.id)}
              />
            ))}
          </div>
        )
      ) : (
        // 普通讨论列表
        filteredDiscussions.length > 0 ? (
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
        )
      )}
    </PageWrapper>
  )
}
