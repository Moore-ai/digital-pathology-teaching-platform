'use client'

import type { ReactNode } from 'react'
import { useThemeStore } from '@/stores/themeStore'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Monitor } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ThemeToggleProps {
  className?: string
}

const themes = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '系统', icon: Monitor },
] as const

export function ThemeToggle({ className }: ThemeToggleProps): ReactNode {
  const { setTheme } = useThemeStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className={className}>
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">切换主题</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {themes.map((t) => {
          const ThemeIcon = t.icon
          return (
            <DropdownMenuItem
              key={t.value}
              onClick={() => setTheme(t.value)}
              className="gap-2"
            >
              <ThemeIcon className="w-4 h-4" />
              {t.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
