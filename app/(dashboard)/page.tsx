'use client'

import type { ReactNode } from 'react'
import { PageWrapper } from '@/components/layout'
import {
  WelcomeCard,
  ProgressCard,
  RecentCourses,
  LearningChart,
} from '@/components/features/dashboard'
import { mockExams } from '@/lib/mock/exams'
import { BookOpen, ClipboardList, Clock } from 'lucide-react'

export default function HomePage(): ReactNode {
  // 统计数据
  const pendingExams = mockExams.filter(e => e.status === 'published' || e.status === 'ongoing').length

  return (
    <PageWrapper className="space-y-6">
      {/* 欢迎卡片 */}
      <WelcomeCard />

      {/* 状态统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard
          title="学习进度"
          value={78}
          description="已完成 12/15 章节"
          icon={<BookOpen className="w-4 h-4" />}
        />
        <ProgressCard
          title="待完成考试"
          value={pendingExams}
          description="请按时参加"
          icon={<ClipboardList className="w-4 h-4" />}
        />
        <ProgressCard
          title="本周学习时长"
          value={18}
          description="小时"
          icon={<Clock className="w-4 h-4" />}
          trend="up"
        />
        <ProgressCard
          title="平均成绩"
          value={85}
          description="较上月提升 5 分"
          icon={<ClipboardList className="w-4 h-4" />}
          trend="up"
        />
      </div>

      {/* 最近学习 */}
      <RecentCourses />

      {/* 学习统计图表 */}
      <LearningChart />
    </PageWrapper>
  )
}
