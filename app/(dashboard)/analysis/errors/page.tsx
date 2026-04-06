'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  AlertTriangle,
  Brain,
  BookOpen,
  Video,
  Microscope,
  FileQuestion,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Lightbulb,
} from 'lucide-react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Divider,
  Collapse,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material'
import { useAnalysisStore } from '@/stores/analysisStore'
import type { ErrorDiagnosis } from '@/types/analysis'

const errorTypeConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  concept_confusion: { label: '概念混淆', color: 'var(--error)', bgColor: 'color-mix(in srgb, var(--error) 10%, transparent)' },
  detail_omission: { label: '细节遗漏', color: 'var(--warning)', bgColor: 'color-mix(in srgb, var(--warning) 10%, transparent)' },
  reasoning_error: { label: '推理错误', color: 'var(--annotation)', bgColor: 'color-mix(in srgb, var(--annotation) 10%, transparent)' },
}

export default function ErrorDiagnosisPage(): ReactNode {
  const {
    errorDiagnoses,
    errorTypeStats,
    fetchErrorDiagnoses,
  } = useAnalysisStore()

  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [expandedError, setExpandedError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchErrorDiagnoses()
      setIsLoading(false)
    }
    loadData()
  }, [fetchErrorDiagnoses])

  const filteredErrors = selectedType === 'all'
    ? errorDiagnoses
    : errorDiagnoses.filter(e => e.errorType === selectedType)

  const toggleExpand = (errorId: string) => {
    setExpandedError(expandedError === errorId ? null : errorId)
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 顶部导航 */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Link href="/analysis" style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s' }}>
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
        </Link>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>错题诊断</Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>AI智能分析错误原因，推荐针对性学习方案</Typography>
        </Box>
      </Stack>

      {/* 错误类型统计 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Target className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>错误类型分析</Typography>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
          </Box>
        ) : (
          <Stack direction="row" spacing={2}>
            {errorTypeStats.map((stat) => (
              <Paper
                key={stat.type}
                variant="outlined"
                sx={{
                  flex: 1,
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderColor: selectedType === stat.type ? 'var(--primary)' : 'var(--border)',
                  bgcolor: selectedType === stat.type ? 'color-mix(in srgb, var(--primary) 8%, transparent)' : 'transparent',
                  '&:hover': { borderColor: 'var(--primary)' },
                }}
                onClick={() => setSelectedType(selectedType === stat.type ? 'all' : stat.type)}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: errorTypeConfig[stat.type]?.color }}>
                    {stat.percentage}%
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>{stat.label}</Typography>
                  <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>{stat.count}题</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Paper>

      {/* 错题详情列表 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--error)' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>错题详情</Typography>
          </Stack>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              sx={{ color: 'var(--foreground)', '.MuiSelect-icon': { color: 'var(--muted-foreground)' } }}
              MenuProps={{
                PaperProps: { sx: { bgcolor: 'var(--card)' } }
              }}
            >
              <MenuItem value="all" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>全部类型</MenuItem>
              <MenuItem value="concept_confusion" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>概念混淆</MenuItem>
              <MenuItem value="detail_omission" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>细节遗漏</MenuItem>
              <MenuItem value="reasoning_error" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>推理错误</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
          </Box>
        ) : filteredErrors.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CheckCircle className="w-12 h-12" style={{ color: 'var(--success)' }} />
            <Typography sx={{ mt: 1, color: 'var(--muted-foreground)' }}>暂无此类错题</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Stack spacing={2}>
              {filteredErrors.map((error) => (
                <ErrorCard
                  key={error.id}
                  error={error}
                  isExpanded={expandedError === error.id}
                  onToggle={() => toggleExpand(error.id)}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* 推荐学习资源 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Lightbulb className="w-5 h-5" style={{ color: 'var(--warning)' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>推荐学习资源</Typography>
        </Stack>
        <Typography variant="body2" sx={{ mb: 2, color: 'var(--muted-foreground)' }}>
          基于错题分析，为您推荐以下学习内容
        </Typography>

        {errorDiagnoses.length > 0 ? (
          <Stack spacing={1.5}>
            {errorDiagnoses[0].recommendedResources.map((resource, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  borderColor: 'var(--border)',
                  bgcolor: 'var(--muted)',
                  '&:hover': { borderColor: 'var(--primary)' },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: resource.type === 'course' ? 'color-mix(in srgb, var(--info) 10%, transparent)' :
                               resource.type === 'slice' ? 'color-mix(in srgb, var(--secondary) 10%, transparent)' :
                               'color-mix(in srgb, var(--warning) 10%, transparent)',
                    }}
                  >
                    {resource.type === 'course' && <Video className="w-5 h-5" style={{ color: 'var(--info)' }} />}
                    {resource.type === 'slice' && <Microscope className="w-5 h-5" style={{ color: 'var(--secondary)' }} />}
                    {resource.type === 'exercise' && <FileQuestion className="w-5 h-5" style={{ color: 'var(--warning)' }} />}
                  </Paper>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {resource.title}
                      </Typography>
                      {resource.estimatedTime && (
                        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                          {resource.estimatedTime}分钟
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {resource.description}
                    </Typography>
                  </Box>
                  <Button variant="ghost" size="sm">
                    {resource.type === 'course' && '观看'}
                    {resource.type === 'slice' && '查看'}
                    {resource.type === 'exercise' && '练习'}
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>完成更多练习后，将为您推荐个性化学习资源</Typography>
          </Box>
        )}
      </Paper>
    </PageWrapper>
  )
}

// 错题卡片组件
function ErrorCard({
  error,
  isExpanded,
  onToggle,
}: {
  error: ErrorDiagnosis
  isExpanded: boolean
  onToggle: () => void
}) {
  const config = errorTypeConfig[error.errorType]

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', borderColor: 'var(--border)', bgcolor: 'var(--card)' }}>
      <Box
        sx={{
          p: 2,
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          '&:hover': { bgcolor: 'var(--muted)' },
        }}
        onClick={onToggle}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack direction="row" alignItems="flex-start" spacing={1.5}>
            <Chip
              size="small"
              label={config.label}
              sx={{ bgcolor: config.bgColor, color: config.color }}
            />
            <Box>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>{error.examName}</Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  mt: 0.5,
                  color: 'var(--foreground)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {error.questionContent.split('\n')[0]}
              </Typography>
            </Box>
          </Stack>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
          )}
        </Stack>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ p: 2, pt: 0, bgcolor: 'var(--muted)' }}>
          <Divider sx={{ my: 2, borderColor: 'var(--border)' }} />

          {/* 题目内容 */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1, color: 'var(--foreground)' }}>题目</Typography>
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'var(--card)', borderColor: 'var(--border)' }}>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', whiteSpace: 'pre-wrap' }}>
                {error.questionContent}
              </Typography>
            </Paper>
          </Box>

          {/* 答案对比 */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                <XCircle className="w-4 h-4" style={{ color: 'var(--error)' }} />
                <Typography variant="subtitle2" sx={{ color: 'var(--error)' }}>您的答案</Typography>
              </Stack>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  bgcolor: 'color-mix(in srgb, var(--error) 10%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--error) 30%, transparent)',
                }}
              >
                <Typography variant="body2" sx={{ color: 'var(--error)' }}>{error.userAnswer}</Typography>
              </Paper>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
                <CheckCircle className="w-4 h-4" style={{ color: 'var(--success)' }} />
                <Typography variant="subtitle2" sx={{ color: 'var(--success)' }}>正确答案</Typography>
              </Stack>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  bgcolor: 'color-mix(in srgb, var(--success) 10%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--success) 30%, transparent)',
                }}
              >
                <Typography variant="body2" sx={{ color: 'var(--success)' }}>{error.correctAnswer}</Typography>
              </Paper>
            </Box>
          </Stack>

          <Divider sx={{ my: 2, borderColor: 'var(--border)' }} />

          {/* AI 智能诊断 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Brain className="w-4 h-4" style={{ color: 'var(--primary)' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>AI 智能诊断</Typography>
            </Stack>

            {/* 错误原因 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: 'var(--muted-foreground)' }}>
                错误原因分析
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--foreground)' }}>{error.analysis.errorReason}</Typography>
            </Box>

            {/* 涉及知识点 */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'var(--muted-foreground)' }}>
                涉及知识点
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {error.analysis.relatedKnowledge.map((kp) => (
                  <Chip
                    key={kp.id}
                    size="small"
                    variant="outlined"
                    label={
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <BookOpen className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                        <span style={{ color: 'var(--foreground)' }}>{kp.name}</span>
                        <Typography
                          variant="caption"
                          sx={{
                            color: kp.masteryLevel < 50 ? 'var(--error)' :
                                   kp.masteryLevel < 80 ? 'var(--warning)' : 'var(--success)',
                          }}
                        >
                          [{kp.masteryLevel}%]
                        </Typography>
                      </Stack>
                    }
                    sx={{
                      color: 'var(--foreground)',
                      borderColor: 'var(--border)',
                      '& .MuiChip-label': { color: 'var(--foreground)' },
                      '& svg': { color: 'var(--muted-foreground)' },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* 学习建议 */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: 'var(--muted-foreground)' }}>
                学习建议
              </Typography>
              <Stack spacing={0.5}>
                {error.analysis.suggestions.map((suggestion, i) => (
                  <Stack key={i} direction="row" alignItems="flex-start" spacing={1}>
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
            </Box>
          </Box>

          {/* 操作按钮 */}
          <Stack direction="row" spacing={1} sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'var(--border)' }}>
            <Button size="sm" className="gap-1.5">
              <BookOpen className="w-3 h-3" />
              开始学习
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              <FileQuestion className="w-3 h-3" />
              查看解析
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              加入复习清单
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  )
}
