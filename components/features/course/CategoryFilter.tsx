'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { type CourseCategory } from '@/types/course'

interface CategoryFilterProps {
  className?: string
  selected: CourseCategory | 'all'
  onSelect: (category: CourseCategory | 'all') => void
}

const categories: Array<{ value: CourseCategory | 'all'; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'digestive', label: '消化系统' },
  { value: 'respiratory', label: '呼吸系统' },
  { value: 'cardiovascular', label: '心血管系统' },
  { value: 'endocrine', label: '内分泌系统' },
  { value: 'nervous', label: '神经系统' },
  { value: 'breast', label: '乳腺' },
  { value: 'urinary', label: '泌尿系统' },
  { value: 'other', label: '其他' },
]

export function CategoryFilter({ className, selected, onSelect }: CategoryFilterProps): ReactNode {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
            selected === cat.value
              ? "bg-secondary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
