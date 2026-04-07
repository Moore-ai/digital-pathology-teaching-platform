'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { useAuthStore } from '@/stores/authStore'
import {
  Box,
  Typography,
  Stack,
  Paper,
  Avatar,
  Button,
  TextField,
  Switch,
  Tabs,
  Tab,
} from '@mui/material'
import { ROLES } from '@/lib/constants'
import type { User } from '@/types/user'
import {
  User as UserIcon,
  Mail,
  Phone,
  Lock,
  Bell,
  Eye,
  Camera,
} from 'lucide-react'

// TextField 样式
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'var(--background)',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'var(--border)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
    '&.Mui-disabled fieldset': { borderColor: 'var(--border)' },
  },
  '& .MuiInputBase-input': { color: 'var(--foreground)' },
  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: 'var(--foreground)',
  },
}

// 个人信息表单组件
function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [bio, setBio] = useState('热爱病理学习的学生')

  return (
    <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
          个人信息
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
          修改您的个人资料
        </Typography>
      </Box>
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 头像 */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            src={user.avatar}
            sx={{ width: 80, height: 80, bgcolor: 'var(--primary)', fontSize: '1.5rem' }}
          >
            {user.name?.slice(0, 1)}
          </Avatar>
          <Box>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
              }}
            >
              <Camera className="w-4 h-4" style={{ marginRight: 8 }} />
              更换头像
            </Button>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'var(--muted-foreground)' }}>
              支持 JPG、PNG 格式，最大 2MB
            </Typography>
          </Box>
        </Stack>

        {/* 表单 */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}>
              昵称
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={textFieldSx}
            />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}>
              角色
            </Typography>
            <TextField fullWidth size="small" value={ROLES[user.role]} disabled sx={textFieldSx} />
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Mail className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                邮箱
              </Typography>
            </Stack>
            <TextField
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textFieldSx}
            />
          </Box>
          <Box>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
              <Phone className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                手机号
              </Typography>
            </Stack>
            <TextField fullWidth size="small" value="138****8888" disabled sx={textFieldSx} />
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}>
            个人简介
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="介绍一下自己..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            sx={textFieldSx}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{ bgcolor: 'var(--primary)', '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 } }}
          >
            保存修改
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

// 设置项组件
function SettingItem({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 2,
        borderRadius: 1,
        border: '1px solid var(--border)',
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
          {description}
        </Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary)' },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--primary)' },
        }}
      />
    </Stack>
  )
}

// 通知偏好组件
function NotificationsForm() {
  const [notifications, setNotifications] = useState({
    system: true,
    email: true,
    course: true,
    exam: true,
    discussion: false,
  })

  const items = [
    { key: 'system', title: '系统通知', description: '接收平台系统公告和更新通知' },
    { key: 'email', title: '邮件通知', description: '通过邮件接收重要消息' },
    { key: 'course', title: '课程更新提醒', description: '课程有新内容时通知您' },
    { key: 'exam', title: '考试提醒', description: '考试开始前提醒您' },
    { key: 'discussion', title: '讨论回复通知', description: '有人回复您的讨论时通知您' },
  ]

  return (
    <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
          通知偏好
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
          设置您希望接收的通知类型
        </Typography>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => (
          <SettingItem
            key={item.key}
            title={item.title}
            description={item.description}
            checked={notifications[item.key as keyof typeof notifications]}
            onChange={(checked) =>
              setNotifications((prev) => ({ ...prev, [item.key]: checked }))
            }
          />
        ))}
      </Box>
    </Paper>
  )
}

// 隐私设置组件
function PrivacyForm() {
  const [privacy, setPrivacy] = useState({
    progress: true,
    examScore: false,
    profile: true,
    onlineStatus: true,
  })

  const items = [
    { key: 'progress', title: '学习进度公开', description: '允许其他用户查看您的学习进度' },
    { key: 'examScore', title: '考试成绩公开', description: '允许其他用户查看您的考试成绩' },
    { key: 'profile', title: '个人资料公开', description: '允许其他用户查看您的个人资料' },
    { key: 'onlineStatus', title: '在线状态显示', description: '向其他用户显示您的在线状态' },
  ]

  return (
    <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
          隐私设置
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
          管理您的隐私和个人信息公开程度
        </Typography>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => (
          <SettingItem
            key={item.key}
            title={item.title}
            description={item.description}
            checked={privacy[item.key as keyof typeof privacy]}
            onChange={(checked) =>
              setPrivacy((prev) => ({ ...prev, [item.key]: checked }))
            }
          />
        ))}
      </Box>
    </Paper>
  )
}

// 安全设置项组件
function SecurityItem({
  icon,
  title,
  description,
  buttonLabel,
}: {
  icon: ReactNode
  title: string
  description: string
  buttonLabel: string
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 2,
        borderRadius: 1,
        border: '1px solid var(--border)',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {icon}
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
            {description}
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
        {buttonLabel}
      </Button>
    </Stack>
  )
}

export default function AccountSettingsPage(): ReactNode {
  const { user } = useAuthStore()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')

  // 当用户角色变化时重定向
  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/system-settings')
    }
  }, [user?.role, router])

  if (!user) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Paper sx={{ width: '100%', maxWidth: 400, p: 3, textAlign: 'center', bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
          <Typography sx={{ color: 'var(--muted-foreground)' }}>请先登录</Typography>
        </Paper>
      </PageWrapper>
    )
  }

  // 管理员不应看到此页面
  if (user.role === 'admin') {
    return null
  }

  const tabs = [
    { value: 'profile', label: '个人信息', icon: <UserIcon className="w-4 h-4" /> },
    { value: 'security', label: '账号安全', icon: <Lock className="w-4 h-4" /> },
    { value: 'notifications', label: '通知偏好', icon: <Bell className="w-4 h-4" /> },
    { value: 'privacy', label: '隐私设置', icon: <Eye className="w-4 h-4" /> },
  ]

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
          账号设置
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
          管理您的个人信息和账号安全
        </Typography>
      </Box>

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

        {/* 个人信息 */}
        {activeTab === 'profile' && (
          <Box sx={{ mt: 3 }}>
            <ProfileForm user={user} key={user.id} />
          </Box>
        )}

        {/* 账号安全 */}
        {activeTab === 'security' && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                  账号安全
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                  管理您的账号安全设置
                </Typography>
              </Box>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <SecurityItem
                  icon={<Lock className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />}
                  title="登录密码"
                  description="定期更换密码可以提高账号安全性"
                  buttonLabel="修改密码"
                />
                <SecurityItem
                  icon={<Mail className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />}
                  title="邮箱绑定"
                  description={`已绑定：${user.email}`}
                  buttonLabel="更换邮箱"
                />
                <SecurityItem
                  icon={<Phone className="w-5 h-5" style={{ color: 'var(--muted-foreground)' }} />}
                  title="手机绑定"
                  description="已绑定：138****8888"
                  buttonLabel="更换手机"
                />
              </Box>
            </Paper>
          </Box>
        )}

        {/* 通知偏好 */}
        {activeTab === 'notifications' && (
          <Box sx={{ mt: 3 }}>
            <NotificationsForm />
          </Box>
        )}

        {/* 隐私设置 */}
        {activeTab === 'privacy' && (
          <Box sx={{ mt: 3 }}>
            <PrivacyForm />
          </Box>
        )}
      </Box>
    </PageWrapper>
  )
}
