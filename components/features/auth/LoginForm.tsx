'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/authStore'
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material'
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
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      className={className}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      {/* 邮箱输入 */}
      <Box>
        <Typography
          component="label"
          htmlFor="email"
          variant="body2"
          sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}
        >
          邮箱 / 学工号
        </Typography>
        <TextField
          id="email"
          type="email"
          placeholder="请输入邮箱"
          fullWidth
          size="small"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'var(--background)',
              '& fieldset': { borderColor: errors.email ? 'var(--error)' : 'var(--border)' },
              '&:hover fieldset': { borderColor: errors.email ? 'var(--error)' : 'var(--border)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            '& .MuiInputBase-input': { color: 'var(--foreground)' },
            '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
            '& .MuiFormHelperText-root': { color: 'var(--error)', mx: 0 },
          }}
        />
      </Box>

      {/* 密码输入 */}
      <Box>
        <Typography
          component="label"
          htmlFor="password"
          variant="body2"
          sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}
        >
          密码
        </Typography>
        <TextField
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="请输入密码"
          fullWidth
          size="small"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  sx={{ color: 'var(--muted-foreground)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'var(--background)',
              '& fieldset': { borderColor: errors.password ? 'var(--error)' : 'var(--border)' },
              '&:hover fieldset': { borderColor: errors.password ? 'var(--error)' : 'var(--border)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            '& .MuiInputBase-input': { color: 'var(--foreground)' },
            '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
            '& .MuiFormHelperText-root': { color: 'var(--error)', mx: 0 },
          }}
        />
      </Box>

      {/* 记住登录 & 忘记密码 */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              sx={{
                color: 'var(--border)',
                '&.Mui-checked': { color: 'var(--primary)' },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              保持登录
            </Typography>
          }
        />
        <MuiLink
          href="#"
          variant="body2"
          sx={{ color: 'var(--secondary)', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          忘记密码？
        </MuiLink>
      </Stack>

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ bgcolor: 'color-mix(in srgb, var(--error) 10%, transparent)', color: 'var(--error)' }}>
          {error}
        </Alert>
      )}

      {/* 登录按钮 */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isLoading}
        sx={{
          height: 40,
          bgcolor: 'var(--primary)',
          '&:hover': { bgcolor: 'var(--primary)' },
          '&.Mui-disabled': { bgcolor: 'var(--muted)', color: 'var(--muted-foreground)' },
        }}
      >
        {isLoading ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>登录中...</span>
          </Stack>
        ) : (
          '登 录'
        )}
      </Button>

      {/* 提示信息 */}
      <Typography variant="caption" sx={{ textAlign: 'center', color: 'var(--muted-foreground)' }}>
        原型演示：直接点击登录即可进入系统
      </Typography>
    </Box>
  )
}
