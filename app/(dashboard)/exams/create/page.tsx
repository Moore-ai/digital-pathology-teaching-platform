'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { PageWrapper } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { questionStats } from '@/lib/mock/questions'
import {
  Wand2,
  FileText,
  RefreshCw,
  Eye,
  Save,
} from 'lucide-react'
import { CourseCategoryLabels } from '@/types/course'

interface QuestionTypeConfig {
  type: string
  label: string
  count: number
  scorePerQuestion: number
}

export default function CreateExamPage(): ReactNode {
  const [examName, setExamName] = useState('')
  const [duration, setDuration] = useState(90)
  const [mode, setMode] = useState<'ai' | 'manual' | 'random'>('ai')

  // 分类选择
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['digestive'])

  // 难度分布
  const [difficultyEasy, setDifficultyEasy] = useState(30)
  const [difficultyMedium, setDifficultyMedium] = useState(50)
  const [difficultyHard, setDifficultyHard] = useState(20)

  // 题型配置
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeConfig[]>([
    { type: 'single', label: '单选题', count: 20, scorePerQuestion: 2 },
    { type: 'multiple', label: '多选题', count: 10, scorePerQuestion: 3 },
    { type: 'judgment', label: '判断题', count: 10, scorePerQuestion: 1 },
    { type: 'short_answer', label: '简答题', count: 2, scorePerQuestion: 10 },
  ])

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const updateQuestionType = (type: string, field: 'count' | 'scorePerQuestion', value: number) => {
    setQuestionTypes(prev =>
      prev.map(qt =>
        qt.type === type ? { ...qt, [field]: value } : qt
      )
    )
  }

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0)
  const totalScore = questionTypes.reduce((sum, qt) => sum + qt.count * qt.scorePerQuestion, 0)

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-foreground">智能组卷</h1>
        <p className="text-muted-foreground mt-1">
          使用 AI 智能生成试卷，或手动选择题目组卷
        </p>
      </div>

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">试卷名称</label>
              <Input
                placeholder="例如：期中考试 - 消化系统病理"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">考试时长（分钟）</label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 组卷方式 */}
      <Card>
        <CardHeader>
          <CardTitle>组卷方式</CardTitle>
          <CardDescription>选择适合您的组卷模式</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ai" className="gap-2">
                <Wand2 className="w-4 h-4" />
                智能组卷
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <FileText className="w-4 h-4" />
                手动选题
              </TabsTrigger>
              <TabsTrigger value="random" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                随机组卷
              </TabsTrigger>
            </TabsList>

            {/* 智能组卷 */}
            <TabsContent value="ai" className="space-y-6 mt-6">
              {/* 知识点范围 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">知识点范围</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CourseCategoryLabels).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={selectedCategories.includes(key) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(key)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 难度分布 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">难度分布</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">简单</span>
                      <span className="text-sm font-medium">{difficultyEasy}%</span>
                    </div>
                    <Slider
                      value={[difficultyEasy]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={([v]) => setDifficultyEasy(v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">中等</span>
                      <span className="text-sm font-medium">{difficultyMedium}%</span>
                    </div>
                    <Slider
                      value={[difficultyMedium]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={([v]) => setDifficultyMedium(v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">困难</span>
                      <span className="text-sm font-medium">{difficultyHard}%</span>
                    </div>
                    <Slider
                      value={[difficultyHard]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={([v]) => setDifficultyHard(v)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 题型配置 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">题型配置</h4>
                <div className="space-y-3">
                  {questionTypes.map((qt) => (
                    <div key={qt.type} className="flex items-center gap-4 p-3 rounded-lg border">
                      <span className="w-20 text-sm font-medium">{qt.label}</span>
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">数量:</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={qt.count}
                            onChange={(e) => updateQuestionType(qt.type, 'count', Number(e.target.value))}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">每题分值:</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={qt.scorePerQuestion}
                            onChange={(e) => updateQuestionType(qt.type, 'scorePerQuestion', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 生成按钮 */}
              <div className="flex items-center gap-4">
                <Button className="gap-2">
                  <Wand2 className="w-4 h-4" />
                  生成试卷预览
                </Button>
                <div className="text-sm text-muted-foreground">
                  共 <span className="font-medium text-foreground">{totalQuestions}</span> 题，
                  满分 <span className="font-medium text-foreground">{totalScore}</span> 分
                </div>
              </div>
            </TabsContent>

            {/* 手动选题 */}
            <TabsContent value="manual" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>手动选题功能即将上线</p>
                <p className="text-sm">您可以从题库中选择特定题目组卷</p>
              </div>
            </TabsContent>

            {/* 随机组卷 */}
            <TabsContent value="random" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>随机组卷功能即将上线</p>
                <p className="text-sm">系统将根据设定参数随机抽取题目</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 题库概览 */}
      <Card>
        <CardHeader>
          <CardTitle>题库概览</CardTitle>
          <CardDescription>当前题库可用题目统计</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-foreground">{questionStats.total}</div>
              <div className="text-sm text-muted-foreground mt-1">总题量</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-secondary">{questionStats.byType.single}</div>
              <div className="text-sm text-muted-foreground mt-1">单选题</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-secondary">{questionStats.byType.multiple}</div>
              <div className="text-sm text-muted-foreground mt-1">多选题</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-3xl font-bold text-secondary">{questionStats.byType.judgment}</div>
              <div className="text-sm text-muted-foreground mt-1">判断题</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>难度分布：</span>
            <Badge variant="outline">简单 {questionStats.byDifficulty.easy}</Badge>
            <Badge variant="outline">中等 {questionStats.byDifficulty.medium}</Badge>
            <Badge variant="outline">困难 {questionStats.byDifficulty.hard}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex items-center justify-end gap-3">
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          预览试卷
        </Button>
        <Button variant="outline">
          <Save className="w-4 h-4 mr-2" />
          保存草稿
        </Button>
        <Button>
          发布考试
        </Button>
      </div>
    </PageWrapper>
  )
}
