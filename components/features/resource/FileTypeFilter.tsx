'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { FileText, FileVideo, Presentation, Microscope, Layers } from 'lucide-react'
import { ResourceType } from '@/types/resource'
import { getFileTypeStats } from '@/lib/mock/resources'

interface FileTypeFilterProps {
  selectedType: ResourceType | 'all'
  onTypeChange: (type: ResourceType | 'all') => void
  className?: string
}

const filterOptions: { type: ResourceType | 'all'; label: string; icon: ReactNode }[] = [
  { type: 'all', label: '全部', icon: <Layers className="w-4 h-4" /> },
  { type: 'svs', label: '切片', icon: <Microscope className="w-4 h-4" /> },
  { type: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
  { type: 'ppt', label: 'PPT', icon: <Presentation className="w-4 h-4" /> },
  { type: 'video', label: '视频', icon: <FileVideo className="w-4 h-4" /> },
]

export function FileTypeFilter({
  selectedType,
  onTypeChange,
  className,
}: FileTypeFilterProps): ReactNode {
  const stats = getFileTypeStats()

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {filterOptions.map(option => {
        const count = option.type === 'all'
          ? Object.values(stats).reduce((a, b) => a + b, 0)
          : stats[option.type]

        const isSelected = selectedType === option.type

        return (
          <Button
            key={option.type}
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTypeChange(option.type)}
            className="gap-1.5"
          >
            {option.icon}
            <span>{option.label}</span>
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded',
              isSelected ? 'bg-primary-foreground/20' : 'bg-muted',
            )}>
              {count}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
