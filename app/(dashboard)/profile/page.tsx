'use client'

import type { ReactNode } from 'react'
import { PageWrapper } from '@/components/layout'
import { useAuthStore } from '@/stores/authStore'
import {
  Box,
  Typography,
  Stack,
  Paper,
  Avatar,
  Chip,
  Button,
  TextField,
} from '@mui/material'
import { ROLES } from '@/lib/constants'
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Edit2,
  Key,
  Bell,
  Shield,
} from 'lucide-react'

export default function ProfilePage(): ReactNode {
  const { user } = useAuthStore()

  if (!user) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Paper sx={{ width: '100%', maxWidth: 400, p: 3, textAlign: 'center', bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Typography sx={{ color: 'var(--muted-foreground)' }}>请先登录</Typography>
        </Paper>
      </PageWrapper>
    )
  }

  // TextField 样式
  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: 'var(--background)',
      '& fieldset': { borderColor: 'var(--border)' },
      '&:hover fieldset': { borderColor: 'var(--border)' },
      '&.Mui-disabled fieldset': { borderColor: 'var(--border)' },
    },
    '& .MuiInputBase-input': { color: 'var(--foreground)' },
    '& .MuiInputBase-input.Mui-disabled': {
      WebkitTextFillColor: 'var(--foreground)',
      color: 'var(--foreground)',
    },
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
          个人中心
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
          查看和管理您的个人信息
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 3 }}>
        {/* 左侧：个人信息卡片 */}
        <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
            <Avatar
              src={user.avatar}
              sx={{
                width: 96,
                height: 96,
                mx: 'auto',
                mb: 2,
                bgcolor: 'var(--primary)',
                fontSize: '2rem',
              }}
            >
              {user.name?.slice(0, 1)}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
              {user.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
              {user.email}
            </Typography>
            <Box sx={{ mt: 1.5 }}>
              <Chip
                size="small"
                label={ROLES[user.role]}
                sx={{
                  bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
                  '& .MuiChip-label': { color: 'var(--primary)' },
                }}
              />
            </Box>
          </Box>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Building className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                所属机构：
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--foreground)' }}>
                病理学系
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Calendar className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                注册时间：
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--foreground)' }}>
                2024-09-01
              </Typography>
            </Stack>
          </Box>
        </Paper>

        {/* 右侧：详细信息 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 基本信息 */}
          <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  基本信息
                </Typography>
                <Button
                  size="small"
                  sx={{
                    color: 'var(--muted-foreground)',
                    '&:hover': { bgcolor: 'var(--muted)' },
                  }}
                >
                  <Edit2 className="w-4 h-4" style={{ marginRight: 4 }} />
                  编辑
                </Button>
              </Stack>
            </Box>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <User className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                      姓名
                    </Typography>
                  </Stack>
                  <TextField fullWidth size="small" value={user.name} disabled sx={textFieldSx} />
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Mail className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                      邮箱
                    </Typography>
                  </Stack>
                  <TextField fullWidth size="small" value={user.email} disabled sx={textFieldSx} />
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Phone className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                      手机号
                    </Typography>
                  </Stack>
                  <TextField fullWidth size="small" value="138****8888" disabled sx={textFieldSx} />
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <Shield className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                      角色
                    </Typography>
                  </Stack>
                  <TextField fullWidth size="small" value={ROLES[user.role]} disabled sx={textFieldSx} />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* 安全设置 */}
          <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                安全设置
              </Typography>
            </Box>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid var(--border)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Key className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                      登录密码
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                      定期更换密码可以提高账号安全性
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
                  }}
                >
                  修改
                </Button>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid var(--border)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Bell className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                      消息通知
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                      管理系统通知和邮件提醒
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                    '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
                  }}
                >
                  设置
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* 学习统计（仅学生） */}
          {user.role === 'student' && (
            <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  学习统计
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                  {[
                    { value: '12', label: '已完成课程', color: 'var(--primary)' },
                    { value: '86', label: '学习小时', color: 'var(--secondary)' },
                    { value: '24', label: '查看切片', color: 'var(--accent)' },
                    { value: '92', label: '平均分数', color: 'var(--success)' },
                  ].map((stat, index) => (
                    <Box
                      key={index}
                      sx={{
                        textAlign: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)',
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </PageWrapper>
  )
}
