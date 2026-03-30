'use client'

import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
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

// 个人信息表单组件
function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [bio, setBio] = useState('热爱病理学习的学生')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">个人信息</CardTitle>
        <CardDescription>修改您的个人资料</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 头像 */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xl">{user.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="gap-2">
              <Camera className="w-4 h-4" />
              更换头像
            </Button>
            <p className="text-xs text-muted-foreground mt-2">支持 JPG、PNG 格式，最大 2MB</p>
          </div>
        </div>

        {/* 表单 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">昵称</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">角色</label>
            <Input value={ROLES[user.role]} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4" />
              邮箱
            </label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4" />
              手机号
            </label>
            <Input value="138****8888" disabled />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">个人简介</label>
          <textarea
            className="w-full min-h-25 px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="介绍一下自己..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button>保存修改</Button>
        </div>
      </CardContent>
    </Card>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">通知偏好</CardTitle>
        <CardDescription>设置您希望接收的通知类型</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">系统通知</div>
            <div className="text-sm text-muted-foreground">接收平台系统公告和更新通知</div>
          </div>
          <Switch
            checked={notifications.system}
            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, system: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">邮件通知</div>
            <div className="text-sm text-muted-foreground">通过邮件接收重要消息</div>
          </div>
          <Switch
            checked={notifications.email}
            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">课程更新提醒</div>
            <div className="text-sm text-muted-foreground">课程有新内容时通知您</div>
          </div>
          <Switch
            checked={notifications.course}
            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, course: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">考试提醒</div>
            <div className="text-sm text-muted-foreground">考试开始前提醒您</div>
          </div>
          <Switch
            checked={notifications.exam}
            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, exam: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">讨论回复通知</div>
            <div className="text-sm text-muted-foreground">有人回复您的讨论时通知您</div>
          </div>
          <Switch
            checked={notifications.discussion}
            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, discussion: checked }))}
          />
        </div>
      </CardContent>
    </Card>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">隐私设置</CardTitle>
        <CardDescription>管理您的隐私和个人信息公开程度</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">学习进度公开</div>
            <div className="text-sm text-muted-foreground">允许其他用户查看您的学习进度</div>
          </div>
          <Switch
            checked={privacy.progress}
            onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, progress: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">考试成绩公开</div>
            <div className="text-sm text-muted-foreground">允许其他用户查看您的考试成绩</div>
          </div>
          <Switch
            checked={privacy.examScore}
            onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, examScore: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">个人资料公开</div>
            <div className="text-sm text-muted-foreground">允许其他用户查看您的个人资料</div>
          </div>
          <Switch
            checked={privacy.profile}
            onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, profile: checked }))}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div>
            <div className="font-medium">在线状态显示</div>
            <div className="text-sm text-muted-foreground">向其他用户显示您的在线状态</div>
          </div>
          <Switch
            checked={privacy.onlineStatus}
            onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, onlineStatus: checked }))}
          />
        </div>
      </CardContent>
    </Card>
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
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <p className="text-muted-foreground">请先登录</p>
          </div>
        </Card>
      </PageWrapper>
    )
  }

  // 管理员不应看到此页面
  if (user.role === 'admin') {
    return null
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-foreground">账号设置</h1>
        <p className="text-muted-foreground mt-1">
          管理您的个人信息和账号安全
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <UserIcon className="w-4 h-4" />
            个人信息
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" />
            账号安全
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            通知偏好
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Eye className="w-4 h-4" />
            隐私设置
          </TabsTrigger>
        </TabsList>

        {/* 个人信息 */}
        <TabsContent value="profile" className="mt-6">
          <ProfileForm user={user} key={user.id} />
        </TabsContent>

        {/* 账号安全 */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">账号安全</CardTitle>
              <CardDescription>管理您的账号安全设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">登录密码</div>
                    <div className="text-sm text-muted-foreground">定期更换密码可以提高账号安全性</div>
                  </div>
                </div>
                <Button variant="outline">修改密码</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">邮箱绑定</div>
                    <div className="text-sm text-muted-foreground">已绑定：{user.email}</div>
                  </div>
                </div>
                <Button variant="outline">更换邮箱</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">手机绑定</div>
                    <div className="text-sm text-muted-foreground">已绑定：138****8888</div>
                  </div>
                </div>
                <Button variant="outline">更换手机</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知偏好 */}
        <TabsContent value="notifications" className="mt-6">
          <NotificationsForm />
        </TabsContent>

        {/* 隐私设置 */}
        <TabsContent value="privacy" className="mt-6">
          <PrivacyForm />
        </TabsContent>
      </Tabs>
    </PageWrapper>
  )
}
