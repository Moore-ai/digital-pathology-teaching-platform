import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Discussion, DiscussionCategory } from '@/types/discussion'
import { mockDiscussions } from '@/lib/mock/discussions'

interface DiscussionState {
  discussions: Discussion[]

  // Actions
  addDiscussion: (discussion: Omit<Discussion, 'id' | 'replies' | 'likes' | 'views' | 'createdAt' | 'updatedAt'>) => void
  removeDiscussion: (id: string) => void
  updateDiscussion: (id: string, updates: Partial<Discussion>) => void
  addReply: (discussionId: string, reply: Discussion['replies'][0]) => void
}

export const useDiscussionStore = create<DiscussionState>()(
  persist(
    (set) => ({
      discussions: mockDiscussions,

      addDiscussion: (discussion) => set((state) => ({
        discussions: [
          {
            ...discussion,
            id: `discussion-${Date.now()}`,
            replies: [],
            likes: 0,
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ...state.discussions,
        ],
      })),

      removeDiscussion: (id) => set((state) => ({
        discussions: state.discussions.filter(d => d.id !== id),
      })),

      updateDiscussion: (id, updates) => set((state) => ({
        discussions: state.discussions.map(d =>
          d.id === id ? { ...d, ...updates } : d
        ),
      })),

      addReply: (discussionId, reply) => set((state) => ({
        discussions: state.discussions.map(d =>
          d.id === discussionId
            ? { ...d, replies: [...d.replies, reply] }
            : d
        ),
      })),
    }),
    {
      name: 'discussion-storage',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: () => {
        // 版本升级时使用最新的 mock 数据
        return { discussions: mockDiscussions }
      },
    }
  )
)
