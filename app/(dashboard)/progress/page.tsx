'use client'

import type { ReactNode } from 'react'
import { PageWrapper } from '@/components/layout'
import { KnowledgeRadarChart, LearningTrajectory, ExamScoreChart } from '@/components/features/analytics'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">学习进度</h1>
          <p className="text-muted-foreground mt-1">
            查看您的学习数据统计和知识点掌握情况
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          导出报告
        </Button>
      </div>

      {/* 总体进度卡片 */}
      <Card className="bg-linear-to-r from-primary/5 to-secondary/5">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#2D8B8B"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${progressData.overallProgress * 3.52} 352`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{progressData.overallProgress}%</div>
                  <div className="text-xs text-muted-foreground">总进度</div>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <BookOpen className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <div className="text-2xl font-bold">{progressData.completedCourses}/{progressData.totalCourses}</div>
                <div className="text-xs text-muted-foreground">完成课程</div>
              </div>
              <div className="text-center">
                <Award className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <div className="text-2xl font-bold">{progressData.averageScore}</div>
                <div className="text-xs text-muted-foreground">平均成绩</div>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <div className="text-2xl font-bold">{progressData.studyHours}h</div>
                <div className="text-xs text-muted-foreground">累计学习</div>
              </div>
              <div className="text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <div className="text-2xl font-bold">{progressData.totalExams}</div>
                <div className="text-xs text-muted-foreground">参加考试</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KnowledgeRadarChart />
        <LearningTrajectory />
      </div>

      {/* 考试成绩趋势 */}
      <ExamScoreChart />

      {/* 薄弱知识点和最近学习 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 薄弱知识点 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              薄弱知识点
            </CardTitle>
            <CardDescription>需要加强学习的知识点</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakPoints.map((point, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-foreground">{point.name}</span>
                    <Badge variant="outline" className="ml-2 text-xs">{point.category}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">{point.accuracy}%</span>
                </div>
                <Progress value={point.accuracy} className="h-2" />
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              查看详细分析
            </Button>
          </CardContent>
        </Card>

        {/* 最近学习 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              最近学习
            </CardTitle>
            <CardDescription>最近学习记录</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLearning.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <div className="font-medium text-foreground">{item.course}</div>
                  <div className="text-sm text-muted-foreground">{item.chapter}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-secondary">{item.progress}%</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              查看全部记录
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
