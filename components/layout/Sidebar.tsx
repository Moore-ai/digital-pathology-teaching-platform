'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getSidebarNav } from '@/config/navigation'
import { useAuthStore } from '@/stores/authStore'
import { ChevronRight, ChevronDown, X, Menu } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps): ReactNode {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const [userExpandedItems, setUserExpandedItems] = useState<string[]>([])
  const navConfig = getSidebarNav(pathname)

  // 根据用户角色过滤导航项
  const filteredItems = useMemo(() => {
    if (!navConfig) return []
    return navConfig.items.filter(item => {
      if (!item.roles) return true
      return user && item.roles.includes(user.role)
    }).map(item => ({
      ...item,
      children: item.children?.filter(child => {
        if (!child.roles) return true
        return user && child.roles.includes(user.role)
      })
    }))
  }, [navConfig, user])

  // 计算应该自动展开的菜单项
  const autoExpandedItems = useMemo(() => {
    if (!filteredItems) return []
    const items: string[] = []
    filteredItems.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child =>
          pathname === child.href || pathname.startsWith(child.href + '/')
        )
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        if (hasActiveChild || isActive) {
          items.push(item.title)
        }
      }
    })
    return items
  }, [pathname, filteredItems])

  // 合并自动展开和用户手动展开的项
  const expandedItems = useMemo(() => {
    return [...new Set([...autoExpandedItems, ...userExpandedItems])]
  }, [autoExpandedItems, userExpandedItems])

  // 路由变化时关闭移动端菜单
  useEffect(() => {
    onClose?.()
  }, [pathname, onClose])

  if (!navConfig) return null

  const toggleExpand = (title: string) => {
    setUserExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(i => i !== title)
        : [...prev, title]
    )
  }

  return (
    <>
      {/* 移动端遮罩 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-64 border-r bg-card shrink-0",
        // 移动端：固定定位，可滑出，z-index 低于 Header(50) 高于遮罩(40)
        // 桌面端：相对定位，不设置 z-index
        "fixed lg:relative inset-y-0 left-0 z-45 lg:z-0",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        {/* 移动端关闭按钮 */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b">
          <span className="font-medium">{navConfig.title}</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-3 hidden lg:block">
            {navConfig.title}
          </h2>
          <nav className="space-y-1">
            {filteredItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                pathname={pathname}
                expanded={expandedItems.includes(item.title)}
                onToggle={() => toggleExpand(item.title)}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

interface NavItemProps {
  item: {
    title: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
    children?: Array<{ title: string; href: string }>
  }
  pathname: string
  expanded: boolean
  onToggle: () => void
}

function NavItem({ item, pathname, expanded, onToggle }: NavItemProps): ReactNode {
  const isActive = pathname === item.href
  const hasChildren = item.children && item.children.length > 0
  // 检查子项是否激活
  const hasActiveChild = item.children?.some(child =>
    pathname === child.href || pathname.startsWith(child.href + '/')
  )
  const Icon = item.icon

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            "hover:bg-muted",
            (isActive || hasActiveChild) ? "bg-secondary/10 text-secondary" : "text-foreground"
          )}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-4 h-4" />}
            <span>{item.title}</span>
          </div>
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {expanded && item.children && (
          <div className="ml-4 mt-1 space-y-1 border-l-2 border-muted pl-3">
            {item.children.map((child) => {
              const childActive = pathname === child.href
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm transition-colors",
                    childActive
                      ? "bg-secondary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {child.title}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-secondary text-white"
          : "text-foreground hover:bg-muted"
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {item.title}
    </Link>
  )
}

// 移动端菜单按钮
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="w-5 h-5" />
    </Button>
  )
}
