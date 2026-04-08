'use client'

import type { ReactNode } from 'react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'

// MUI Next.js 16 App Router 缓存提供者
export function MuiProvider({ children }: { children: ReactNode }): ReactNode {
  return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
}
