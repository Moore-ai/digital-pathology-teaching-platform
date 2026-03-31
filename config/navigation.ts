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
  GraduationCap,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  children?: NavItem[]
  /** 允许访问的角色，不设置则表示所有角色都可访问 */
  roles?: Array<'student' | 'teacher' | 'admin'>
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

// 核心导航项（始终显示）
const coreNavItems: NavItem[] = [
  {
    title: '我的学习',
    href: '/my-learning',
    icon: GraduationCap,
    children: [
      { title: '学习进度', href: '/progress' },
    ],
  },
  { title: '全部课程', href: '/courses', icon: BookOpen },
]

// 各模块侧边栏导航配置
export const sidebarNavigation: Record<string, NavigationConfig> = {
  '': {
    title: '首页',
    items: [
      { title: '概览', href: '/', icon: Home },
      ...coreNavItems,
    ],
  },
  'my-learning': {
    title: '我的学习',
    items: coreNavItems,
  },
  progress: {
    title: '学习进度',
    items: coreNavItems,
  },
  courses: {
    title: '课程中心',
    items: coreNavItems,
  },
  slices: {
    title: '切片库',
    items: [
      ...coreNavItems,
      { title: '切片库', href: '/slices', icon: Microscope },
      { title: '我的标注', href: '/slices/annotations', icon: FileText },
      { title: '上传切片', href: '/slices/upload', icon: PlusCircle },
    ],
  },
  exams: {
    title: '考试中心',
    items: [
      ...coreNavItems,
      { title: '考试中心', href: '/exams', icon: ClipboardList },
      { title: '智能组卷', href: '/exams/create', icon: PlusCircle, roles: ['teacher', 'admin'] },
      { title: '成绩查询', href: '/exams/results', icon: BarChart3 },
    ],
  },
  discussions: {
    title: '讨论区',
    items: [
      ...coreNavItems,
      { title: '讨论区', href: '/discussions', icon: MessageSquare },
    ],
  },
  'system-settings': {
    title: '系统设置',
    items: [
      ...coreNavItems,
      { title: '系统设置', href: '/system-settings', icon: Settings },
      { title: '用户管理', href: '/system-settings/users', icon: Users },
      { title: '系统日志', href: '/system-settings/logs', icon: History },
    ],
  },
  settings: {
    title: '系统设置',
    items: [
      ...coreNavItems,
      { title: '系统设置', href: '/system-settings', icon: Settings },
      { title: '用户管理', href: '/system-settings/users', icon: Users },
      { title: '系统日志', href: '/system-settings/logs', icon: History },
    ],
  },
}

// 用户菜单配置
export const userMenuItems: NavItem[] = [
  { title: '个人中心', href: '/profile', icon: User },
  { title: '我的学习', href: '/my-learning', icon: GraduationCap },
  { title: '学习进度', href: '/progress', icon: BarChart3 },
]

// 根据路径获取当前模块
export function getCurrentModule(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0] || ''

  // 特殊路由映射
  const routeMapping: Record<string, string> = {
    'progress': 'progress',
    'profile': 'my-learning',
    'account-settings': 'my-learning',
    'analysis': 'my-learning',
    'system-settings': 'system-settings',
    'settings': 'system-settings',
  }

  if (routeMapping[firstSegment]) {
    return routeMapping[firstSegment]
  }

  return firstSegment
}

// 根据路径获取侧边栏导航
export function getSidebarNav(pathname: string): NavigationConfig | null {
  const currentModule = getCurrentModule(pathname)
  return sidebarNavigation[currentModule] || null
}
