'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { User } from '@/types/user'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserTableProps {
  className?: string
  users: User[]
  currentUserId?: string
}

const roleLabels: Record<string, { label: string; color: string }> = {
  student: { label: '学生', color: 'bg-blue-100 text-blue-800' },
  teacher: { label: '教师', color: 'bg-amber-100 text-amber-800' },
  admin: { label: '管理员', color: 'bg-purple-100 text-purple-800' },
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: '正常', color: 'bg-success/10 text-success' },
  inactive: { label: '禁用', color: 'bg-destructive/10 text-destructive' },
}

export function UserTable({ className, users, currentUserId }: UserTableProps): ReactNode {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>用户管理</CardTitle>
            <CardDescription>管理系统用户账号</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              导出
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              添加用户
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* 搜索栏 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="搜索用户..." className="pl-10" />
          </div>
        </div>

        {/* 用户表格 */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const role = roleLabels[user.role]
                const status = statusLabels[user.status || 'active']
                const isCurrentUser = user.id === currentUserId

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.name}
                            {isCurrentUser && (
                              <Badge variant="outline" className="ml-2 text-xs">当前</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={role.color}>{role.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Ban className="w-4 h-4" />
                            禁用
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
