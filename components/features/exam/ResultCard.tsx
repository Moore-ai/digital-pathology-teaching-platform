'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ExamResult, ScoreLevel } from '@/lib/mock/results'
import { scoreLevelConfig } from '@/lib/mock/results'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Users, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ResultCardProps {
  className?: string
  result: ExamResult
  showRank?: boolean  // 是否显示排名，默认 true
}

// 获取状态条颜色类
function getStatusBarClass(level: ScoreLevel): string {
  const config = scoreLevelConfig[level]
  return config.bgClass
}

export function ResultCard({ className, result, showRank = true }: ResultCardProps): ReactNode {
  const levelConfig = scoreLevelConfig[result.level]
  const statusBarClass = getStatusBarClass(result.level)

  return (
    <Card className={cn(
      "group hover:shadow-md transition-all cursor-pointer relative overflow-hidden h-full flex flex-col",
      className
    )}>
      {/* 成绩状态条 */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5",
        statusBarClass
      )} />

      <CardContent className="pt-4 pb-4 pl-5 flex-1 flex flex-col">
        {/* 标题行 */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/exams/${result.examId}/result`} className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
              {result.examTitle}
            </h3>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className={cn(levelConfig.textClass, "border-current")}>
              {levelConfig.label}
            </Badge>
            <span className="text-2xl font-bold">{result.score}</span>
          </div>
        </div>

        {/* 考试信息 */}
        <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
          {result.examDescription || result.category}
        </p>

        {/* 统计信息 */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-auto">
          <span>{result.category}</span>
          <span>·</span>
          <span>{formatDate(result.submittedAt)}</span>
          {showRank && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                排名 {result.rank}/{result.totalStudents}
              </span>
            </>
          )}
        </div>

        {/* 详细数据 */}
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-success">{result.correctCount}</div>
            <div className="text-xs text-muted-foreground">正确</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-error">{result.wrongCount}</div>
            <div className="text-xs text-muted-foreground">错误</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              {result.timeSpent}
            </div>
            <div className="text-xs text-muted-foreground">分钟</div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/exams/${result.examId}/result`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Eye className="w-4 h-4" />
              查看详情
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
