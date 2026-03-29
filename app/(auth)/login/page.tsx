'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { Microscope } from 'lucide-react'

export default function LoginPage(): ReactNode {
  return (
    <div className="min-h-screen flex">
      {/* 左侧装饰区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full border border-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-white/20" />
        </div>

        {/* 内容 */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Microscope className="w-7 h-7" />
            </div>
            <span className="font-heading text-2xl font-semibold">数字病理教学平台</span>
          </div>

          <h1 className="text-4xl font-heading font-bold mb-4">
            临床视界 · 精准教学
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            专业的医学病理学数字化教学平台，提供切片浏览、课程学习、在线考试等功能
          </p>

          {/* 特性列表 */}
          <ul className="mt-8 space-y-3 text-white/90">
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-accent rounded-full" />
              高清 SVS 切片在线浏览
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-accent rounded-full" />
              MOOC 模式课程学习
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-accent rounded-full" />
              智能组卷与在线考试
            </li>
            <li className="flex items-center gap-3">
              <span className="w-2 h-2 bg-accent rounded-full" />
              学习进度可视化分析
            </li>
          </ul>
        </div>
      </div>

      {/* 右侧登录区域 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* 移动端 Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-xl font-semibold text-primary">
              数字病理教学平台
            </span>
          </div>

          {/* 登录卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 ring-1 ring-border">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground">
                欢迎回来
              </h2>
              <p className="text-muted-foreground mt-1">
                请登录您的账户
              </p>
            </div>

            <LoginForm />

            {/* 底部链接 */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              首次使用？{' '}
              <Link href="#" className="text-secondary hover:underline">
                联系管理员
              </Link>
            </div>
          </div>

          {/* 版权信息 */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            © 2026 数字病理教学平台 · 仅供教学使用
          </p>
        </div>
      </div>
    </div>
  )
}
