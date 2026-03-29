'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SliceCategoryFilterProps {
  className?: string
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

// 切片分类（与课程分类对应）
const categories: Array<{ value: string; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'digestive', label: '消化系统' },
  { value: 'respiratory', label: '呼吸系统' },
  { value: 'breast', label: '乳腺' },
  { value: 'endocrine', label: '内分泌' },
  { value: 'urinary', label: '泌尿系统' },
  { value: 'nervous', label: '神经系统' },
  { value: 'cardiovascular', label: '心血管' },
  { value: 'reproductive', label: '生殖系统' },
  { value: 'other', label: '其他' },
]

export function SliceCategoryFilter({
  className,
  selectedCategory,
  onCategoryChange,
}: SliceCategoryFilterProps): ReactNode {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value === 'all' ? null : category.value)}
          className="text-sm"
        >
          {category.label}
        </Button>
      ))}
    </div>
  )
}
