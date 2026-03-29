'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { Header, Sidebar, MobileMenuButton } from '@/components/layout'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header>
        <MobileMenuButton onClick={() => setSidebarOpen(true)} />
      </Header>
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          className="min-h-[calc(100vh-4rem)]"
        />
        <main className="flex-1 p-4 md:p-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
