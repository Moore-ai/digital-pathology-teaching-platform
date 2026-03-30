'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/stores/authStore'
import {
  CheckCircle,
  Circle,
  PlayCircle,
  Clock,
  Calendar,
  ChevronRight,
  BookOpen,
  FileText,
  Microscope,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react'

// 任务状态类型
type TaskStatus = 'completed' | 'in_progress' | 'pending' | 'urgent'
type TaskType = 'study' | 'exam' | 'assignment' | 'discussion'

// 今日任务数据
const todayTasks = [
  { id: '1', title: '完成第三章练习', course: '消化病理学', progress: 100, status: 'completed' as TaskStatus, type: 'study' as TaskType },
  { id: '2', title: '观看病理切片', course: '乳腺病理学', progress: 100, status: 'completed' as TaskStatus, type: 'study' as TaskType },
  { id: '3', title: '阅读课件', course: '呼吸病理学', progress: 60, status: 'in_progress' as TaskStatus, type: 'study' as TaskType },
  { id: '4', title: '期中考试复习', course: '全部课程', progress: 0, status: 'urgent' as TaskStatus, type: 'exam' as TaskType, deadline: '明天 18:00' },
  { id: '5', title: '参与讨论', course: '讨论区', progress: 0, status: 'pending' as TaskStatus, type: 'discussion' as TaskType },
]

// 学习路径数据
const learningPath = [
  { id: '1', title: '第1章 绪论', progress: 100, status: 'completed' as const },
  { id: '2', title: '第2章 食管疾病', progress: 100, status: 'completed' as const },
  { id: '3', title: '第3章 胃疾病', progress: 100, status: 'completed' as const },
  { id: '4', title: '第4章 小肠疾病', progress: 65, status: 'in_progress' as const, current: '4.3 克罗恩病' },
  { id: '5', title: '第5章 大肠疾病', progress: 0, status: 'pending' as const },
  { id: '6', title: '第6章 肝脏疾病', progress: 0, status: 'pending' as const },
]

// 日历事件
const calendarEvents = [
  { id: '1', time: '09:00', title: '消化病理学 第5章', type: 'study' },
  { id: '2', time: '14:00', title: '第三单元测试 截止', type: 'deadline' },
  { id: '3', time: '19:00', title: '直播课：病例分析', type: 'live' },
]

// 即将到来
const upcomingEvents = [
  { id: '1', type: 'exam', title: '期中考试', date: '3月18日', time: '09:00 - 11:00', detail: '消化系统病理', daysLeft: 3 },
  { id: '2', type: 'deadline', title: '作业截止', date: '3月20日', time: '23:59', detail: '呼吸系统病例分析', daysLeft: 5 },
  { id: '3', type: 'live', title: '直播课', date: '3月22日', time: '19:00 - 20:30', detail: '病例讨论：消化系统肿瘤', daysLeft: 7 },
]

// 最近学习记录
const recentLearning = [
  { id: '1', type: 'course', title: '消化病理学', subtitle: '第4章 小肠疾病', progress: 65, time: '2小时前', href: '/courses/1' },
  { id: '2', type: 'course', title: '乳腺病理学', subtitle: '第3章 乳腺癌分类', progress: 100, time: '昨天', href: '/courses/2' },
  { id: '3', type: 'slice', title: '切片浏览', subtitle: '肝细胞癌.svs · 标注 3 个', progress: undefined, time: '昨天', href: '/slices/1' },
]

// 任务状态图标组件
function TaskStatusIcon({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-success" />
    case 'in_progress':
      return <PlayCircle className="w-5 h-5 text-secondary animate-pulse" />
    case 'urgent':
      return <AlertCircle className="w-5 h-5 text-accent" />
    default:
      return <Circle className="w-5 h-5 text-muted-foreground" />
  }
}

// 任务卡片组件
function TaskCard({ task }: { task: typeof todayTasks[0] }) {
  const isCompleted = task.status === 'completed'

  return (
    <Card className={`
      group cursor-pointer transition-all duration-200
      hover:shadow-md hover:-translate-y-0.5
      ${isCompleted ? 'opacity-70' : ''}
      ${task.status === 'urgent' ? 'border-accent/50 bg-accent/5' : ''}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <TaskStatusIcon status={task.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {task.title}
              </span>
              {task.status === 'urgent' && (
                <Badge variant="outline" className="text-xs text-accent border-accent/50">
                  紧急
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {task.course}
              {task.deadline && ` · 截止: ${task.deadline}`}
            </div>
            {task.status !== 'pending' && (
              <Progress
                value={task.progress}
                className="h-1.5"
              />
            )}
          </div>
          {task.status === 'in_progress' && (
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              继续
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// 学习路径节点组件
function PathNode({ node, isLast }: { node: typeof learningPath[0]; isLast: boolean }) {
  const statusColors = {
    completed: 'bg-success',
    in_progress: 'bg-secondary',
    pending: 'bg-muted-foreground/30',
  }

  const borderColors = {
    completed: 'border-success',
    in_progress: 'border-secondary',
    pending: 'border-muted-foreground/30',
  }

  return (
    <div className="flex items-start gap-4">
      {/* 节点和连接线 */}
      <div className="flex flex-col items-center">
        <div className={`
          w-4 h-4 rounded-full border-2 transition-all duration-300
          ${borderColors[node.status]}
          ${node.status === 'completed' ? statusColors[node.status] : 'bg-background'}
          ${node.status === 'in_progress' ? 'ring-4 ring-secondary/20 animate-pulse' : ''}
        `} />
        {!isLast && (
          <div className={`
            w-0.5 h-8 mt-1
            ${node.status === 'completed' ? 'bg-success' : 'bg-muted-foreground/20'}
          `} />
        )}
      </div>

      {/* 内容 */}
      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className={`font-medium ${node.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
              {node.title}
            </span>
            {node.current && (
              <span className="text-sm text-secondary ml-2">
                ← 当前: {node.current}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {node.status === 'completed' && (
              <CheckCircle className="w-4 h-4 text-success" />
            )}
            <span className={`text-sm ${node.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
              {node.progress}%
            </span>
          </div>
        </div>
        {node.status === 'in_progress' && (
          <Progress value={node.progress} className="h-1.5 mt-2" />
        )}
      </div>
    </div>
  )
}

// 日历组件
function LearningCalendar() {
  const today = new Date()
  const currentDay = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">学习日历</CardTitle>
          <span className="text-sm text-muted-foreground">
            {today.getFullYear()}年{today.getMonth() + 1}月
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* 日历网格 */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground py-1">
              {day}
            </div>
          ))}
          {days.slice(0, 35).map((day, index) => (
            <div
              key={index}
              className={`
                text-center text-sm py-1.5 rounded-md transition-colors cursor-pointer
                ${day === null ? '' : 'hover:bg-muted'}
                ${day === currentDay ? 'bg-secondary text-white font-medium' : ''}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 今日日程 */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium mb-2">今日日程</h4>
          <div className="space-y-2">
            {calendarEvents.map(event => (
              <div key={event.id} className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground w-12 font-mono">{event.time}</span>
                <span className={`
                  w-2 h-2 rounded-full
                  ${event.type === 'deadline' ? 'bg-accent' : event.type === 'live' ? 'bg-primary' : 'bg-secondary'}
                `} />
                <span className="text-foreground">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 即将到来卡片
function UpcomingCard({ event }: { event: typeof upcomingEvents[0] }) {
  const icons: Record<string, typeof FileText> = {
    exam: FileText,
    deadline: Clock,
    live: Calendar,
  }
  const Icon = icons[event.type]

  const colors: Record<string, string> = {
    exam: 'text-accent',
    deadline: 'text-warning',
    live: 'text-primary',
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer">
      <Icon className={`w-5 h-5 mt-0.5 ${colors[event.type]}`} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-foreground">{event.title}</div>
        <div className="text-sm text-muted-foreground">
          {event.date} {event.time}
        </div>
        <div className="text-sm text-muted-foreground">{event.detail}</div>
      </div>
      <Badge variant="outline" className="text-xs">
        {event.daysLeft}天后
      </Badge>
    </div>
  )
}

// 最近学习卡片
function RecentLearningCard({ record }: { record: typeof recentLearning[0] }) {
  const icons: Record<string, typeof BookOpen> = {
    course: BookOpen,
    slice: Microscope,
  }
  const Icon = icons[record.type]

  return (
    <Link href={record.href}>
      <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-foreground">{record.title}</div>
              <div className="text-sm text-muted-foreground truncate">{record.subtitle}</div>
            </div>
            <div className="text-right">
              {record.progress !== undefined && (
                <div className="text-sm font-medium text-secondary">{record.progress}%</div>
              )}
              <div className="text-xs text-muted-foreground">{record.time}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function MyLearningPage(): ReactNode {
  const { user } = useAuthStore()
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week')

  const completedTasks = todayTasks.filter(t => t.status === 'completed').length
  const totalTasks = todayTasks.length

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">我的学习</h1>
          <p className="text-muted-foreground mt-1">
            今日待办 · 学习任务 · 考试安排
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-1">
            {(['week', 'month', 'all'] as const).map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`
                  px-3 py-1.5 text-sm rounded-md transition-colors
                  ${timeFilter === filter ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                {filter === 'week' ? '本周' : filter === 'month' ? '本月' : '全部'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：今日任务 + 学习路径 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 今日任务 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">今日任务</CardTitle>
                <Badge variant="secondary" className="font-mono">
                  {completedTasks}/{totalTasks} 已完成
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              <Button variant="outline" className="w-full gap-2 mt-2">
                <Plus className="w-4 h-4" />
                添加任务
              </Button>
            </CardContent>
          </Card>

          {/* 学习路径 */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">学习路径</CardTitle>
                  <CardDescription>消化病理学（进行中）</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  切换课程
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                {learningPath.map((node, index) => (
                  <PathNode
                    key={node.id}
                    node={node}
                    isLast={index === learningPath.length - 1}
                  />
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                查看完整大纲
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：日历 + 即将到来 */}
        <div className="space-y-6">
          {/* 学习日历 */}
          <LearningCalendar />

          {/* 即将到来 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">即将到来</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map(event => (
                <UpcomingCard key={event.id} event={event} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 最近学习记录 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">最近学习</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentLearning.map(record => (
              <RecentLearningCard key={record.id} record={record} />
            ))}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
