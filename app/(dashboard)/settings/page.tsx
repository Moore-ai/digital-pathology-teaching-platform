'use client'

import type { ReactNode } from 'react'
import { PageWrapper } from '@/components/layout'
import { FeatureToggles, UserTable } from '@/components/features/settings'
import { mockUsers } from '@/lib/mock/users'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Settings,
  Users,
  FileText,
  Server,
  Shield,
  Database,
  Activity,
} from 'lucide-react'

export default function SettingsPage(): ReactNode {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  if (!isAdmin) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Card className="w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">权限不足</h3>
              <p className="text-sm text-muted-foreground">
                您没有访问系统设置的权限，请联系管理员。
              </p>
            </div>
          </Card>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-foreground">系统设置</h1>
        <p className="text-muted-foreground mt-1">
          管理系统配置、用户权限和功能开关
        </p>
      </div>

      {/* 系统状态概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Server className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">系统状态</div>
                <div className="font-medium text-success">运行正常</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">在线用户</div>
                <div className="font-medium">23 人</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">存储使用</div>
                <div className="font-medium">45.2 GB</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">今日请求</div>
                <div className="font-medium">1,234 次</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 设置标签页 */}
      <Tabs defaultValue="features">
        <TabsList>
          <TabsTrigger value="features" className="gap-2">
            <Settings className="w-4 h-4" />
            功能设置
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            用户管理
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-2">
            <FileText className="w-4 h-4" />
            系统日志
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="mt-6">
          <FeatureToggles />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserTable users={mockUsers} currentUserId={user?.id} />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>系统日志</CardTitle>
              <CardDescription>查看系统操作日志</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2026-03-29 14:32:15', user: '管理员', action: '修改功能开关', target: '智能组卷', status: 'success' },
                  { time: '2026-03-29 14:28:03', user: '王老师', action: '上传课程资源', target: '消化病理学', status: 'success' },
                  { time: '2026-03-29 14:15:42', user: '李同学', action: '提交考试', target: '第三单元测试', status: 'success' },
                  { time: '2026-03-29 13:58:20', user: '系统', action: '自动备份', target: '数据库', status: 'success' },
                  { time: '2026-03-29 13:45:11', user: '张同学', action: '登录系统', target: '-', status: 'success' },
                ].map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-40">{log.time}</span>
                      <span className="font-medium">{log.user}</span>
                      <span className="text-muted-foreground">{log.action}</span>
                      <span className="text-secondary">{log.target}</span>
                    </div>
                    <Badge variant="outline" className="text-success border-success/20">
                      成功
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline">加载更多</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  )
}
