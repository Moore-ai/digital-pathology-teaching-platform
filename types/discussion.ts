// 讨论相关类型定义

export interface Discussion {
  id: string
  title: string
  content: string
  author: DiscussionAuthor
  category: DiscussionCategory
  tags: string[]
  replies: Reply[]
  likes: number
  views: number
  isPinned: boolean
  isSolved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Reply {
  id: string
  content: string
  author: DiscussionAuthor
  likes: number
  isAccepted: boolean  // 是否被采纳为最佳答案
  createdAt: Date
}

export interface DiscussionAuthor {
  id: string
  name: string
  avatar?: string
  role: 'student' | 'teacher' | 'admin'
}

export type DiscussionCategory =
  | 'course'      // 课程讨论
  | 'slice'       // 切片讨论
  | 'exam'        // 考试讨论
  | 'general'     // 综合讨论
  | 'help'        // 求助问答

export interface DiscussionStats {
  totalDiscussions: number
  totalReplies: number
  activeUsers: number
  todayPosts: number
}
