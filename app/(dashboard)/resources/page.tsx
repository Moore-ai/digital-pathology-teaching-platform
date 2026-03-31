'use client'

import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout'
import { ResourceCard, FileTypeFilter } from '@/components/features/resource'
import { ResourceType } from '@/types/resource'
import { mockResources, searchResources } from '@/lib/mock/resources'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, SlidersHorizontal } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export default function ResourcesPage(): ReactNode {
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all')
  const [searchKeyword, setSearchKeyword] = useState('')
  const { user } = useAuthStore()

  // 筛选资料
  const filteredResources = useMemo(() => {
    let result = mockResources

    // 类型筛选
    if (selectedType !== 'all') {
      result = result.filter(r => r.type === selectedType)
    }

    // 关键词搜索
    if (searchKeyword.trim()) {
      result = searchResources(searchKeyword.trim())
    }

    return result
  }, [selectedType, searchKeyword])

  const canUpload = user?.role === 'teacher' || user?.role === 'admin'

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">病例资料</h1>
          <p className="text-muted-foreground mt-1">
            管理教学资料，包括PDF文档、PPT课件、视频和病理切片
          </p>
        </div>
        {canUpload && (
          <Link href="/resources/upload">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              上传资料
            </Button>
          </Link>
        )}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索资料名称、描述或标签..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span>共 {filteredResources.length} 份资料</span>
        </div>
      </div>

      {/* 类型筛选 */}
      <FileTypeFilter
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* 资料网格 */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              showActions={canUpload}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">未找到资料</h3>
          <p className="text-sm text-muted-foreground mt-1">
            尝试调整搜索条件或筛选类型
          </p>
        </div>
      )}
    </PageWrapper>
  )
}
