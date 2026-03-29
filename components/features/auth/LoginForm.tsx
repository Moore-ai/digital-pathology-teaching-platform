'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  className?: string
}

export function LoginForm({ className }: LoginFormProps): ReactNode {
  const router = useRouter()
  const { login } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'student@example.com',
      password: 'password',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(data.email, data.password)
      router.push('/')
    } catch {
      setError('登录失败，请检查邮箱和密码')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      {/* 邮箱输入 */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          邮箱 / 学工号
        </label>
        <Input
          id="email"
          type="email"
          placeholder="请输入邮箱"
          {...register('email')}
          className={errors.email ? 'border-error' : ''}
        />
        {errors.email && (
          <p className="text-xs text-error">{errors.email.message}</p>
        )}
      </div>

      {/* 密码输入 */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          密码
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="请输入密码"
            {...register('password')}
            className={cn("pr-10", errors.password ? 'border-error' : '')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-error">{errors.password.message}</p>
        )}
      </div>

      {/* 记住登录 & 忘记密码 */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-input" />
          <span className="text-muted-foreground">保持登录</span>
        </label>
        <a href="#" className="text-secondary hover:underline">
          忘记密码？
        </a>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
          {error}
        </div>
      )}

      {/* 登录按钮 */}
      <Button
        type="submit"
        className="w-full h-10"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            登录中...
          </>
        ) : (
          '登 录'
        )}
      </Button>

      {/* 提示信息 */}
      <p className="text-xs text-muted-foreground text-center">
        原型演示：直接点击登录即可进入系统
      </p>
    </form>
  )
}
