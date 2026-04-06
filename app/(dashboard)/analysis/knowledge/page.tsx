'use client'

import type { ReactNode } from 'react'
import { Suspense, useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import {
  ChevronLeft,
  Network,
  Video,
  Microscope,
  FileQuestion,
  CheckCircle,
  Target,
  TrendingUp,
  Lightbulb,
  ChevronRight,
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
  useTheme,
} from '@mui/material'
import { useAnalysisStore } from '@/stores/analysisStore'
import type { KnowledgeNode } from '@/types/analysis'

type SortOption = 'weak_first' | 'mastery_high' | 'mastery_low' | 'name'

const statusConfig = {
  mastered: { label: '已掌握', color: 'var(--success)', bgColor: 'color-mix(in srgb, var(--success) 10%, transparent)' },
  learning: { label: '学习中', color: 'var(--warning)', bgColor: 'color-mix(in srgb, var(--warning) 10%, transparent)' },
  weak: { label: '薄弱', color: 'var(--error)', bgColor: 'color-mix(in srgb, var(--error) 10%, transparent)' },
  unlearned: { label: '未学习', color: 'var(--muted-foreground)', bgColor: 'color-mix(in srgb, var(--muted-foreground) 10%, transparent)' },
}

function KnowledgeAnalysisContent(): ReactNode {
  const searchParams = useSearchParams()
  const highlightPointId = searchParams.get('point')
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'

  const {
    knowledgeGraph,
    knowledgePoints,
    selectedKnowledgePoint,
    fetchKnowledgeData,
    selectKnowledgePoint,
    getStudyRecommendations,
  } = useAnalysisStore()

  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('weak_first')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await fetchKnowledgeData()
      setIsLoading(false)
    }
    loadData()
  }, [fetchKnowledgeData])

  const categories = useMemo(() => {
    const cats = new Set(knowledgePoints.map(kp => kp.category))
    return ['all', ...Array.from(cats)]
  }, [knowledgePoints])

  const filteredNodes = useMemo(() => {
    let nodes = [...knowledgeGraph.nodes]

    if (selectedCategory !== 'all') {
      nodes = nodes.filter(n => n.category === selectedCategory)
    }

    switch (sortBy) {
      case 'weak_first':
        nodes.sort((a, b) => a.masteryLevel - b.masteryLevel)
        break
      case 'mastery_high':
        nodes.sort((a, b) => b.masteryLevel - a.masteryLevel)
        break
      case 'mastery_low':
        nodes.sort((a, b) => a.masteryLevel - b.masteryLevel)
        break
      case 'name':
        nodes.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
        break
    }

    return nodes
  }, [knowledgeGraph.nodes, sortBy, selectedCategory])

  const recommendations = getStudyRecommendations()

  const highlightedNode = highlightPointId
    ? knowledgeGraph.nodes.find(n => n.id === highlightPointId)
    : null

  return (
    <>
      {/* 知识图谱可视化 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Network className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>知识图谱</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'var(--success)' }} />
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>掌握</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'var(--warning)' }} />
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>一般</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'var(--error)' }} />
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>薄弱</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'var(--muted-foreground)', border: '2px dashed var(--border)' }} />
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>未学习</Typography>
            </Stack>
          </Stack>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>加载知识图谱...</Typography>
          </Box>
        ) : (
          <KnowledgeGraphVisualization
            nodes={knowledgeGraph.nodes}
            edges={knowledgeGraph.edges}
            selectedNode={selectedKnowledgePoint || highlightedNode || null}
            onNodeClick={selectKnowledgePoint}
          />
        )}
      </Paper>

      {/* 掌握度详情 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Target className="w-5 h-5" style={{ color: 'var(--secondary)' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>掌握度详情</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                displayEmpty
                renderValue={(value) => value === 'all' ? '全部分类' : value}
                sx={{ color: 'var(--foreground)', '.MuiSelect-icon': { color: 'var(--muted-foreground)' } }}
                MenuProps={{
                  PaperProps: { sx: { bgcolor: 'var(--card)' } }
                }}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat} sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>
                    {cat === 'all' ? '全部分类' : cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                sx={{ color: 'var(--foreground)', '.MuiSelect-icon': { color: 'var(--muted-foreground)' } }}
                MenuProps={{
                  PaperProps: { sx: { bgcolor: 'var(--card)' } }
                }}
              >
                <MenuItem value="weak_first" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>薄弱优先</MenuItem>
                <MenuItem value="mastery_high" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>掌握度高</MenuItem>
                <MenuItem value="mastery_low" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>掌握度低</MenuItem>
                <MenuItem value="name" sx={{ color: 'var(--foreground)', '&:hover': { bgcolor: 'var(--muted)' } }}>按名称</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {isLoading ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: 384, overflow: 'auto' }}>
            <Stack spacing={1.5}>
              {filteredNodes.map((node) => (
                <KnowledgePointCard
                  key={node.id}
                  node={node}
                  isSelected={selectedKnowledgePoint?.id === node.id || highlightedNode?.id === node.id}
                  onClick={() => selectKnowledgePoint(node)}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      {/* AI 学习建议 */}
      <Paper sx={{ p: 2, bgcolor: 'var(--card)', color: 'var(--foreground)' }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <Lightbulb className="w-5 h-5" style={{ color: 'var(--warning)' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>AI 学习建议</Typography>
        </Stack>
        <Typography variant="body2" sx={{ mb: 2, color: 'var(--muted-foreground)' }}>
          基于您的学习数据，为您推荐个性化学习方案
        </Typography>

        {recommendations.length > 0 ? (
          <Stack spacing={2}>
            {recommendations.map((rec, index) => (
              <Paper key={rec.knowledgePointId} variant="outlined" sx={{ p: 2, bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
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
                      fontWeight: 'bold',
                      bgcolor: index === 0 ? 'var(--error)' : 'var(--warning)',
                      color: 'white',
                    }}
                  >
                    {rec.priority}
                  </Paper>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>{rec.knowledgePoint}</Typography>
                      <Chip size="small" variant="outlined" label={index === 0 ? '重点' : '建议'} sx={{ color: 'var(--foreground)', borderColor: 'var(--border)', '& .MuiChip-label': { color: 'var(--foreground)' } }} />
                    </Stack>
                    <Typography variant="body2" sx={{ mt: 0.5, color: 'var(--muted-foreground)' }}>
                      {rec.reason}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} useFlexGap flexWrap="wrap">
                      {rec.resources.map((resource, i) => (
                        <Button key={i} variant="outline" size="sm" className="gap-1.5 text-xs">
                          {resource.type === 'course' && <Video className="w-3 h-3" />}
                          {resource.type === 'slice' && <Microscope className="w-3 h-3" />}
                          {resource.type === 'exercise' && <FileQuestion className="w-3 h-3" />}
                          {resource.title}
                          {resource.estimatedTime && (
                            <span style={{ color: 'var(--muted-foreground)' }}>{resource.estimatedTime}分钟</span>
                          )}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
              <Button className="gap-2">
                <TrendingUp className="w-4 h-4" />
                开始针对性学习
              </Button>
            </Box>
          </Stack>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CheckCircle className="w-12 h-12" style={{ color: 'var(--success)' }} />
            <Typography sx={{ mt: 1, color: 'var(--muted-foreground)' }}>您的知识点掌握情况良好，继续保持！</Typography>
          </Box>
        )}
      </Paper>
    </>
  )
}

export default function KnowledgeAnalysisPage(): ReactNode {
  return (
    <PageWrapper className="space-y-6">
      {/* 顶部导航 */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Link href="/analysis" style={{ color: 'var(--muted-foreground)', transition: 'color 0.2s' }}>
          <ChevronLeft className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
        </Link>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>知识点分析</Typography>
          <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>知识图谱可视化与掌握度评估</Typography>
        </Box>
      </Stack>

      <Suspense fallback={
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <Typography sx={{ color: 'var(--muted-foreground)' }}>加载中...</Typography>
        </Box>
      }>
        <KnowledgeAnalysisContent />
      </Suspense>
    </PageWrapper>
  )
}

// 知识图谱可视化组件
function KnowledgeGraphVisualization({
  nodes,
  edges,
  selectedNode,
  onNodeClick,
}: {
  nodes: KnowledgeNode[]
  edges: { source: string; target: string; relationship: string }[]
  selectedNode: KnowledgeNode | null
  onNodeClick: (node: KnowledgeNode) => void
}) {
  if (nodes.length === 0) return null

  const cols = Math.ceil(Math.sqrt(nodes.length))
  const cellWidth = 120
  const cellHeight = 100
  const padding = 40

  const positionedNodes = nodes.map((node, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    return {
      ...node,
      computedX: padding + col * cellWidth + cellWidth / 2,
      computedY: padding + row * cellHeight + cellHeight / 2,
    }
  })

  const totalWidth = cols * cellWidth + padding * 2
  const rows = Math.ceil(nodes.length / cols)
  const totalHeight = rows * cellHeight + padding * 2

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'mastered': return 'var(--success)'
      case 'learning': return 'var(--warning)'
      case 'weak': return 'var(--error)'
      default: return 'var(--muted-foreground)'
    }
  }

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <svg
        width={totalWidth}
        height={totalHeight}
        style={{ minWidth: '100%', display: 'block', margin: '0 auto' }}
      >
        <rect width={totalWidth} height={totalHeight} fill="transparent" />

        {edges.map((edge, index) => {
          const source = positionedNodes.find(n => n.id === edge.source)
          const target = positionedNodes.find(n => n.id === edge.target)
          if (!source || !target) return null

          return (
            <line
              key={index}
              x1={source.computedX}
              y1={source.computedY}
              x2={target.computedX}
              y2={target.computedY}
              stroke={edge.relationship === 'prerequisite' ? 'var(--muted-foreground)' : 'var(--border)'}
              strokeWidth={edge.relationship === 'prerequisite' ? 1.5 : 1}
              strokeDasharray={edge.relationship === 'related' ? '4,4' : undefined}
            />
          )
        })}

        {positionedNodes.map((node) => {
          const isSelected = selectedNode?.id === node.id

          return (
            <g
              key={node.id}
              transform={`translate(${node.computedX}, ${node.computedY})`}
              onClick={() => onNodeClick(node)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                r={isSelected ? 32 : 28}
                fill={getNodeColor(node.status)}
                stroke={isSelected ? 'var(--primary)' : 'none'}
                strokeWidth={isSelected ? 3 : 0}
                style={{ transition: 'all 0.2s' }}
              />
              <text
                textAnchor="middle"
                dy="0.3em"
                fill="white"
                fontSize="11"
                fontWeight="500"
              >
                {node.name.length > 5 ? node.name.slice(0, 5) + '...' : node.name}
              </text>
            </g>
          )
        })}
      </svg>

      {selectedNode && (
        <Paper variant="outlined" sx={{ mt: 2, p: 1.5, bgcolor: 'var(--muted)', borderColor: 'var(--border)' }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>{selectedNode.name}</Typography>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>{selectedNode.category}</Typography>
            </Box>
            <Chip
              size="small"
              label={`${selectedNode.masteryLevel}%`}
              sx={{
                bgcolor: statusConfig[selectedNode.status].bgColor,
                color: statusConfig[selectedNode.status].color,
              }}
            />
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>课程: {selectedNode.relatedResources.courses.length}</Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>切片: {selectedNode.relatedResources.slices.length}</Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>题目: {selectedNode.relatedResources.questions.length}</Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

// 知识点卡片组件
function KnowledgePointCard({
  node,
  isSelected,
  onClick,
}: {
  node: KnowledgeNode
  isSelected: boolean
  onClick: () => void
}) {
  const config = statusConfig[node.status]

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
        bgcolor: isSelected ? 'color-mix(in srgb, var(--primary) 5%, transparent)' : 'var(--card)',
        '&:hover': {
          borderColor: 'var(--primary)',
          bgcolor: 'var(--muted)',
        },
      }}
      onClick={onClick}
    >
      <Stack direction="row" alignItems="flex-start" spacing={1.5}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            mt: 0.5,
            bgcolor: config.color,
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 500,
                color: 'var(--foreground)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {node.name}
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              label={`${node.masteryLevel}%`}
              sx={{ color: config.color, borderColor: config.color, '& .MuiChip-label': { color: config.color } }}
            />
          </Stack>
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={node.masteryLevel}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'var(--muted)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: config.color,
                  borderRadius: 3,
                },
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'var(--muted-foreground)' }}>
            {node.masteryLevel >= 80 ? '掌握良好' :
             node.masteryLevel >= 50 ? '继续巩固' :
             node.masteryLevel > 0 ? '需要重点复习' : '尚未学习'}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {node.relatedResources.courses.length > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Video className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>{node.relatedResources.courses.length}</Typography>
              </Stack>
            )}
            {node.relatedResources.slices.length > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Microscope className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>{node.relatedResources.slices.length}</Typography>
              </Stack>
            )}
            {node.relatedResources.questions.length > 0 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <FileQuestion className="w-3 h-3" style={{ color: 'var(--muted-foreground)' }} />
                <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>{node.relatedResources.questions.length}</Typography>
              </Stack>
            )}
          </Stack>
        </Box>
        <ChevronRight className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
      </Stack>
    </Paper>
  )
}
