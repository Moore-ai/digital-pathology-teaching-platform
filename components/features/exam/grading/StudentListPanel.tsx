'use client'

import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Circle, MinusCircle, Search, User } from 'lucide-react'
import { StudentSubmission } from '@/lib/mock/grading'

interface StudentListPanelProps {
  students: StudentSubmission[]
  currentStudentId: string | null
  onSelectStudent: (studentId: string) => void
  className?: string
}

type FilterType = 'all' | 'graded' | 'ungraded'

export function StudentListPanel({
  students,
  currentStudentId,
  onSelectStudent,
  className,
}: StudentListPanelProps): ReactNode {
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 筛选学生
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 筛选条件
      if (filter === 'graded' && student.status !== 'graded') return false
      if (filter === 'ungraded' && student.status === 'graded') return false

      // 搜索条件
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          student.studentName.toLowerCase().includes(query) ||
          student.studentNumber.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [students, filter, searchQuery])

  // 统计数量
  const counts = useMemo(() => ({
    all: students.length,
    graded: students.filter(s => s.status === 'graded').length,
    ungraded: students.filter(s => s.status !== 'graded').length,
  }), [students])

  // 获取状态图标和样式
  const getStatusDisplay = (status: StudentSubmission['status']) => {
    switch (status) {
      case 'graded':
        return {
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/5',
          label: '已批改',
        }
      case 'grading':
        return {
          icon: MinusCircle,
          color: 'text-secondary',
          bgColor: 'bg-secondary/5',
          label: '批改中',
        }
      default:
        return {
          icon: Circle,
          color: 'text-muted-foreground',
          bgColor: '',
          label: '未批改',
        }
    }
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* 标题 */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-foreground">学生列表</h3>
        <Badge variant="secondary">{counts.all} 人</Badge>
      </div>

      {/* 搜索 */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索学生姓名或学号..."
            className="pl-9"
          />
        </div>
      </div>

      {/* 筛选标签 */}
      <div className="flex gap-1 p-3 border-b">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
          className="text-xs"
        >
          全部 ({counts.all})
        </Button>
        <Button
          variant={filter === 'ungraded' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('ungraded')}
          className="text-xs"
        >
          未批改 ({counts.ungraded})
        </Button>
        <Button
          variant={filter === 'graded' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('graded')}
          className="text-xs"
        >
          已批改 ({counts.graded})
        </Button>
      </div>

      {/* 学生列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredStudents.length > 0 ? (
          <div className="p-2 space-y-1">
            {filteredStudents.map((student) => {
              const statusDisplay = getStatusDisplay(student.status)
              const StatusIcon = statusDisplay.icon
              const isSelected = student.studentId === currentStudentId

              return (
                <button
                  key={student.id}
                  onClick={() => onSelectStudent(student.studentId)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg transition-all',
                    'hover:bg-muted/50',
                    isSelected && 'bg-primary/5 border-l-2 border-primary',
                    statusDisplay.bgColor,
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('flex-shrink-0', statusDisplay.color)}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground truncate">
                          {student.studentName}
                        </span>
                        {student.status === 'graded' && student.totalScore !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {student.totalScore}分
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{student.studentNumber}</span>
                        <span>·</span>
                        <span>{statusDisplay.label}</span>
                        {student.status === 'grading' && student.currentQuestionIndex && (
                          <>
                            <span>·</span>
                            <span>第 {student.currentQuestionIndex}/{student.totalQuestions} 题</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <User className="w-10 h-10 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">没有匹配的学生</p>
          </div>
        )}
      </div>
    </div>
  )
}
