// 应用常量配置

// 应用名称
export const APP_NAME = '数字病理教学平台'
export const APP_DESCRIPTION = '医学病理学数字化教学平台，提供切片浏览、课程学习、在线考试等功能'

// 角色配置
export const ROLES = {
  student: '学生',
  teacher: '教师',
  admin: '管理员',
} as const

// 角色权限映射
export const ROLE_PERMISSIONS = {
  student: [
    'course:view',
    'course:learn',
    'exam:view',
    'exam:take',
    'slice:view',
    'slice:annotate',
    'progress:view',
    'discussion:view',
    'discussion:create',
  ],
  teacher: [
    'course:view',
    'course:create',
    'course:edit',
    'course:delete',
    'exam:view',
    'exam:create',
    'exam:edit',
    'exam:grade',
    'slice:view',
    'slice:upload',
    'slice:delete',
    'progress:view',
    'discussion:view',
    'discussion:create',
  ],
  admin: [
    'course:*',
    'exam:*',
    'slice:*',
    'user:*',
    'settings:*',
    'logs:view',
    'discussion:*',
  ],
} as const

// 文件上传限制
export const UPLOAD_LIMITS = {
  slice: {
    maxSize: 500 * 1024 * 1024, // 500MB
    formats: ['.svs', '.tiff', '.ndpi', '.scn'],
  },
  video: {
    maxSize: 1024 * 1024 * 1024, // 1GB
    formats: ['.mp4', '.webm', '.mov'],
  },
  document: {
    maxSize: 50 * 1024 * 1024, // 50MB
    formats: ['.pdf', '.ppt', '.pptx', '.doc', '.docx'],
  },
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    formats: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
} as const

// 分页配置
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
} as const

// 切片浏览器配置
export const SLICE_VIEWER = {
  minZoom: 0.5,
  maxZoom: 100,
  defaultZoom: 1,
  magnifications: [1, 4, 10, 20, 40],
  annotationColors: [
    '#EF4444', // 红
    '#F59E0B', // 橙
    '#10B981', // 绿
    '#3B82F6', // 蓝
    '#8B5CF6', // 紫
    '#EC4899', // 粉
  ],
} as const

// 考试配置
export const EXAM = {
  minDuration: 10, // 最短考试时长(分钟)
  maxDuration: 240, // 最长考试时长(分钟)
  minQuestions: 5,
  maxQuestions: 200,
} as const

// 本地存储 Key
export const STORAGE_KEYS = {
  auth: 'auth-storage',
  theme: 'theme',
  recentCourses: 'recent-courses',
  examDraft: 'exam-draft',
} as const

// API 路径 (预留，原型阶段不使用)
export const API_PATHS = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  users: '/api/users',
  courses: '/api/courses',
  slices: '/api/slices',
  exams: '/api/exams',
  questions: '/api/questions',
  progress: '/api/progress',
  discussions: '/api/discussions',
  settings: '/api/settings',
} as const

// 正则表达式
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^1[3-9]\d{9}$/,
  studentId: /^\d{7,12}$/,
  teacherId: /^T\d{3,6}$/,
} as const
