'use client'

import type { ReactNode } from 'react'
import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageWrapper } from '@/components/layout'
import { SliceViewer, ToolPanel, AnnotationLayer } from '@/components/features/slice'
import { getSliceById } from '@/lib/mock/slices'
import { useSliceStore } from '@/stores/sliceStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChevronRight,
  Tag,
  Calendar,
  User,
  Maximize2,
  Download,
  Share2,
  Star,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SlicePageProps {
  params: Promise<{ id: string }>
}

export default function SlicePage({ params }: SlicePageProps): ReactNode {
  const { id } = use(params)
  const slice = getSliceById(id)

  // 当前标注颜色
  const [currentColor, setCurrentColor] = useState('#E86A33')

  if (!slice) {
    notFound()
  }

  const {
    currentTool,
    annotations,
    zoom,
    position,
    selectedAnnotationId,
    setTool,
    setZoom,
    setPosition,
    addAnnotation,
    removeAnnotation,
    selectAnnotation,
    clearAnnotations,
    undoAnnotation,
    redoAnnotation,
    canUndo,
    canRedo,
  } = useSliceStore()

  const categoryLabels: Record<string, string> = {
    digestive: '消化系统',
    respiratory: '呼吸系统',
    breast: '乳腺',
    endocrine: '内分泌',
    urinary: '泌尿系统',
    nervous: '神经系统',
    cardiovascular: '心血管',
    reproductive: '生殖系统',
    other: '其他',
  }

  return (
    <PageWrapper className="space-y-4">
      {/* 面包屑导航 */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/slices" className="hover:text-foreground transition-colors">
          切片库
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{slice.title}</span>
      </nav>

      {/* 主内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧工具栏 */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <ToolPanel
            currentTool={currentTool}
            onToolChange={setTool}
            onUndo={undoAnnotation}
            onRedo={redoAnnotation}
            onClear={clearAnnotations}
            canUndo={canUndo()}
            canRedo={canRedo()}
            hasAnnotations={annotations.length > 0}
            currentColor={currentColor}
            onColorChange={setCurrentColor}
          />

          {/* 标注图层 */}
          <div className="mt-4">
            <AnnotationLayer
              annotations={annotations}
              selectedId={selectedAnnotationId}
              onSelect={selectAnnotation}
              onDelete={removeAnnotation}
            />
          </div>
        </div>

        {/* 中间切片视图 */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <SliceViewer
            slice={slice}
            currentTool={currentTool}
            annotations={annotations}
            zoom={zoom}
            position={position}
            onZoomChange={setZoom}
            onPositionChange={setPosition}
            onAddAnnotation={addAnnotation}
            currentColor={currentColor}
          />
        </div>

        {/* 右侧信息面板 */}
        <div className="lg:col-span-3 order-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{slice.title}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {categoryLabels[slice.category]}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {slice.description}
              </p>

              <Separator />

              {/* 基本信息 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">基本信息</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Maximize2 className="w-4 h-4" />
                    <span>放大倍数</span>
                  </div>
                  <span className="text-foreground">{slice.magnification}x</span>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>上传时间</span>
                  </div>
                  <span className="text-foreground">{formatDate(slice.uploadedAt)}</span>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>上传者</span>
                  </div>
                  <span className="text-foreground">{slice.uploadedBy}</span>
                </div>
              </div>

              <Separator />

              {/* 标签 */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  标签
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {slice.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="w-4 h-4" />
                  下载
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Share2 className="w-4 h-4" />
                  分享
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 相关课程 */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">相关课程</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href="/courses/1"
                  className="block p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium">消化病理学</p>
                  <p className="text-xs text-muted-foreground">第5章：肝脏疾病</p>
                </Link>
                <Link
                  href="/courses/1"
                  className="block p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium">消化病理学</p>
                  <p className="text-xs text-muted-foreground">第6章：肝肿瘤</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
