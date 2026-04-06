'use client'

import type { ReactNode } from 'react'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PageWrapper } from '@/components/layout'
import { SliceCard, SliceCategoryFilter } from '@/components/features/slice'
import { mockSlices, searchSlices } from '@/lib/mock/slices'
import { useAuthStore } from '@/stores/authStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal, Upload } from 'lucide-react'

export default function SlicesPage(): ReactNode {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const { user } = useAuthStore()

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin'

  // 筛选切片
  const filteredSlices = useMemo(() => {
    let result = mockSlices

    // 分类筛选
    if (selectedCategory) {
      result = result.filter(slice => slice.category === selectedCategory)
    }

    // 关键词搜索
    if (searchKeyword.trim()) {
      result = searchSlices(searchKeyword.trim())
    }

    return result
  }, [selectedCategory, searchKeyword])

  return (
    <PageWrapper className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">切片库</h1>
          <p className="text-muted-foreground mt-1">
            浏览和管理数字病理切片，支持标注、测量和讨论
          </p>
        </div>
        {isTeacher && (
          <Link href="/slices/upload">
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              上传切片
            </Button>
          </Link>
        )}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索切片名称、描述或标签..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span>共 {filteredSlices.length} 个切片</span>
        </div>
      </div>

      {/* 分类筛选 */}
      <SliceCategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 切片网格 */}
      {filteredSlices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filteredSlices.map((slice) => (
            <SliceCard key={slice.id} slice={slice} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">未找到切片</h3>
          <p className="text-sm text-muted-foreground mt-1">
            尝试调整搜索条件或筛选分类
          </p>
        </div>
      )}
    </PageWrapper>
  )
}
