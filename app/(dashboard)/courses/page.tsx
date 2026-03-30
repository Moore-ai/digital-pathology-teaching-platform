'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { PageWrapper } from '@/components/layout'
import { CourseCard } from '@/components/features/course/CourseCard'
import { CategoryFilter } from '@/components/features/course/CategoryFilter'
import { mockCourses } from '@/lib/mock/courses'
import { type CourseCategory } from '@/types/course'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type StatusFilter = 'all' | 'not_started' | 'in_progress' | 'completed'

export default function CoursesPage(): ReactNode {
  const [categoryFilter, setCategoryFilter] = useState<CourseCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 筛选课程
  const filteredCourses = mockCourses.filter((course) => {
    const categoryMatch = categoryFilter === 'all' || course.category === categoryFilter
    const statusMatch = statusFilter === 'all' || course.status === statusFilter
    const searchMatch = searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && statusMatch && searchMatch
  })

  // 统计数据
  const stats = {
    total: mockCourses.length,
    inProgress: mockCourses.filter(c => c.status === 'in_progress').length,
    completed: mockCourses.filter(c => c.status === 'completed').length,
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">课程中心</h1>
          <p className="text-sm text-muted-foreground mt-1">
            共 {stats.total} 门课程，学习中 {stats.inProgress} 门，已完成 {stats.completed} 门
          </p>
        </div>

        {/* 搜索框 */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索课程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="space-y-4">
        <CategoryFilter
          selected={categoryFilter}
          onSelect={setCategoryFilter}
        />

        {/* 状态筛选 */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">状态：</span>
          <div className="flex gap-1">
            {[
              { value: 'all', label: '全部' },
              { value: 'in_progress', label: '学习中' },
              { value: 'completed', label: '已完成' },
              { value: 'not_started', label: '未开始' },
            ].map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value as StatusFilter)}
                className={cn(
                  "px-3 py-1 rounded-md text-sm transition-colors",
                  statusFilter === status.value
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 课程列表 */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">没有找到匹配的课程</p>
        </div>
      )}
    </PageWrapper>
  )
}
