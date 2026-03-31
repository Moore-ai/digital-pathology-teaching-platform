// 资源类型
export type ResourceType = 'pdf' | 'ppt' | 'video' | 'svs'

// 资源分类
export type ResourceCategory =
  | 'digestive'      // 消化系统
  | 'respiratory'    // 呼吸系统
  | 'breast'         // 乳腺
  | 'endocrine'      // 内分泌
  | 'urinary'        // 泌尿系统
  | 'nervous'        // 神经系统
  | 'cardiovascular' // 心血管
  | 'reproductive'   // 生殖系统
  | 'other'          // 其他

// 上传状态
export type UploadStatus =
  | 'pending'     // 等待中
  | 'uploading'   // 上传中
  | 'processing'  // 处理中
  | 'success'     // 成功
  | 'error'       // 失败

// 资源记录
export interface Resource {
  id: string
  title: string
  description?: string
  type: ResourceType
  category: ResourceCategory
  tags: string[]

  // 文件信息
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string

  // 元数据
  thumbnailUrl?: string
  previewUrl?: string
  duration?: number       // 视频时长（秒）
  width?: number          // 图片/视频宽度
  height?: number         // 图片/视频高度
  pageCount?: number      // PDF/PPT页数

  // 关联
  relatedCourses: string[]

  // 权限
  isPublic: boolean
  allowDownload: boolean

  // 审计
  uploadedBy: string
  uploadedAt: Date
  updatedAt: Date
}

// 上传任务
export interface UploadTask {
  id: string
  file: File
  status: UploadStatus
  progress: number
  speed?: number
  remainingTime?: number
  error?: string
  result?: Resource
}

// 上传文件（用于队列显示）
export interface UploadFile {
  id: string
  file: File
  status: UploadStatus
  progress: number        // 0-100
  speed?: string          // 上传速度，如 "2.5 MB/s"
  remainingTime?: string  // 剩余时间，如 "约 2 分钟"
  errorMessage?: string
  resourceId?: string     // 上传成功后的资源ID
}

// 分类标签映射
export const categoryLabels: Record<ResourceCategory, string> = {
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

// 文件类型标签映射
export const fileTypeLabels: Record<ResourceType, string> = {
  pdf: 'PDF文档',
  ppt: 'PPT课件',
  video: '视频',
  svs: 'SVS切片',
}

// 文件类型图标颜色
export const fileTypeColors: Record<ResourceType, string> = {
  pdf: 'text-error',
  ppt: 'text-warning',
  video: 'text-purple-500',
  svs: 'text-secondary',
}

// 文件类型背景色
export const fileTypeBgColors: Record<ResourceType, string> = {
  pdf: 'bg-error/10',
  ppt: 'bg-warning/10',
  video: 'bg-purple-500/10',
  svs: 'bg-secondary/10',
}
