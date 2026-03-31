'use client'

import type { ReactNode } from 'react'

export default function ImmersiveLayout({
  children,
}: {
  children: ReactNode
}) {
  // 沉浸式布局：无侧边栏、无顶部导航
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
