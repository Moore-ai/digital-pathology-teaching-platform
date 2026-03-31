'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { FileBarChart } from 'lucide-react'
import Link from 'next/link'

interface EmptyResultsProps {
  className?: string
}

export function EmptyResults({ className }: EmptyResultsProps): ReactNode {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className || ''}`}>
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 relative">
        <FileBarChart className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">暂无成绩记录</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        完成考试后可在此查看成绩
      </p>
      <Link href="/exams">
        <Button variant="outline">
          前往考试中心
        </Button>
      </Link>
    </div>
  )
}
