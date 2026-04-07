'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Box, Typography, Stack, List, ListItem, Paper } from '@mui/material'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { Microscope } from 'lucide-react'

export default function LoginPage(): ReactNode {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* 左侧装饰区域 */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '50%',
          bgcolor: 'var(--primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景装饰 */}
        <Box sx={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <Box sx={{ position: 'absolute', top: 80, left: 80, width: 256, height: 256, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Box sx={{ position: 'absolute', bottom: 80, right: 80, width: 384, height: 384, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
        </Box>

        {/* 内容 */}
        <Box sx={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', px: 6, color: 'white' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
            <Box sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Microscope className="w-7 h-7" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              数字病理教学平台
            </Typography>
          </Stack>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            临床视界 · 精准教学
          </Typography>
          <Typography sx={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.8)', maxWidth: 400 }}>
            专业的医学病理学数字化教学平台，提供切片浏览、课程学习、在线考试等功能
          </Typography>

          {/* 特性列表 */}
          <List sx={{ mt: 4 }}>
            {[
              '高清 SVS 切片在线浏览',
              'MOOC 模式课程学习',
              '智能组卷与在线考试',
              '学习进度可视化分析',
            ].map((item, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5, color: 'rgba(255,255,255,0.9)' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--accent)', mr: 1.5 }} />
                {item}
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* 右侧登录区域 */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: 'var(--background)' }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* 移动端 Logo */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ display: { xs: 'flex', lg: 'none' }, mb: 4 }}
          >
            <Box sx={{ width: 40, height: 40, bgcolor: 'var(--primary)', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Microscope className="w-6 h-6" style={{ color: 'white' }} />
            </Box>
            <Typography sx={{ fontWeight: 600, color: 'var(--primary)' }}>
              数字病理教学平台
            </Typography>
          </Stack>

          {/* 登录卡片 */}
          <Paper
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              p: 4,
              border: '1px solid var(--border)',
              bgcolor: 'var(--card)',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
                欢迎回来
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', mt: 0.5 }}>
                请登录您的账户
              </Typography>
            </Box>

            <LoginForm />

            {/* 底部链接 */}
            <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: 'var(--muted-foreground)' }}>
              首次使用？{' '}
              <Link href="#" style={{ color: 'var(--secondary)', textDecoration: 'none' }}>
                <Box component="span" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  联系管理员
                </Box>
              </Link>
            </Typography>
          </Paper>

          {/* 版权信息 */}
          <Typography variant="caption" sx={{ display: 'block', mt: 4, textAlign: 'center', color: 'var(--muted-foreground)' }}>
            © 2026 数字病理教学平台 · 仅供教学使用
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
