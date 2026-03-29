import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, isAfter, isBefore, differenceInMinutes } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// Tailwind 类名合并
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 日期格式化
export function formatDate(date: Date | string): string {
  return format(new Date(date), 'yyyy-MM-dd', { locale: zhCN })
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), 'yyyy-MM-dd HH:mm', { locale: zhCN })
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN })
}

// 时间相关
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

export function formatSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 考试状态判断
export function getExamTimeStatus(startTime: Date, endTime: Date): 'before' | 'ongoing' | 'ended' {
  const now = new Date()
  if (isBefore(now, startTime)) return 'before'
  if (isAfter(now, endTime)) return 'ended'
  return 'ongoing'
}

export function getRemainingMinutes(endTime: Date): number {
  return Math.max(0, differenceInMinutes(endTime, new Date()))
}

// 数字格式化
export function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  return num.toLocaleString()
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

// 字符串处理
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getInitials(name: string): string {
  return name.slice(0, 1)
}

// 随机生成 ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// 延迟函数
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 防抖
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
