'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingSkeletonProps {
  className?: string
  type?: 'card' | 'list' | 'table' | 'detail' | 'chart'
  count?: number
}

export function LoadingSkeleton({ className, type = 'card', count = 3 }: LoadingSkeletonProps): ReactNode {
  switch (type) {
    case 'card':
      return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )

    case 'list':
      return (
        <div className={cn("space-y-3", className)}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      )

    case 'table':
      return (
        <div className={cn("border rounded-lg", className)}>
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/6 ml-auto" />
            </div>
          ))}
        </div>
      )

    case 'detail':
      return (
        <div className={cn("space-y-6", className)}>
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      )

    case 'chart':
      return (
        <div className={cn("rounded-lg border p-4", className)}>
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      )

    default:
      return <Skeleton className={className} />
  }
}
