'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { ClassResultStats } from '@/lib/mock/results'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ClassScoreDistribution } from './ClassScoreDistribution'
import { Users, TrendingUp, Award, Eye } from 'lucide-react'

interface ClassResultCardProps {
  className?: string
  result: ClassResultStats
}

export function ClassResultCard({ className, result }: ClassResultCardProps): ReactNode {
  return (
    <Card className={cn("group hover:shadow-md transition-all h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base line-clamp-1">{result.examTitle}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{result.className}</p>
          </div>
          <Badge variant="secondary">
            {result.passRate.toFixed(1)}% 及格
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* 核心统计 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-bold text-secondary">{result.averageScore.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">平均分</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-bold text-success">{result.highestScore}</div>
            <div className="text-xs text-muted-foreground">最高分</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-bold text-warning">{result.lowestScore}</div>
            <div className="text-xs text-muted-foreground">最低分</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <div className="text-lg font-bold">{result.submissionCount}</div>
            <div className="text-xs text-muted-foreground">提交</div>
          </div>
        </div>

        {/* 成绩分布 */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">成绩分布</h4>
          <ClassScoreDistribution
            distribution={result.distribution}
            totalStudents={result.totalStudents}
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Link href={`/exams/${result.examId}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1">
              <Eye className="w-4 h-4" />
              查看考试
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
