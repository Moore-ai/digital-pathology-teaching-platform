'use client'

import type { ReactNode } from 'react'
import { PageWrapper } from '@/components/layout'
import { KnowledgeRadarChart, LearningTrajectory, ExamScoreChart } from '@/components/features/analytics'
import { Button } from '@/components/ui/button'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material'
import {
  Download,
  BookOpen,
  Award,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

export default function ProgressPage(): ReactNode {
  // 模拟学习数据
  const progressData = {
    overallProgress: 58,
    totalCourses: 12,
    completedCourses: 7,
    totalExams: 15,
    averageScore: 82,
    studyHours: 240,
  }

  // 薄弱知识点
  const weakPoints = [
    { name: '肝脏病理', accuracy: 65, category: '消化系统' },
    { name: '肺腺癌分类', accuracy: 58, category: '呼吸系统' },
    { name: '乳腺癌分级', accuracy: 62, category: '乳腺' },
  ]

  // 最近学习
  const recentLearning = [
    { course: '消化病理学', chapter: '肝脏疾病', progress: 75, time: '2小时前' },
    { course: '呼吸病理学', chapter: '肺肿瘤', progress: 45, time: '昨天' },
    { course: '乳腺病理学', chapter: '乳腺癌', progress: 90, time: '2天前' },
  ]

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
            学习进度
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>
            查看您的学习数据统计和知识点掌握情况
          </Typography>
        </Box>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          导出报告
        </Button>
      </Stack>

      {/* 总体进度卡片 */}
      <Paper
        sx={{
          p: 3,
          background: 'linear-gradient(to right, color-mix(in srgb, var(--primary) 5%, transparent), color-mix(in srgb, var(--secondary) 5%, transparent))',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={3}>
          {/* 圆形进度 */}
          <Box sx={{ position: 'relative', width: 128, height: 128 }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="var(--border)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="var(--secondary)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progressData.overallProgress * 3.52} 352`}
              />
            </svg>
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                  {progressData.overallProgress}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                  总进度
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 统计数据 */}
          <Stack direction="row" spacing={4} sx={{ flex: 1 }} useFlexGap flexWrap="wrap" justifyContent="center">
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <BookOpen className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                {progressData.completedCourses}/{progressData.totalCourses}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                完成课程
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Award className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                {progressData.averageScore}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                平均成绩
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Clock className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                {progressData.studyHours}h
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                累计学习
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', minWidth: 80 }}>
              <Target className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--secondary)' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--foreground)' }}>
                {progressData.totalExams}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                参加考试
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* 图表区域 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        <KnowledgeRadarChart />
        <LearningTrajectory />
      </Box>

      {/* 考试成绩趋势 */}
      <ExamScoreChart />

      {/* 薄弱知识点和最近学习 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        {/* 薄弱知识点 */}
        <Paper sx={{ p: 0, bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AlertCircle className="w-4 h-4" style={{ color: 'var(--warning)' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                薄弱知识点
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
              需要加强学习的知识点
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {weakPoints.map((point, index) => (
                <Box key={index}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                        {point.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={point.category}
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: '0.75rem',
                          color: 'var(--foreground)',
                          borderColor: 'var(--border)',
                        }}
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                      {point.accuracy}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={point.accuracy}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'var(--muted)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: 'var(--secondary)',
                      },
                    }}
                  />
                </Box>
              ))}
            </Stack>
            <Button variant="outline" className="w-full mt-4">
              查看详细分析
            </Button>
          </Box>
        </Paper>

        {/* 最近学习 */}
        <Paper sx={{ p: 0, bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                最近学习
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
              最近学习记录
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={2}>
              {recentLearning.map((item, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    bgcolor: 'color-mix(in srgb, var(--muted) 30%, transparent)',
                    borderColor: 'transparent',
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                        {item.course}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                        {item.chapter}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--secondary)' }}>
                        {item.progress}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                        {item.time}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
            <Button variant="outline" className="w-full mt-4">
              查看全部记录
            </Button>
          </Box>
        </Paper>
      </Box>
    </PageWrapper>
  )
}
