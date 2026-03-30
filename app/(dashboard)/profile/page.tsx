'use client'

import type { ReactNode } from 'react'
import { PageWrapper } from '@/components/layout'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <p className="text-muted-foreground">请先登录</p>
          </div>
        </Card>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-foreground">个人中心</h1>
        <p className="text-muted-foreground mt-1">
          查看和管理您的个人信息
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：个人信息卡片 */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name?.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <div className="mt-2">
              <Badge className="bg-primary/10 text-primary">
                {ROLES[user.role]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">所属机构：</span>
              <span>病理学系</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">注册时间：</span>
              <span>2024-09-01</span>
            </div>
          </CardContent>
        </Card>

        {/* 右侧：详细信息 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">基本信息</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Edit2 className="w-4 h-4" />
                  编辑
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    姓名
                  </label>
                  <Input value={user.name} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    邮箱
                  </label>
                  <Input value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    手机号
                  </label>
                  <Input value="138****8888" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    角色
                  </label>
                  <Input value={ROLES[user.role]} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 安全设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">安全设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">登录密码</div>
                    <div className="text-sm text-muted-foreground">定期更换密码可以提高账号安全性</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">修改</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">消息通知</div>
                    <div className="text-sm text-muted-foreground">管理系统通知和邮件提醒</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">设置</Button>
              </div>
            </CardContent>
          </Card>

          {/* 学习统计（仅学生） */}
          {user.role === 'student' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">学习统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">已完成课程</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-secondary">86</div>
                    <div className="text-sm text-muted-foreground">学习小时</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-accent">24</div>
                    <div className="text-sm text-muted-foreground">查看切片</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="text-2xl font-bold text-success">92</div>
                    <div className="text-sm text-muted-foreground">平均分数</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
