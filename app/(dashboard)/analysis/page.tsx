'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  FileText,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Network,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  Lock,
} from 'lucide-react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
} from '@mui/material'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useAuthStore } from '@/stores/authStore'

export default function AnalysisCenterPage(): ReactNode {
  const { user } = useAuthStore()
  const router = useRouter()

  const {
    fetchAnalysisOverview,
    fetchKnowledgeData,
    fetchErrorDiagnoses,
    analysisOverview,
    masterySummary,
    errorTypeStats,
    knowledgeGraph,
  } = useAnalysisStore()

  const [isLoading, setIsLoading] = useState(true)

  const isStudent = user?.role === 'student'

  useEffect(() => {
    if (!isStudent) return

    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchAnalysisOverview(),
        fetchKnowledgeData(),
        fetchErrorDiagnoses(),
      ])
      setIsLoading(false)
    }
    loadData()
  }, [fetchAnalysisOverview, fetchKnowledgeData, fetchErrorDiagnoses, isStudent])

  if (!isStudent && user) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[60vh]">
        <Paper sx={{ maxWidth: 400, width: '100%', p: 4, textAlign: 'center', bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
          <Lock className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'var(--foreground)' }}>功能受限</Typography>
          <Typography sx={{ mb: 3, color: 'var(--muted-foreground)' }}>
            智能分析功能仅对学生开放，教师和管理员暂无权限访问此功能。
          </Typography>
          <Button onClick={() => router.push('/')}>返回首页</Button>
        </Paper>
      </PageWrapper>
    )
  }

  const trendData = analysisOverview?.learningTrend || []
  const lastTrend = trendData[trendData.length - 1]
  const firstTrend = trendData[0]
  const trendChange = lastTrend && firstTrend
    ? lastTrend.correctRate - firstTrend.correctRate
    : 0

  const weakPoints = knowledgeGraph.nodes.filter(n => n.status === 'weak')

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>智能分析中心</Typography>
        <Typography sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>AI驱动的学习诊断与知识探索</Typography>
      </Box>

      {/* 智能问答入口 */}
      <Paper
        sx={{
          p: 3,
          background: 'linear-gradient(to right, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--secondary) 10%, transparent))',
          border: '1px solid',
          borderColor: 'color-mix(in srgb, var(--primary) 20%, transparent)',
          bgcolor: 'transparent',
          color: 'var(--foreground)',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Paper
              elevation={0}
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              }}
            >
              <MessageSquare className="w-6 h-6" style={{ color: 'var(--primary)' }} />
            </Paper>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>智能问答助手</Typography>
                <Chip
                  size="small"
                  label={
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Sparkles className="w-3 h-3" style={{ color: 'var(--secondary-foreground)' }} />
                      <span style={{ color: 'var(--secondary-foreground)' }}>RAG</span>
                    </Stack>
                  }
                  sx={{ bgcolor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                />
              </Stack>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>
                &quot;肝细胞癌的典型病理特征有哪些？&quot; —— 基于RAG技术，为您提供精准的知识解答
              </Typography>
            </Box>
          </Stack>
          <Link href="/analysis/assistant">
            <Button className="gap-2">
              进入
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </Stack>
      </Paper>

      {/* 功能卡片网格 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* 知识点分析 */}
        <Paper
          sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s',
            bgcolor: 'var(--card)',
            color: 'var(--foreground)',
            '&:hover': { boxShadow: 4 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Paper
              elevation={0}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
              }}
            >
              <Network className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
            </Paper>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>知识点分析</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>知识点掌握度评估与图谱可视化</Typography>
            </Box>
          </Stack>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {isLoading ? (
              <Box sx={{ height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                  <Box sx={{ position: 'relative', width: 128, height: 128 }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                      <polygon points="50,10 90,35 90,75 50,100 10,75 10,35" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.3 }} />
                      <polygon points="50,25 75,42 75,68 50,85 25,68 25,42" fill="none" stroke="currentColor" strokeWidth="1" style={{ opacity: 0.5 }} />
                      <polygon points="50,40 60,48 60,62 50,70 40,62 40,48" fill="var(--secondary)" fillOpacity="0.2" stroke="var(--secondary)" strokeWidth="2" />
                    </svg>
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--secondary)' }}>
                          {masterySummary.averageMastery}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>掌握度</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                    掌握度: <Box component="span" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>{masterySummary.averageMastery}%</Box>
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                    薄弱点: <Box component="span" sx={{ fontWeight: 500, color: 'var(--error)' }}>{weakPoints.length}个</Box>
                  </Typography>
                </Stack>
              </>
            )}
          </Box>
          <Box sx={{ pt: 2, mt: 'auto' }}>
            <Link href="/analysis/knowledge" style={{ display: 'block' }}>
              <Button variant="outline" style={{ width: '100%' }}>查看详情</Button>
            </Link>
          </Box>
        </Paper>

        {/* 错题诊断 */}
        <Paper
          sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s',
            bgcolor: 'var(--card)',
            color: 'var(--foreground)',
            '&:hover': { boxShadow: 4 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Paper
              elevation={0}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'color-mix(in srgb, var(--error) 10%, transparent)',
              }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} />
            </Paper>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>错题诊断</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>错误原因分析与针对性学习建议</Typography>
            </Box>
          </Stack>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {isLoading ? (
              <Box sx={{ height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
              </Box>
            ) : (
              <Box sx={{ py: 1 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>待分析错题</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--foreground)' }}>
                    {analysisOverview?.errorOverview.totalErrors || 0}道
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  {errorTypeStats.map((stat) => (
                    <Stack key={stat.type} direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>{stat.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: stat.percentage > 40 ? 'var(--error)' : 'var(--foreground)' }}>
                        {stat.percentage}%
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
          <Box sx={{ pt: 2, mt: 'auto' }}>
            <Link href="/analysis/errors" style={{ display: 'block' }}>
              <Button variant="outline" style={{ width: '100%' }}>开始分析</Button>
            </Link>
          </Box>
        </Paper>

        {/* 学习趋势 */}
        <Paper
          sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s',
            bgcolor: 'var(--card)',
            color: 'var(--foreground)',
            '&:hover': { boxShadow: 4 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Paper
              elevation={0}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'color-mix(in srgb, var(--success) 10%, transparent)',
              }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--success)' }} />
            </Paper>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>学习趋势</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>近期学习数据与进步情况</Typography>
            </Box>
          </Stack>
          <Box sx={{ flex: 1 }}>
            {isLoading ? (
              <Box sx={{ height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ py: 2 }}>
                  <Box sx={{ height: 64, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                    {trendData.slice(-7).map((day) => (
                      <Box
                        key={day.date}
                        sx={{
                          flex: 1,
                          bgcolor: 'color-mix(in srgb, var(--success) 20%, transparent)',
                          borderRadius: '4px 4px 0 0',
                          height: `${day.correctRate}%`,
                        }}
                      />
                    ))}
                  </Box>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
                    <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                    <Typography variant="body2" sx={{ color: 'var(--foreground)' }}>
                      近7日正确率
                      <Box component="span" sx={{ fontWeight: 500, ml: 0.5, color: trendChange >= 0 ? 'var(--success)' : 'var(--error)' }}>
                        {trendChange >= 0 ? '+' : ''}{trendChange}%
                      </Box>
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>持续进步中 🎉</Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>

        {/* 我的成绩 */}
        <Paper
          sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s',
            bgcolor: 'var(--card)',
            color: 'var(--foreground)',
            '&:hover': { boxShadow: 4 },
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Paper
              elevation={0}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
              }}
            >
              <FileText className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            </Paper>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>我的成绩</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>考试记录与成绩查询</Typography>
            </Box>
          </Stack>
          <Box sx={{ flex: 1, py: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>最近考试</Typography>
              <Chip size="small" variant="outlined" label="已完成 5 次" sx={{ color: 'var(--foreground)', borderColor: 'var(--border)', '& .MuiChip-label': { color: 'var(--foreground)' } }} />
            </Stack>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--foreground)' }}>82</Typography>
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>平均分</Typography>
              </Paper>
              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--success)' }}>96</Typography>
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>最高分</Typography>
              </Paper>
            </Box>
          </Box>
          <Box sx={{ pt: 1 }}>
            <Link href="/exams/results" style={{ display: 'block' }}>
              <Button variant="outline" style={{ width: '100%' }}>查看成绩</Button>
            </Link>
          </Box>
        </Paper>
      </Box>

      {/* AI 学习建议 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Brain className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>AI 学习建议</Typography>
        </Stack>
        {isLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
          </Box>
        ) : weakPoints.length > 0 ? (
          <Stack spacing={2}>
            {weakPoints.slice(0, 2).map((point, index) => (
              <Paper key={point.id} variant="outlined" sx={{ p: 2, bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
                <Stack direction="row" alignItems="flex-start" spacing={1.5}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      bgcolor: index === 0 ? 'color-mix(in srgb, var(--error) 10%, transparent)' : 'color-mix(in srgb, var(--warning) 10%, transparent)',
                      color: index === 0 ? 'var(--error)' : 'var(--warning)',
                    }}
                  >
                    {index + 1}
                  </Paper>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>{point.name}</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>
                      掌握度: {point.masteryLevel}% · {point.category}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      {point.relatedResources.courses.length > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Clock className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                            {point.relatedResources.courses.length} 门相关课程
                          </Typography>
                        </Stack>
                      )}
                      {point.relatedResources.slices.length > 0 && (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <AlertCircle className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                            {point.relatedResources.slices.length} 个相关切片
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                  <Link href={`/analysis/knowledge?point=${point.id}`}>
                    <Button variant="ghost" size="sm">开始学习</Button>
                  </Link>
                </Stack>
              </Paper>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/analysis/knowledge">
                <Button variant="outline">查看完整学习建议</Button>
              </Link>
            </Box>
          </Stack>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CheckCircle className="w-12 h-12" style={{ color: 'var(--success)' }} />
            <Typography sx={{ mt: 1, color: 'var(--muted-foreground)' }}>暂无明显薄弱知识点，继续保持！</Typography>
          </Box>
        )}
      </Paper>
    </PageWrapper>
  )
}
