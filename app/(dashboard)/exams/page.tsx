'use client'

import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { PageWrapper } from '@/components/layout'
import { ExamCard } from '@/components/features/exam'
import { mockExams } from '@/lib/mock/exams'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, FileText } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

type TabValue = 'all' | 'pending' | 'ongoing' | 'completed' | 'draft'

export default function ExamsPage(): ReactNode {
  const [activeTab, setActiveTab] = useState<TabValue>('all')
  const { user } = useAuthStore()

  // 筛选考试
  const filteredExams = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return mockExams.filter(e => e.status === 'published')
      case 'ongoing':
        return mockExams.filter(e => e.status === 'ongoing')
      case 'completed':
        return mockExams.filter(e => e.status === 'graded' || e.status === 'completed')
      case 'draft':
        return mockExams.filter(e => e.status === 'draft')
      default:
        return mockExams
    }
  }, [activeTab])

  // 统计数量
  const counts = useMemo(() => ({
    all: mockExams.length,
    pending: mockExams.filter(e => e.status === 'published').length,
    ongoing: mockExams.filter(e => e.status === 'ongoing').length,
    completed: mockExams.filter(e => e.status === 'graded' || e.status === 'completed').length,
    draft: mockExams.filter(e => e.status === 'draft').length,
  }), [])

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin'

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">考试中心</h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher ? '管理考试、创建试卷、批改答卷' : '参加考试、查看成绩、复习错题'}
          </p>
        </div>
        {isTeacher && (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            创建考试
          </Button>
        )}
      </div>

      {/* 标签页 */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="all">
            全部
            <Badge variant="secondary" className="ml-1.5">{counts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            待考试
            <Badge variant="secondary" className="ml-1.5">{counts.pending}</Badge>
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            进行中
            <Badge variant="secondary" className="ml-1.5">{counts.ongoing}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            已完成
            <Badge variant="secondary" className="ml-1.5">{counts.completed}</Badge>
          </TabsTrigger>
          {isTeacher && (
            <TabsTrigger value="draft">
              草稿
              <Badge variant="secondary" className="ml-1.5">{counts.draft}</Badge>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      {/* 考试列表 */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} userRole={user?.role} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">暂无考试</h3>
          <p className="text-sm text-muted-foreground mt-1">
            当前分类下没有考试
          </p>
        </div>
      )}
    </PageWrapper>
  )
}
