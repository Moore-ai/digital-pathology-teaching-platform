import { create } from 'zustand'
import { Resource, ResourceCategory, ResourceType } from '@/types/resource'
import { mockResources } from '@/lib/mock/resources'

// 生成唯一ID
function generateId(): string {
  return `r${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`
}

// 资源编辑表单数据
export interface ResourceInput {
  title: string
  description: string
  category: ResourceCategory
  tags: string[]
  isPublic: boolean
  allowDownload: boolean
}

interface ResourceState {
  // 状态
  resources: Resource[]

  // 操作
  addResource: (input: Omit<Resource, 'id' | 'uploadedAt' | 'updatedAt'>) => Resource
  updateResource: (id: string, input: Partial<ResourceInput>) => Resource | null
  deleteResource: (id: string) => boolean
  getResourceById: (id: string) => Resource | undefined
  getResourcesByType: (type: ResourceType) => Resource[]
  getResourcesByCategory: (category: ResourceCategory) => Resource[]
  searchResources: (keyword: string) => Resource[]
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  // 初始化为 mock 数据
  resources: [...mockResources],

  // 添加资源
  addResource: (input) => {
    const now = new Date()
    const newResource: Resource = {
      ...input,
      id: generateId(),
      uploadedAt: now,
      updatedAt: now,
    }

    set((state) => ({
      resources: [newResource, ...state.resources],
    }))

    return newResource
  },

  // 更新资源
  updateResource: (id, input) => {
    let updatedResource: Resource | null = null

    set((state) => ({
      resources: state.resources.map((resource) => {
        if (resource.id === id) {
          updatedResource = {
            ...resource,
            ...input,
            updatedAt: new Date(),
          }
          return updatedResource
        }
        return resource
      }),
    }))

    return updatedResource
  },

  // 删除资源
  deleteResource: (id) => {
    const prevLength = get().resources.length
    set((state) => ({
      resources: state.resources.filter((r) => r.id !== id),
    }))
    return get().resources.length < prevLength
  },

  // 获取单个资源
  getResourceById: (id) => {
    return get().resources.find((r) => r.id === id)
  },

  // 按类型筛选
  getResourcesByType: (type) => {
    return get().resources.filter((r) => r.type === type)
  },

  // 按分类筛选
  getResourcesByCategory: (category) => {
    return get().resources.filter((r) => r.category === category)
  },

  // 搜索资源
  searchResources: (keyword) => {
    const lowerKeyword = keyword.toLowerCase()
    return get().resources.filter((r) =>
      r.title.toLowerCase().includes(lowerKeyword) ||
      r.description?.toLowerCase().includes(lowerKeyword) ||
      r.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
    )
  },
}))
