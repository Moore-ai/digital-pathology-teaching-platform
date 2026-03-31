'use client'

import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { PageWrapper } from '@/components/layout'
import {
  ResultStatsCards,
  ResultCard,
  ScoreTrendChart,
  EmptyResults,
  ClassResultCard,
  AdminResultStats,
} from '@/components/features/exam'
import {
  mockResults,
  mockResultStats,
  mockTrendData,
  categoryOptions,
  levelOptions,
  mockClassResults,
  mockGlobalStats,
  classOptions,
} from '@/lib/mock/results'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Download, FileBarChart, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

export default function ResultsPage(): ReactNode {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin' || user?.role === 'teacher'

  // 学生视角筛选状态
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [searchKeyword, setSearchKeyword] = useState('')

  // 管理员视角筛选状态
  const [classFilter, setClassFilter] = useState<string>('all')

  // 筛选学生成绩记录
  const filteredResults = useMemo(() => {
    let result = mockResults

    if (categoryFilter !== 'all') {
      result = result.filter(r => r.category === categoryFilter)
    }

    if (levelFilter !== 'all') {
      result = result.filter(r => r.level === levelFilter)
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase()
      result = result.filter(r =>
        r.examTitle.toLowerCase().includes(keyword) ||
        r.examDescription?.toLowerCase().includes(keyword) ||
        r.category.toLowerCase().includes(keyword)
      )
    }

    return result
  }, [categoryFilter, levelFilter, searchKeyword])

  // 筛选班级成绩记录
  const filteredClassResults = useMemo(() => {
    if (classFilter === 'all') {
      return mockClassResults
    }
    return mockClassResults.filter(r => r.classId === classFilter)
  }, [classFilter])

  // 学生统计数据
  const studentStats = useMemo(() => {
    if (filteredResults.length === 0) {
      return mockResultStats
    }
    const scores = filteredResults.map(r => r.score)
    return {
      ...mockResultStats,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      totalExams: filteredResults.length,
    }
  }, [filteredResults])

  // 管理员视角
  if (isAdmin) {
    return (
      <PageWrapper className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-foreground">成绩管理</h1>
            <p className="text-muted-foreground mt-1">
              查看各班级考试成绩统计与分布
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出报表
          </Button>
        </div>

        {/* 全局统计卡片 */}
        <AdminResultStats
          totalClasses={mockGlobalStats.totalClasses}
          totalStudents={mockGlobalStats.totalStudents}
          totalExams={mockGlobalStats.totalExams}
          overallAverage={mockGlobalStats.overallAverage}
          overallPassRate={mockGlobalStats.overallPassRate}
        />

        {/* 班级筛选 */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0">
            <Users className="w-4 h-4 inline mr-1" />
            班级：
          </span>
          {classOptions.map((option) => (
            <Button
              key={option.value}
              variant={classFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setClassFilter(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* 班级成绩列表 */}
        {filteredClassResults.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
                <FileBarChart className="w-5 h-5 text-muted-foreground" />
                班级成绩统计
              </h2>
              <span className="text-sm text-muted-foreground">
                共 {filteredClassResults.length} 条记录
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {filteredClassResults.map((result, index) => (
                <ClassResultCard key={`${result.classId}-${result.examId}-${index}`} result={result} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">暂无成绩数据</h3>
            <p className="text-sm text-muted-foreground mt-1">
              选择其他班级查看
            </p>
          </div>
        )}
      </PageWrapper>
    )
  }

  // 学生视角
  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">成绩查询</h1>
          <p className="text-muted-foreground mt-1">
            查看考试成绩历史、趋势分析与排名
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          导出成绩单
        </Button>
      </div>

      {/* 成绩统计卡片 */}
      {mockResults.length > 0 && (
        <ResultStatsCards stats={studentStats} />
      )}

      {/* 成绩趋势图 */}
      {mockResults.length > 0 && (
        <ScoreTrendChart data={mockTrendData} />
      )}

      {/* 筛选器 */}
      {mockResults.length > 0 && (
        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索考试名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 科目筛选 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">科目：</span>
            {categoryOptions.map((option) => (
              <Button
                key={option.value}
                variant={categoryFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* 等级筛选 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground shrink-0">等级：</span>
            {levelOptions.map((option) => (
              <Button
                key={option.value}
                variant={levelFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setLevelFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 成绩记录列表标题 */}
      {mockResults.length > 0 && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-muted-foreground" />
            成绩记录
          </h2>
          <span className="text-sm text-muted-foreground">
            共 {filteredResults.length} 条记录
          </span>
        </div>
      )}

      {/* 成绩记录列表 - 学生视角显示排名 */}
      {mockResults.length === 0 ? (
        <EmptyResults />
      ) : filteredResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">未找到匹配的成绩</h3>
          <p className="text-sm text-muted-foreground mt-1">
            尝试调整筛选条件
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {filteredResults.map((result) => (
            <ResultCard key={result.id} result={result} showRank={true} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
