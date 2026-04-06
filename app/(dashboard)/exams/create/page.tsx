'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { useAuthStore } from '@/stores/authStore'
import { useExamStore } from '@/stores/examStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { questionStats, mockQuestions } from '@/lib/mock/questions'
import {
  Wand2,
  FileText,
  RefreshCw,
  Eye,
  Save,
  Shield,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Send,
  X,
} from 'lucide-react'
import { CourseCategoryLabels, CourseCategory } from '@/types/course'
import { Exam } from '@/types/exam'

interface QuestionTypeConfig {
  type: string
  label: string
  count: number
  scorePerQuestion: number
}

interface ValidationError {
  field: string
  message: string
}

export default function CreateExamPage(): ReactNode {
  const { user } = useAuthStore()
  const { createExam } = useExamStore()
  const router = useRouter()
  const canCreateExam = user?.role === 'teacher' || user?.role === 'admin'

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
    { type: 'single', label: '单选题', count: 10, scorePerQuestion: 2 },
    { type: 'multiple', label: '多选题', count: 5, scorePerQuestion: 3 },
    { type: 'judgment', label: '判断题', count: 5, scorePerQuestion: 1 },
    { type: 'short_answer', label: '简答题', count: 2, scorePerQuestion: 10 },
  ])

  // 验证错误
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // 生成的试卷
  const [generatedExam, setGeneratedExam] = useState<Exam | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // 权限检查
  if (!canCreateExam) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Card className="w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">权限不足</h3>
              <p className="text-sm text-muted-foreground">
                智能组卷功能仅对教师和管理员开放，学生无法创建试卷。
              </p>
            </div>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
    // 清除已生成的试卷
    if (generatedExam) {
      setGeneratedExam(null)
    }
  }

  const updateQuestionType = (type: string, field: 'count' | 'scorePerQuestion', value: number) => {
    setQuestionTypes(prev =>
      prev.map(qt =>
        qt.type === type ? { ...qt, [field]: value } : qt
      )
    )
    // 清除已生成的试卷
    if (generatedExam) {
      setGeneratedExam(null)
    }
  }

  const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0)

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = []

    if (!examName.trim()) {
      newErrors.push({ field: 'examName', message: '请输入试卷名称' })
    }

    if (duration <= 0) {
      newErrors.push({ field: 'duration', message: '考试时长必须大于0分钟' })
    }

    if (selectedCategories.length === 0) {
      newErrors.push({ field: 'categories', message: '请至少选择一个知识点范围' })
    }

    if (totalQuestions === 0) {
      newErrors.push({ field: 'questionTypes', message: '请至少设置一种题型的数量' })
    }

    if (difficultyEasy + difficultyMedium + difficultyHard !== 100) {
      newErrors.push({ field: 'difficulty', message: '难度分布总和必须为100%' })
    }

    // 检查题库是否有足够的题目（按题型检查）
    const availableByType = {
      single: mockQuestions.filter(q => selectedCategories.includes(q.category) && q.type === 'single').length,
      multiple: mockQuestions.filter(q => selectedCategories.includes(q.category) && q.type === 'multiple').length,
      judgment: mockQuestions.filter(q => selectedCategories.includes(q.category) && q.type === 'judgment').length,
      short_answer: mockQuestions.filter(q => selectedCategories.includes(q.category) && q.type === 'short_answer').length,
    }

    const requiredByType = {
      single: questionTypes.find(q => q.type === 'single')?.count || 0,
      multiple: questionTypes.find(q => q.type === 'multiple')?.count || 0,
      judgment: questionTypes.find(q => q.type === 'judgment')?.count || 0,
      short_answer: questionTypes.find(q => q.type === 'short_answer')?.count || 0,
    }

    const shortageMessages: string[] = []
    const typeLabels: Record<string, string> = {
      single: '单选题',
      multiple: '多选题',
      judgment: '判断题',
      short_answer: '简答题',
    }

    Object.entries(requiredByType).forEach(([type, required]) => {
      if (required > 0 && availableByType[type as keyof typeof availableByType] < required) {
        shortageMessages.push(
          `${typeLabels[type]}需要${required}题，仅${availableByType[type as keyof typeof availableByType]}题可用`
        )
      }
    })

    if (shortageMessages.length > 0) {
      newErrors.push({
        field: 'questionTypes',
        message: `题库题目不足：${shortageMessages.join('；')}`
      })
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  // 生成试卷
  const handleGenerateExam = async () => {
    if (!validateForm()) return

    setIsGenerating(true)

    // 模拟生成延迟
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const exam = createExam({
        name: examName,
        duration,
        categories: selectedCategories as CourseCategory[],
        difficultyDistribution: {
          easy: difficultyEasy,
          medium: difficultyMedium,
          hard: difficultyHard,
        },
        questionTypes: {
          single: questionTypes.find(q => q.type === 'single')?.count || 0,
          multiple: questionTypes.find(q => q.type === 'multiple')?.count || 0,
          judgment: questionTypes.find(q => q.type === 'judgment')?.count || 0,
          shortAnswer: questionTypes.find(q => q.type === 'short_answer')?.count || 0,
        },
        questionScores: {
          single: questionTypes.find(q => q.type === 'single')?.scorePerQuestion || 2,
          multiple: questionTypes.find(q => q.type === 'multiple')?.scorePerQuestion || 3,
          judgment: questionTypes.find(q => q.type === 'judgment')?.scorePerQuestion || 1,
          shortAnswer: questionTypes.find(q => q.type === 'short_answer')?.scorePerQuestion || 10,
        },
        totalScore: questionTypes.reduce((sum, qt) => sum + qt.count * qt.scorePerQuestion, 0),
      })

      setGeneratedExam(exam)
      setErrors([])
    } catch (error) {
      console.error('生成试卷失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // 发布考试
  const handlePublishExam = () => {
    if (!generatedExam) return

    // 跳转到考试中心
    router.push('/exams')
  }

  // 保存草稿
  const handleSaveDraft = () => {
    if (!examName.trim()) {
      setErrors([{ field: 'examName', message: '请输入试卷名称' }])
      return
    }

    alert('草稿保存成功')
  }

  // 获取错误信息
  const getError = (field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message
  }

  // 检查知识点范围内的题目数量
  const getCategoryQuestionCount = (category: string): number => {
    return mockQuestions.filter(q => q.category === category).length
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 返回按钮 */}
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => router.push('/exams')}
      >
        <ChevronLeft className="w-4 h-4" />
        返回考试中心
      </Button>

      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-foreground">智能组卷</h1>
        <p className="text-muted-foreground mt-1">
          使用 AI 智能生成试卷，或手动选择题目组卷
        </p>
      </div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-1">请完善以下信息：</div>
            <ul className="list-disc list-inside text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* 生成成功提示 */}
      {generatedExam && (
        <Alert className="border-success/50 bg-success/10">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription className="text-success">
            试卷生成成功！共 {generatedExam.totalQuestions} 题，满分 {generatedExam.totalScore} 分。
            请预览确认后发布。
          </AlertDescription>
        </Alert>
      )}

      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                试卷名称 <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="例如：期中考试 - 消化系统病理"
                value={examName}
                onChange={(e) => {
                  setExamName(e.target.value)
                  setErrors(prev => prev.filter(e => e.field !== 'examName'))
                }}
                className={getError('examName') ? 'border-destructive' : ''}
              />
              {getError('examName') && (
                <p className="text-sm text-destructive">{getError('examName')}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                考试时长（分钟） <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => {
                  setDuration(Number(e.target.value))
                  setErrors(prev => prev.filter(e => e.field !== 'duration'))
                }}
                className={getError('duration') ? 'border-destructive' : ''}
              />
              {getError('duration') && (
                <p className="text-sm text-destructive">{getError('duration')}</p>
              )}
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
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">知识点范围</h4>
                  <span className="text-destructive">*</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CourseCategoryLabels).map(([key, label]) => {
                    const count = getCategoryQuestionCount(key)
                    return (
                      <Button
                        key={key}
                        variant={selectedCategories.includes(key) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCategory(key)}
                        className="gap-1"
                      >
                        {label}
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {count}
                        </Badge>
                      </Button>
                    )
                  })}
                </div>
                {getError('categories') && (
                  <p className="text-sm text-destructive">{getError('categories')}</p>
                )}
              </div>

              <Separator />

              {/* 难度分布 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">难度分布</h4>
                  <span className="text-sm text-muted-foreground">
                    总和: {difficultyEasy + difficultyMedium + difficultyHard}%
                  </span>
                </div>
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
                      onValueChange={([v]) => {
                        setDifficultyEasy(v)
                        if (generatedExam) setGeneratedExam(null)
                      }}
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
                      onValueChange={([v]) => {
                        setDifficultyMedium(v)
                        if (generatedExam) setGeneratedExam(null)
                      }}
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
                      onValueChange={([v]) => {
                        setDifficultyHard(v)
                        if (generatedExam) setGeneratedExam(null)
                      }}
                    />
                  </div>
                </div>
                {getError('difficulty') && (
                  <p className="text-sm text-destructive">{getError('difficulty')}</p>
                )}
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
                            min={0}
                            onChange={(e) => updateQuestionType(qt.type, 'count', Math.max(0, Number(e.target.value)))}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">每题分值:</span>
                          <Input
                            type="number"
                            className="w-20"
                            value={qt.scorePerQuestion}
                            min={1}
                            onChange={(e) => updateQuestionType(qt.type, 'scorePerQuestion', Math.max(1, Number(e.target.value)))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {getError('questionTypes') && (
                  <p className="text-sm text-destructive">{getError('questionTypes')}</p>
                )}
              </div>

              {/* 统计信息 */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                <div className="text-sm">
                  共 <span className="font-medium text-foreground">{totalQuestions}</span> 题，
                  预计满分 <span className="font-medium text-foreground">
                    {questionTypes.reduce((sum, qt) => sum + qt.count * qt.scorePerQuestion, 0)}
                  </span> 分
                </div>
              </div>

              {/* 生成按钮 */}
              <div className="flex items-center gap-4">
                <Button
                  className="gap-2"
                  onClick={handleGenerateExam}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : generatedExam ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      重新生成
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      生成试卷
                    </>
                  )}
                </Button>
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

          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">各系统题目分布：</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(questionStats.byCategory).map(([key, count]) => (
                <Badge key={key} variant="outline">
                  {CourseCategoryLabels[key as CourseCategory] || key}: {count}
                </Badge>
              ))}
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
        <Button variant="outline" onClick={handleSaveDraft}>
          <Save className="w-4 h-4 mr-2" />
          保存草稿
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowPreview(true)}
          disabled={!generatedExam}
        >
          <Eye className="w-4 h-4 mr-2" />
          预览试卷
        </Button>
        <Button
          onClick={handlePublishExam}
          disabled={!generatedExam}
        >
          <Send className="w-4 h-4 mr-2" />
          发布考试
        </Button>
      </div>

      {/* 预览对话框 */}
      {showPreview && generatedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <CardHeader className="shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{generatedExam.title}</CardTitle>
                  <CardDescription>
                    共 {generatedExam.totalQuestions} 题，满分 {generatedExam.totalScore} 分
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4">
              {generatedExam.questions.map((q, index) => (
                <div key={q.id} className="p-4 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <span className="font-medium">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="font-medium">{q.content}</p>
                      {q.options && (
                        <div className="mt-2 space-y-1">
                          {q.options.map(opt => (
                            <div key={opt.key} className="text-sm text-muted-foreground">
                              {opt.key}. {opt.value}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">
                          {q.type === 'single' ? '单选' : q.type === 'multiple' ? '多选' : q.type === 'judgment' ? '判断' : '简答'}
                        </Badge>
                        <Badge variant="outline">
                          {q.difficulty === 'easy' ? '简单' : q.difficulty === 'medium' ? '中等' : '困难'}
                        </Badge>
                        <Badge variant="outline">
                          {CourseCategoryLabels[q.category as CourseCategory] || q.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{q.score}分</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </PageWrapper>
  )
}
