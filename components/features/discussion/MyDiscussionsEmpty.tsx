'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquarePlus } from 'lucide-react'

interface MyDiscussionsEmptyProps {
  onCreatePost?: () => void
}

export function MyDiscussionsEmpty({ onCreatePost }: MyDiscussionsEmptyProps): ReactNode {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 relative">
        <MessageSquarePlus className="w-10 h-10 text-muted-foreground" />
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-white text-sm font-bold">?</span>
        </div>
      </div>
      <h3 className="text-lg font-medium text-foreground">还没有发起过提问</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        有疑问？点击下方按钮开始提问
      </p>
      {onCreatePost && (
        <Button onClick={onCreatePost} className="gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          发起我的第一个提问
        </Button>
      )}
    </div>
  )
}
