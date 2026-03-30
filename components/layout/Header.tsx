'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { mainNavigation } from '@/config/navigation'
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Microscope,
  ChevronDown,
  GraduationCap,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROLES } from '@/lib/constants'
import { ThemeToggle } from '@/components/shared'

interface HeaderProps {
  className?: string
  children?: ReactNode
}

export function Header({ className, children }: HeaderProps): ReactNode {
  const pathname = usePathname()
  const { user, logout, switchRole } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
      className
    )}>
      <div className="container-app flex h-16 items-center justify-between">
        {/* 左侧：移动端菜单按钮 + Logo */}
        <div className="flex items-center gap-2">
          {children}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Microscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-semibold text-lg text-primary hidden sm:inline">
              数字病理教学平台
            </span>
          </Link>
        </div>

        {/* 主导航 */}
        <nav className="hidden md:flex items-center gap-1">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {item.title}
              </Link>
            )
          })}
        </nav>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-2">
          {/* 主题切换 */}
          <ThemeToggle />

          {/* 搜索按钮 */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="w-5 h-5" />
            <span className="sr-only">搜索</span>
          </Button>

          {/* 通知按钮 */}
          <Button variant="ghost" size="icon" className="hidden sm:flex relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            <span className="sr-only">通知</span>
          </Button>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar size="sm">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 hidden sm:inline" />
                </Button>
              }
            />
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <span className="text-xs text-secondary mt-1">
                      {ROLES[user?.role || 'student']}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              {/* 角色切换（开发模式） */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  切换角色（原型演示）
                </DropdownMenuLabel>
                {Object.entries(ROLES).map(([role, label]) => (
                  <DropdownMenuItem
                    key={role}
                    onClick={() => switchRole(role as 'student' | 'teacher' | 'admin')}
                    className={cn(user?.role === role && "bg-muted")}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/profile" className="flex items-center" />}
              >
                <User className="w-4 h-4 mr-2" />
                个人中心
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href="/my-learning" className="flex items-center" />}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                我的学习
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href={isAdmin ? "/system-settings" : "/account-settings"} className="flex items-center" />}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isAdmin ? "系统设置" : "账号设置"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
