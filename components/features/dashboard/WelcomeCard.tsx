'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

interface WelcomeCardProps {
  className?: string
}

const motivationalTexts = [
  '继续保持学习，今天也要加油！',
  '每一步学习都是进步，继续努力！',
  '知识改变命运，学习成就未来！',
  '坚持就是胜利，加油！',
]

export function WelcomeCard({ className }: WelcomeCardProps): ReactNode {
  const { user } = useAuthStore()

  // 使用 useMemo 计算激励文案，基于时间变化
  const motivationalText = useMemo(() => {
    const index = new Date().getMinutes() % motivationalTexts.length
    return motivationalTexts[index]
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '早上好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-linear-to-br from-primary via-primary to-primary-700",
      "p-6 text-white shadow-lg",
      className
    )}>
      {/* 装饰性背景 */}
      <div className="absolute right-0 top-0 w-64 h-64 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="currentColor" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* 内容 */}
      <div className="relative z-10">
        <h1 className="text-2xl font-heading font-semibold">
          {getGreeting()}，{user?.name}
        </h1>
        <p className="mt-2 text-white/80">
          {motivationalText}
        </p>

        {/* 快捷操作 */}
        <div className="mt-4 flex gap-3">
          <Link
            href="/courses"
            className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
          >
            继续学习
          </Link>
          <Link
            href="/slices"
            className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
          >
            浏览切片
          </Link>
        </div>
      </div>
    </div>
  )
}
