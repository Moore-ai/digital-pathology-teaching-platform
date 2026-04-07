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
import { TextField, InputAdornment, Box, Typography, Stack, Chip } from '@mui/material'
import { Button } from '@/components/ui/button'
import { Search, Download, FileBarChart, Users } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

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
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
              成绩管理
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>
              查看各班级考试成绩统计与分布
            </Typography>
          </Box>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            导出报表
          </Button>
        </Stack>

        {/* 全局统计卡片 */}
        <AdminResultStats
          totalClasses={mockGlobalStats.totalClasses}
          totalStudents={mockGlobalStats.totalStudents}
          totalExams={mockGlobalStats.totalExams}
          overallAverage={mockGlobalStats.overallAverage}
          overallPassRate={mockGlobalStats.overallPassRate}
        />

        {/* 班级筛选 */}
        <Stack direction="row" alignItems="center" spacing={1} useFlexGap flexWrap="wrap">
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Users className="w-4 h-4" />
            班级：
          </Typography>
          {classOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onClick={() => setClassFilter(option.value)}
              variant={classFilter === option.value ? 'filled' : 'outlined'}
              size="small"
              sx={{
                cursor: 'pointer',
                ...(classFilter === option.value
                  ? {
                      bgcolor: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      '& .MuiChip-label': { color: 'var(--primary-foreground)' },
                    }
                  : {
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      '&:hover': { bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' },
                    }),
              }}
            />
          ))}
        </Stack>

        {/* 班级成绩列表 */}
        {filteredClassResults.length > 0 ? (
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FileBarChart className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                  班级成绩统计
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                共 {filteredClassResults.length} 条记录
              </Typography>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3 }}>
              {filteredClassResults.map((result, index) => (
                <ClassResultCard key={`${result.classId}-${result.examId}-${index}`} result={result} />
              ))}
            </Box>
          </Box>
        ) : (
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 8, textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Search className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
              暂无成绩数据
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              选择其他班级查看
            </Typography>
          </Stack>
        )}
      </PageWrapper>
    )
  }

  // 学生视角
  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
            成绩查询
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>
            查看考试成绩历史、趋势分析与排名
          </Typography>
        </Box>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          导出成绩单
        </Button>
      </Stack>

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 搜索框 */}
          <Box sx={{ width: { xs: '100%', sm: 320 } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="搜索考试名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'var(--background)',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&:hover fieldset': { borderColor: 'var(--border)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
                },
                '& .MuiInputBase-input': { color: 'var(--foreground)' },
                '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
              }}
            />
          </Box>

          {/* 科目筛选 */}
          <Stack direction="row" alignItems="center" spacing={1} useFlexGap flexWrap="wrap">
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              科目：
            </Typography>
            {categoryOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => setCategoryFilter(option.value)}
                variant={categoryFilter === option.value ? 'filled' : 'outlined'}
                size="small"
                sx={{
                  cursor: 'pointer',
                  ...(categoryFilter === option.value
                    ? {
                        bgcolor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        '& .MuiChip-label': { color: 'var(--primary-foreground)' },
                      }
                    : {
                        color: 'var(--foreground)',
                        borderColor: 'var(--border)',
                        '&:hover': { bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' },
                      }),
                }}
              />
            ))}
          </Stack>

          {/* 等级筛选 */}
          <Stack direction="row" alignItems="center" spacing={1} useFlexGap flexWrap="wrap">
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              等级：
            </Typography>
            {levelOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                onClick={() => setLevelFilter(option.value)}
                variant={levelFilter === option.value ? 'filled' : 'outlined'}
                size="small"
                sx={{
                  cursor: 'pointer',
                  ...(levelFilter === option.value
                    ? {
                        bgcolor: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                        '& .MuiChip-label': { color: 'var(--primary-foreground)' },
                      }
                    : {
                        color: 'var(--foreground)',
                        borderColor: 'var(--border)',
                        '&:hover': { bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' },
                      }),
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {/* 成绩记录列表标题 */}
      {mockResults.length > 0 && (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <FileBarChart className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
              成绩记录
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
            共 {filteredResults.length} 条记录
          </Typography>
        </Stack>
      )}

      {/* 成绩记录列表 - 学生视角显示排名 */}
      {mockResults.length === 0 ? (
        <EmptyResults />
      ) : filteredResults.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 8, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Search className="w-8 h-8" style={{ color: 'var(--muted-foreground)' }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
            未找到匹配的成绩
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
            尝试调整筛选条件
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
          {filteredResults.map((result) => (
            <ResultCard key={result.id} result={result} showRank={true} />
          ))}
        </Box>
      )}
    </PageWrapper>
  )
}
