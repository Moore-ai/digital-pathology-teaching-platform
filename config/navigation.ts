import {
  Home,
  BookOpen,
  Microscope,
  ClipboardList,
  MessageSquare,
  Settings,
  Users,
  FileText,
  BarChart3,
  PlusCircle,
  History,
  User,
  LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  children?: NavItem[]
}

export interface NavigationConfig {
  title: string
  items: NavItem[]
}

// 主导航配置
export const mainNavigation: NavItem[] = [
  { title: '首页', href: '/', icon: Home },
  { title: '课程中心', href: '/courses', icon: BookOpen },
  { title: '切片库', href: '/slices', icon: Microscope },
  { title: '考试中心', href: '/exams', icon: ClipboardList },
  { title: '讨论', href: '/discussions', icon: MessageSquare },
]

// 各模块侧边栏导航配置
export const sidebarNavigation: Record<string, NavigationConfig> = {
  '': {
    title: '首页',
    items: [
      { title: '概览', href: '/', icon: Home },
      { title: '学习进度', href: '/progress', icon: BarChart3 },
    ],
  },
  courses: {
    title: '课程中心',
    items: [
      { title: '全部课程', href: '/courses', icon: BookOpen },
      { title: '我的学习', href: '/courses/my', icon: User },
      { title: '学习进度', href: '/progress', icon: BarChart3 },
    ],
  },
  slices: {
    title: '切片库',
    items: [
      { title: '全部切片', href: '/slices', icon: Microscope },
      { title: '我的标注', href: '/slices/annotations', icon: FileText },
      { title: '上传切片', href: '/slices/upload', icon: PlusCircle },
    ],
  },
  exams: {
    title: '考试中心',
    items: [
      { title: '考试列表', href: '/exams', icon: ClipboardList },
      { title: '智能组卷', href: '/exams/create', icon: PlusCircle },
      { title: '成绩查询', href: '/exams/results', icon: BarChart3 },
      { title: '题库管理', href: '/exams/questions', icon: FileText },
    ],
  },
  discussions: {
    title: '讨论区',
    items: [
      { title: '全部讨论', href: '/discussions', icon: MessageSquare },
      { title: '我的提问', href: '/discussions/my', icon: User },
    ],
  },
  settings: {
    title: '系统设置',
    items: [
      { title: '功能设置', href: '/settings', icon: Settings },
      { title: '用户管理', href: '/settings/users', icon: Users },
      { title: '系统日志', href: '/settings/logs', icon: History },
    ],
  },
}

// 用户菜单配置
export const userMenuItems: NavItem[] = [
  { title: '个人中心', href: '/profile', icon: User },
  { title: '我的学习', href: '/progress', icon: BarChart3 },
  { title: '设置', href: '/settings', icon: Settings },
]

// 根据路径获取当前模块
export function getCurrentModule(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  return segments[0] || ''
}

// 根据路径获取侧边栏导航
export function getSidebarNav(pathname: string): NavigationConfig | null {
  const currentModule = getCurrentModule(pathname)
  return sidebarNavigation[currentModule] || null
}
