'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ScoreSliderProps {
  value: number
  max: number
  onChange: (value: number) => void
  className?: string
}

export function ScoreSlider({
  value,
  max,
  onChange,
  className,
}: ScoreSliderProps): ReactNode {
  const handleQuickScore = (type: 'full' | 'zero' | 'half' | 'three_quarter') => {
    switch (type) {
      case 'full':
        onChange(max)
        break
      case 'zero':
        onChange(0)
        break
      case 'half':
        onChange(Math.round(max / 2))
        break
      case 'three_quarter':
        onChange(Math.round(max * 0.75))
        break
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* 滑块 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{max / 2}</span>
          <span>{max}</span>
        </div>
        <Slider
          value={[value]}
          max={max}
          step={1}
          onValueChange={(vals) => onChange(vals[0])}
          className="w-full"
        />
      </div>

      {/* 快捷分数按钮 */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickScore('full')}
          className="flex-1 text-xs h-8"
        >
          满分
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickScore('three_quarter')}
          className="flex-1 text-xs h-8"
        >
          75%
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickScore('half')}
          className="flex-1 text-xs h-8"
        >
          半分
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleQuickScore('zero')}
          className="flex-1 text-xs h-8"
        >
          零分
        </Button>
      </div>
    </div>
  )
}
