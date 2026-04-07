'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { FeatureToggles, UserTable } from '@/components/features/settings'
import { mockUsers } from '@/lib/mock/users'
import { useAuthStore } from '@/stores/authStore'
import {
  Box,
  Typography,
  Stack,
  Paper,
  Tabs,
  Tab,
  Chip,
} from '@mui/material'
import {
  Settings,
  Users,
  FileText,
  Server,
  Database,
  Activity,
} from 'lucide-react'

export default function SettingsPage(): ReactNode {
  const { user } = useAuthStore()
  const router = useRouter()
  const isAdmin = user?.role === 'admin'
  const [activeTab, setActiveTab] = useState('features')

  // 当用户角色变化时重定向
  useEffect(() => {
    if (user && !isAdmin) {
      router.replace('/account-settings')
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return null
  }

  const statusCards = [
    {
      icon: Server,
      label: '系统状态',
      value: '运行正常',
      color: 'var(--success)',
      bgColor: 'color-mix(in srgb, var(--success) 10%, transparent)',
    },
    {
      icon: Users,
      label: '在线用户',
      value: '23 人',
      color: 'var(--primary)',
      bgColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
    },
    {
      icon: Database,
      label: '存储使用',
      value: '45.2 GB',
      color: 'var(--secondary)',
      bgColor: 'color-mix(in srgb, var(--secondary) 10%, transparent)',
    },
    {
      icon: Activity,
      label: '今日请求',
      value: '1,234 次',
      color: 'var(--warning)',
      bgColor: 'color-mix(in srgb, var(--warning) 10%, transparent)',
    },
  ]

  const logs = [
    { time: '2026-03-29 14:32:15', user: '管理员', action: '修改功能开关', target: '智能组卷' },
    { time: '2026-03-29 14:28:03', user: '王老师', action: '上传课程资源', target: '消化病理学' },
    { time: '2026-03-29 14:15:42', user: '李同学', action: '提交考试', target: '第三单元测试' },
    { time: '2026-03-29 13:58:20', user: '系统', action: '自动备份', target: '数据库' },
    { time: '2026-03-29 13:45:11', user: '张同学', action: '登录系统', target: '-' },
  ]

  const tabs = [
    { value: 'features', label: '功能设置', icon: <Settings className="w-4 h-4" /> },
    { value: 'users', label: '用户管理', icon: <Users className="w-4 h-4" /> },
    { value: 'logs', label: '系统日志', icon: <FileText className="w-4 h-4" /> },
  ]

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
          系统设置
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
          管理系统配置、用户权限和功能开关
        </Typography>
      </Box>

      {/* 系统状态概览 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {statusCards.map((card, index) => (
          <Paper key={index} sx={{ p: 2, bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: card.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                  {card.label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: card.color }}>
                  {card.value}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* 设置标签页 */}
      <Box>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{
            borderBottom: '1px solid var(--border)',
            '& .MuiTabs-indicator': { bgcolor: 'var(--primary)' },
            '& .MuiTab-root': {
              color: 'var(--muted-foreground)',
              minHeight: 48,
              '&.Mui-selected': { color: 'var(--primary)' },
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </Stack>
              }
            />
          ))}
        </Tabs>

        {/* 功能设置 */}
        {activeTab === 'features' && (
          <Box sx={{ mt: 3 }}>
            <FeatureToggles />
          </Box>
        )}

        {/* 用户管理 */}
        {activeTab === 'users' && (
          <Box sx={{ mt: 3 }}>
            <UserTable users={mockUsers} currentUserId={user?.id} />
          </Box>
        )}

        {/* 系统日志 */}
        {activeTab === 'logs' && (
          <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                系统日志
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                查看系统操作日志
              </Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {logs.map((log, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', width: 160 }}>
                        {log.time}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                        {log.user}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                        {log.action}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--secondary)' }}>
                        {log.target}
                      </Typography>
                    </Stack>
                    <Chip
                      size="small"
                      label="成功"
                      sx={{
                        bgcolor: 'color-mix(in srgb, var(--success) 10%, transparent)',
                        '& .MuiChip-label': { color: 'var(--success)' },
                        border: '1px solid color-mix(in srgb, var(--success) 20%, transparent)',
                      }}
                    />
                  </Stack>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                    '&:hover': { color: 'var(--foreground)' },
                  }}
                >
                  加载更多
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    </PageWrapper>
  )
}
