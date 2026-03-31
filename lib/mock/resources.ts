import {
  Resource,
  ResourceCategory,
  ResourceType,
  categoryLabels,
} from '@/types/resource'

// 资料列表 Mock
export const mockResources: Resource[] = [
  {
    id: 'r1',
    title: '肝细胞癌病理切片标本001',
    description: '这是一例典型的肝细胞癌病理切片，可见明显的梁状排列结构。',
    type: 'svs',
    category: 'digestive',
    tags: ['肝细胞癌', '肝癌', '消化系统'],
    fileName: '肝细胞癌_标本001.svs',
    filePath: '/uploads/slices/2026/03/肝细胞癌_标本001.svs',
    fileSize: 257698037, // 约 245.6 MB
    mimeType: 'image/tiff',
    thumbnailUrl: '/thumbnails/r1.jpg',
    width: 50000,
    height: 40000,
    relatedCourses: ['c1', 'c2'],
    isPublic: true,
    allowDownload: false,
    uploadedBy: 'T001',
    uploadedAt: new Date('2026-03-17'),
    updatedAt: new Date('2026-03-17'),
  },
  {
    id: 'r2',
    title: '消化系统病例分析',
    description: '消化系统常见疾病的病例分析文档，涵盖食管、胃、肠道等器官。',
    type: 'pdf',
    category: 'digestive',
    tags: ['消化系统', '病例分析'],
    fileName: '消化系统病例分析.pdf',
    filePath: '/uploads/documents/2026/03/消化系统病例分析.pdf',
    fileSize: 2411724, // 约 2.3 MB
    mimeType: 'application/pdf',
    thumbnailUrl: '/thumbnails/r2.jpg',
    pageCount: 45,
    relatedCourses: ['c1'],
    isPublic: true,
    allowDownload: true,
    uploadedBy: 'T001',
    uploadedAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-03-20'),
  },
  {
    id: 'r3',
    title: '病理切片浏览教程',
    description: '如何使用数字病理教学平台浏览和分析切片。',
    type: 'video',
    category: 'other',
    tags: ['教程', '切片浏览'],
    fileName: '病理切片浏览教程.mp4',
    filePath: '/uploads/videos/2026/03/病理切片浏览教程.mp4',
    fileSize: 163577856, // 约 156 MB
    mimeType: 'video/mp4',
    thumbnailUrl: '/thumbnails/r3.jpg',
    duration: 720, // 12分钟
    width: 1920,
    height: 1080,
    relatedCourses: [],
    isPublic: true,
    allowDownload: false,
    uploadedBy: 'T002',
    uploadedAt: new Date('2026-03-19'),
    updatedAt: new Date('2026-03-19'),
  },
  {
    id: 'r4',
    title: '消化系统教学课件',
    description: '消化系统病理学教学PPT课件，包含病理变化、临床表现等内容。',
    type: 'ppt',
    category: 'digestive',
    tags: ['消化系统', '教学课件'],
    fileName: '消化系统教学课件.pptx',
    filePath: '/uploads/slides/2026/03/消化系统教学课件.pptx',
    fileSize: 8912896, // 约 8.5 MB
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    thumbnailUrl: '/thumbnails/r4.jpg',
    pageCount: 32,
    relatedCourses: ['c1'],
    isPublic: true,
    allowDownload: true,
    uploadedBy: 'T001',
    uploadedAt: new Date('2026-03-18'),
    updatedAt: new Date('2026-03-18'),
  },
  {
    id: 'r5',
    title: '乳腺浸润性导管癌切片',
    description: '乳腺浸润性导管癌典型病例切片，可见明显的浸润性生长模式。',
    type: 'svs',
    category: 'breast',
    tags: ['乳腺癌', '乳腺', '浸润性导管癌'],
    fileName: '乳腺浸润性导管癌.svs',
    filePath: '/uploads/slices/2026/03/乳腺浸润性导管癌.svs',
    fileSize: 314572800, // 约 300 MB
    mimeType: 'image/tiff',
    thumbnailUrl: '/thumbnails/r5.jpg',
    width: 60000,
    height: 50000,
    relatedCourses: ['c3'],
    isPublic: true,
    allowDownload: false,
    uploadedBy: 'T001',
    uploadedAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-03-15'),
  },
  {
    id: 'r6',
    title: '呼吸系统病理学概论',
    description: '呼吸系统疾病的病理学概述，包括肺炎、肺癌等内容。',
    type: 'pdf',
    category: 'respiratory',
    tags: ['呼吸系统', '病理学'],
    fileName: '呼吸系统病理学概论.pdf',
    filePath: '/uploads/documents/2026/03/呼吸系统病理学概论.pdf',
    fileSize: 5242880, // 约 5 MB
    mimeType: 'application/pdf',
    thumbnailUrl: '/thumbnails/r6.jpg',
    pageCount: 68,
    relatedCourses: ['c2'],
    isPublic: true,
    allowDownload: true,
    uploadedBy: 'T002',
    uploadedAt: new Date('2026-03-14'),
    updatedAt: new Date('2026-03-14'),
  },
  {
    id: 'r7',
    title: '肺部腺癌教学视频',
    description: '肺部腺癌的病理特征及诊断要点讲解视频。',
    type: 'video',
    category: 'respiratory',
    tags: ['肺癌', '腺癌', '呼吸系统'],
    fileName: '肺部腺癌教学视频.mp4',
    filePath: '/uploads/videos/2026/03/肺部腺癌教学视频.mp4',
    fileSize: 209715200, // 约 200 MB
    mimeType: 'video/mp4',
    thumbnailUrl: '/thumbnails/r7.jpg',
    duration: 1200, // 20分钟
    width: 1920,
    height: 1080,
    relatedCourses: ['c2'],
    isPublic: true,
    allowDownload: false,
    uploadedBy: 'T001',
    uploadedAt: new Date('2026-03-12'),
    updatedAt: new Date('2026-03-12'),
  },
  {
    id: 'r8',
    title: '心血管疾病病例集',
    description: '心血管系统常见疾病的病例分析合集。',
    type: 'pdf',
    category: 'cardiovascular',
    tags: ['心血管', '病例分析'],
    fileName: '心血管疾病病例集.pdf',
    filePath: '/uploads/documents/2026/03/心血管疾病病例集.pdf',
    fileSize: 8388608, // 约 8 MB
    mimeType: 'application/pdf',
    thumbnailUrl: '/thumbnails/r8.jpg',
    pageCount: 92,
    relatedCourses: ['c4'],
    isPublic: true,
    allowDownload: true,
    uploadedBy: 'T001',
    uploadedAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-10'),
  },
]

// 获取资料列表
export function getResources(): Resource[] {
  return mockResources
}

// 根据ID获取资料
export function getResourceById(id: string): Resource | undefined {
  return mockResources.find(r => r.id === id)
}

// 根据类型筛选资料
export function getResourcesByType(type: ResourceType): Resource[] {
  return mockResources.filter(r => r.type === type)
}

// 根据分类筛选资料
export function getResourcesByCategory(category: ResourceCategory): Resource[] {
  return mockResources.filter(r => r.category === category)
}

// 搜索资料
export function searchResources(keyword: string): Resource[] {
  const lowerKeyword = keyword.toLowerCase()
  return mockResources.filter(r =>
    r.title.toLowerCase().includes(lowerKeyword) ||
    r.description?.toLowerCase().includes(lowerKeyword) ||
    r.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  )
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + units[i]
}

// 格式化时长（秒转为 mm:ss）
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 获取文件类型统计
export function getFileTypeStats(): Record<ResourceType, number> {
  const stats: Record<ResourceType, number> = {
    pdf: 0,
    ppt: 0,
    video: 0,
    svs: 0,
  }

  mockResources.forEach(r => {
    stats[r.type]++
  })

  return stats
}

// 获取支持的文件类型
export const acceptedFileTypes: Record<ResourceType, string[]> = {
  pdf: ['.pdf'],
  ppt: ['.ppt', '.pptx'],
  video: ['.mp4', '.avi', '.mov', '.mkv'],
  svs: ['.svs', '.ndpi', '.tiff', '.tif'],
}

// 获取所有接受的文件扩展名
export function getAllAcceptedExtensions(): string[] {
  return Object.values(acceptedFileTypes).flat()
}

// 根据文件名判断文件类型
export function detectFileType(fileName: string): ResourceType | null {
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'))

  for (const [type, extensions] of Object.entries(acceptedFileTypes)) {
    if (extensions.includes(ext)) {
      return type as ResourceType
    }
  }

  return null
}

// 最大文件大小限制（字节）
export const maxFileSizes: Record<ResourceType, number> = {
  pdf: 100 * 1024 * 1024,     // 100 MB
  ppt: 100 * 1024 * 1024,     // 100 MB
  video: 500 * 1024 * 1024,   // 500 MB
  svs: 2 * 1024 * 1024 * 1024, // 2 GB
}
