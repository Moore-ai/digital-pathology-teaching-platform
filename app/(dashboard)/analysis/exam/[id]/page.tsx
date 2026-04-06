'use client'

import type { ReactNode } from 'react'
import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  BarChart3,
  Target,
  AlertTriangle,
  Brain,
  Edit,
  FileText,
  Eye,
} from 'lucide-react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material'
import { useAnalysisStore } from '@/stores/analysisStore'
import { useAuthStore } from '@/stores/authStore'
import type { QuestionMetrics } from '@/types/analysis'

interface ExamAnalysisPageProps {
  params: Promise<{ id: string }>
}

const qualityConfig = {
  excellent: { label: '优秀', color: 'var(--success)', bgColor: 'color-mix(in srgb, var(--success) 10%, transparent)' },
  good: { label: '良好', color: 'var(--info)', bgColor: 'color-mix(in srgb, var(--info) 10%, transparent)' },
  needs_improvement: { label: '需改进', color: 'var(--warning)', bgColor: 'color-mix(in srgb, var(--warning) 10%, transparent)' },
  problematic: { label: '有问题', color: 'var(--error)', bgColor: 'color-mix(in srgb, var(--error) 10%, transparent)' },
}

export default function ExamAnalysisPage({ params }: ExamAnalysisPageProps): ReactNode {
  const { id } = use(params)
  const { user } = useAuthStore()
  const {
    examAnalysisResult,
    questionMetrics,
    fetchExamAnalysis,
  } = useAnalysisStore()

  const [isLoading, setIsLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>('all')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchExamAnalysis(id)
      setIsLoading(false)
    }
    loadData()
  }, [id, fetchExamAnalysis])

  const filteredQuestions = filterType === 'all'
    ? questionMetrics
    : filterType === 'attention'
      ? questionMetrics.filter(q => q.needsAttention)
      : questionMetrics.filter(q => q.aiAssessment.quality === filterType)

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin'

  if (!isTeacher) {
    return (
      <PageWrapper className="flex items-center justify-center h-[50vh]">
        <Box sx={{ textAlign: 'center' }}>
          <AlertTriangle className="w-12 h-12" style={{ color: 'var(--warning)' }} />
          <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600, color: 'var(--foreground)' }}>权限不足</Typography>
          <Typography sx={{ mb: 2, color: 'var(--muted-foreground)' }}>试题分析功能仅对教师和管理员开放</Typography>
          <Link href="/analysis">
            <Button>返回分析中心</Button>
          </Link>
        </Box>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 顶部导航 */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Link href="/analysis" style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s' }}>
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
        </Link>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>试题分析</Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
            {examAnalysisResult?.examName || '考试题目质量分析'}
          </Typography>
        </Box>
      </Stack>

      {/* 试卷整体质量报告 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <BarChart3 className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>试卷整体质量报告</Typography>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
          </Box>
        ) : examAnalysisResult ? (
          <>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <MetricCard
                label="难度系数"
                value={examAnalysisResult.overallMetrics.difficulty.toFixed(2)}
                status={examAnalysisResult.overallMetrics.difficulty < 0.4 ? '偏高' :
                        examAnalysisResult.overallMetrics.difficulty > 0.7 ? '偏低' : '适中'}
                statusColor={examAnalysisResult.overallMetrics.difficulty < 0.4 ? 'var(--error)' :
                             examAnalysisResult.overallMetrics.difficulty > 0.7 ? 'var(--warning)' : 'var(--success)'}
              />
              <MetricCard
                label="区分度"
                value={examAnalysisResult.overallMetrics.discrimination.toFixed(2)}
                status={examAnalysisResult.overallMetrics.discrimination >= 0.4 ? '良好' :
                        examAnalysisResult.overallMetrics.discrimination >= 0.3 ? '合格' : '较低'}
                statusColor={examAnalysisResult.overallMetrics.discrimination >= 0.4 ? 'var(--success)' :
                             examAnalysisResult.overallMetrics.discrimination >= 0.3 ? 'var(--warning)' : 'var(--error)'}
              />
              <MetricCard
                label="信度"
                value={examAnalysisResult.overallMetrics.reliability.toFixed(2)}
                status={examAnalysisResult.overallMetrics.reliability >= 0.7 ? '可信' : '一般'}
                statusColor={examAnalysisResult.overallMetrics.reliability >= 0.7 ? 'var(--success)' : 'var(--warning)'}
              />
            </Stack>

            <Box sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>知识点覆盖</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                  覆盖率 {(examAnalysisResult.overallMetrics.knowledgeCoverage * 100).toFixed(0)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={examAnalysisResult.overallMetrics.knowledgeCoverage * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'var(--muted)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'var(--secondary)',
                    borderRadius: 4,
                  },
                }}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                  涉及知识点: {examAnalysisResult.knowledgeCoverage.covered.length}个
                </Typography>
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                  未覆盖: {examAnalysisResult.knowledgeCoverage.uncovered.length}个
                </Typography>
              </Stack>
            </Box>
          </>
        ) : null}
      </Paper>

      {/* 题目详细分析 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Target className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>题目详细分析</Typography>
          </Stack>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{ color: 'var(--foreground)', '.MuiSelect-icon': { color: 'var(--muted-foreground)' } }}
              MenuProps={{
                PaperProps: { sx: { bgcolor: 'var(--card)' } }
              }}
            >
              <MenuItem value="all" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>全部题目</MenuItem>
              <MenuItem value="attention" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>需关注</MenuItem>
              <MenuItem value="excellent" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>优秀</MenuItem>
              <MenuItem value="good" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>良好</MenuItem>
              <MenuItem value="needs_improvement" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>需改进</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 500, overflow: 'auto' }}>
            <Stack spacing={2}>
              {filteredQuestions.map((question) => (
                <QuestionAnalysisCard key={question.questionId} question={question} />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* AI 建议 */}
      {examAnalysisResult?.aiSuggestions && examAnalysisResult.aiSuggestions.length > 0 && (
        <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Brain className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>AI 优化建议</Typography>
          </Stack>
          <Stack spacing={1}>
            {examAnalysisResult.aiSuggestions.map((suggestion, index) => (
              <Stack key={index} direction="row" alignItems="flex-start" spacing={1}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'var(--secondary)',
                    mt: 0.75,
                  }}
                />
                <Typography variant="body2" sx={{ color: 'var(--foreground)' }}>{suggestion}</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}

      {/* 返回按钮 */}
      <Box>
        <Link href="/analysis">
          <Button variant="outline">返回分析中心</Button>
        </Link>
      </Box>
    </PageWrapper>
  )
}

// 度量卡片组件
function MetricCard({
  label,
  value,
  status,
  statusColor,
}: {
  label: string
  value: string
  status: string
  statusColor: string
}) {
  return (
    <Paper variant="outlined" sx={{ flex: 1, textAlign: 'center', p: 2, bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--foreground)' }}>{value}</Typography>
      <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>{label}</Typography>
      <Typography variant="caption" sx={{ fontWeight: 500, color: statusColor, mt: 0.5, display: 'block' }}>
        {status}
      </Typography>
    </Paper>
  )
}

// 题目分析卡片组件
function QuestionAnalysisCard({ question }: { question: QuestionMetrics }) {
  const config = qualityConfig[question.aiAssessment.quality]

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderColor: question.needsAttention ? 'var(--warning)' : 'var(--border)',
        bgcolor: question.needsAttention ? 'color-mix(in srgb, var(--warning) 5%, transparent)' : 'var(--card)',
      }}
    >
      {/* 头部 */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>第{question.questionNumber}题</Typography>
            <Chip
              size="small"
              variant="outlined"
              label={
                question.questionType === 'single' ? '单选题' :
                question.questionType === 'multiple' ? '多选题' :
                question.questionType === 'judgment' ? '判断题' : '简答题'
              }
              sx={{ color: 'var(--foreground)', borderColor: 'var(--border)', '& .MuiChip-label': { color: 'var(--foreground)' } }}
            />
            {question.needsAttention && (
              <Chip
                size="small"
                icon={<AlertTriangle className="w-3 h-3" style={{ color: 'var(--warning)' }} />}
                label="需关注"
                sx={{ bgcolor: 'color-mix(in srgb, var(--warning) 10%, transparent)', color: 'var(--warning)' }}
              />
            )}
          </Stack>
          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {question.questionContent}
          </Typography>
        </Box>
        <Chip size="small" label={config.label} sx={{ bgcolor: config.bgColor, color: config.color }} />
      </Stack>

      {/* 度量数据 */}
      <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
        <Paper variant="outlined" sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>{question.correctRate}%</Typography>
          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>正确率</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>{question.difficulty.toFixed(2)}</Typography>
          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>难度</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>{question.discrimination.toFixed(2)}</Typography>
          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>区分度</Typography>
        </Paper>
      </Stack>

      {/* 关联知识点 */}
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--muted-foreground)' }}>
          关联知识点
        </Typography>
        <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
          {question.knowledgePoints.map((kp) => (
            <Chip
              key={kp.id}
              size="small"
              variant="outlined"
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {kp.isCore && <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'var(--primary)' }} />}
                  <span style={{ color: 'var(--foreground)' }}>{kp.name}</span>
                </Stack>
              }
              sx={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
            />
          ))}
        </Stack>
      </Box>

      {/* AI 分析 */}
      {question.aiAssessment.issues.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            mb: 1.5,
            p: 1.5,
            bgcolor: 'color-mix(in srgb, var(--warning) 5%, transparent)',
            borderColor: 'color-mix(in srgb, var(--warning) 30%, transparent)',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 500, color: 'var(--warning)', mb: 0.5, display: 'block' }}>
            问题诊断
          </Typography>
          <Stack spacing={0.5}>
            {question.aiAssessment.issues.map((issue, i) => (
              <Typography key={i} variant="caption" sx={{ color: 'var(--warning)' }}>• {issue}</Typography>
            ))}
          </Stack>
        </Paper>
      )}

      {/* AI 建议 */}
      {question.aiAssessment.suggestions.length > 0 && (
        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
            <Brain className="w-3 h-3" style={{ color: 'var(--primary)' }} />
            <Typography variant="caption" sx={{ fontWeight: 500, color: 'var(--muted-foreground)' }}>AI 建议</Typography>
          </Stack>
          <Stack spacing={0.5}>
            {question.aiAssessment.suggestions.map((s, i) => (
              <Typography key={i} variant="caption" sx={{ color: 'var(--foreground)' }}>• {s}</Typography>
            ))}
          </Stack>
        </Paper>
      )}

      {/* 操作按钮 */}
      <Stack direction="row" spacing={1} sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'var(--border)' }}>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Eye className="w-3 h-3" />
          查看答题分布
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5">
          <Edit className="w-3 h-3" />
          编辑题目
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5">
          <FileText className="w-3 h-3" />
          查看类似题目
        </Button>
      </Stack>

      {/* 答题分布 */}
      {question.answerDistribution.length > 0 && (
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid', borderColor: 'var(--border)' }}>
          <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'var(--muted-foreground)' }}>
            选项分布
          </Typography>
          <Stack spacing={0.5}>
            {question.answerDistribution.map((dist) => (
              <Stack key={dist.option} direction="row" alignItems="center" spacing={1}>
                <Typography variant="caption" sx={{ fontWeight: 500, width: 24, color: 'var(--foreground)' }}>{dist.option}</Typography>
                <Box sx={{ flex: 1, height: 8, bgcolor: 'var(--muted)', borderRadius: 1, overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${dist.percentage}%`, bgcolor: 'var(--secondary)' }} />
                </Box>
                <Typography variant="caption" sx={{ width: 40, textAlign: 'right', color: 'var(--muted-foreground)' }}>
                  {dist.percentage}%
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  )
}
