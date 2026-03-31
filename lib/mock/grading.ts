import { QuestionType } from '@/types/exam'

// 学生提交记录
export interface StudentSubmission {
  id: string
  studentId: string
  studentName: string
  studentNumber: string
  submittedAt: Date
  status: 'graded' | 'grading' | 'ungraded'
  totalScore?: number
  currentQuestionIndex?: number
  totalQuestions: number
}

// 题目批改状态
export interface QuestionGradingStatus {
  id: string
  index: number
  type: QuestionType | 'essay'
  isSubjective: boolean
  isGraded: boolean
  score: number
  maxScore: number
}

// 题目详情（用于批改）
export interface GradingQuestion {
  id: string
  index: number
  type: QuestionType | 'essay'
  content: string
  maxScore: number
  referenceAnswer: string
  relatedSlices?: string[]
  gradingRubric?: GradingRubricItem[]
}

// 评分细则项
export interface GradingRubricItem {
  criterion: string
  score: number
  description: string
}

// 学生答案
export interface StudentAnswer {
  questionId: string
  studentId: string
  answer: string | string[]
  submittedAt: Date
  attachments?: string[]
}

// 批改统计
export interface GradingStats {
  averageScore: number
  highestScore: number
  lowestScore: number
  passRate: number
  distribution: {
    excellent: number
    good: number
    pass: number
    fail: number
  }
  questionStats: QuestionStatItem[]
}

export interface QuestionStatItem {
  questionIndex: number
  avgScore: number
  maxScore: number
  accuracy: number
}

// 批改记录
export interface GradingRecord {
  id: string
  examId: string
  studentId: string
  gradedBy: string
  gradedAt: Date
  totalScore: number
  questionGrades: QuestionGradeItem[]
  overallComment?: string
  status: 'draft' | 'submitted' | 'reviewed'
}

export interface QuestionGradeItem {
  questionId: string
  studentAnswer: string | string[]
  score: number
  maxScore: number
  comment?: string
  gradedAt: Date
  gradedBy: string
}

// ============ Mock 数据 ============

// 学生提交记录 Mock
export const mockStudentSubmissions: StudentSubmission[] = [
  {
    id: 's1',
    studentId: 'u1',
    studentName: '张三',
    studentNumber: '2024001',
    submittedAt: new Date('2026-03-20T15:30:00'),
    status: 'graded',
    totalScore: 85,
    totalQuestions: 5,
  },
  {
    id: 's2',
    studentId: 'u2',
    studentName: '李四',
    studentNumber: '2024002',
    submittedAt: new Date('2026-03-20T16:45:00'),
    status: 'grading',
    currentQuestionIndex: 3,
    totalQuestions: 5,
  },
  {
    id: 's3',
    studentId: 'u3',
    studentName: '王五',
    studentNumber: '2024003',
    submittedAt: new Date('2026-03-20T17:00:00'),
    status: 'ungraded',
    totalQuestions: 5,
  },
  {
    id: 's4',
    studentId: 'u4',
    studentName: '赵六',
    studentNumber: '2024004',
    submittedAt: new Date('2026-03-20T17:15:00'),
    status: 'ungraded',
    totalQuestions: 5,
  },
  {
    id: 's5',
    studentId: 'u5',
    studentName: '钱七',
    studentNumber: '2024005',
    submittedAt: new Date('2026-03-20T17:30:00'),
    status: 'graded',
    totalScore: 92,
    totalQuestions: 5,
  },
  {
    id: 's6',
    studentId: 'u6',
    studentName: '孙八',
    studentNumber: '2024006',
    submittedAt: new Date('2026-03-20T17:45:00'),
    status: 'ungraded',
    totalQuestions: 5,
  },
  {
    id: 's7',
    studentId: 'u7',
    studentName: '周九',
    studentNumber: '2024007',
    submittedAt: new Date('2026-03-20T18:00:00'),
    status: 'graded',
    totalScore: 78,
    totalQuestions: 5,
  },
  {
    id: 's8',
    studentId: 'u8',
    studentName: '吴十',
    studentNumber: '2024008',
    submittedAt: new Date('2026-03-20T18:15:00'),
    status: 'ungraded',
    totalQuestions: 5,
  },
]

// 题目批改状态 Mock（李四的答题情况）
export const mockQuestionGradingStatus: QuestionGradingStatus[] = [
  { id: 'q1', index: 1, type: 'single', isSubjective: false, isGraded: true, score: 10, maxScore: 10 },
  { id: 'q2', index: 2, type: 'single', isSubjective: false, isGraded: true, score: 8, maxScore: 10 },
  { id: 'q3', index: 3, type: 'short_answer', isSubjective: true, isGraded: false, score: 0, maxScore: 15 },
  { id: 'q4', index: 4, type: 'essay', isSubjective: true, isGraded: false, score: 0, maxScore: 25 },
  { id: 'q5', index: 5, type: 'short_answer', isSubjective: true, isGraded: false, score: 0, maxScore: 15 },
]

// 题目详情 Mock
export const mockGradingQuestions: GradingQuestion[] = [
  {
    id: 'q1',
    index: 1,
    type: 'single',
    content: '下列哪项不是肝细胞癌的病理特征？',
    maxScore: 10,
    referenceAnswer: 'D. 肿瘤细胞呈巢状排列，细胞间桥明显',
    gradingRubric: [
      { criterion: '正确答案', score: 10, description: '选择D得满分' },
    ],
  },
  {
    id: 'q2',
    index: 2,
    type: 'single',
    content: '肝硬化的典型病理变化不包括？',
    maxScore: 10,
    referenceAnswer: 'C. 肝细胞再生结节',
    gradingRubric: [
      { criterion: '正确答案', score: 10, description: '选择C得满分' },
    ],
  },
  {
    id: 'q3',
    index: 3,
    type: 'short_answer',
    content: '请简述肝细胞癌的主要病理特征，并列举至少三个组织学类型。',
    maxScore: 15,
    referenceAnswer: `1. 主要病理特征：
   - 癌细胞呈梁状排列，之间为血窦
   - 可见胆汁分泌
   - 常伴有肝硬化背景

2. 组织学类型：
   - 梁状型（最常见）
   - 假腺管型
   - 实体型`,
    relatedSlices: ['slice_hcc_001'],
    gradingRubric: [
      { criterion: '病理特征', score: 8, description: '每正确描述一个特征得2-3分' },
      { criterion: '组织学类型', score: 6, description: '每正确列举一个类型得2分' },
      { criterion: '完整性', score: 1, description: '答案结构清晰、表述准确' },
    ],
  },
  {
    id: 'q4',
    index: 4,
    type: 'essay',
    content: '请论述肝硬化的病因、病理变化及临床病理联系。',
    maxScore: 25,
    referenceAnswer: `一、病因
1. 病毒性肝炎（乙型、丙型最常见）
2. 慢性酒精中毒
3. 胆汁淤积
4. 化学毒物或药物
5. 循环障碍

二、病理变化
1. 肉眼观：肝脏缩小、变硬，表面呈弥漫性结节状
2. 镜下观：
   - 正常肝小叶结构被破坏
   - 假小叶形成
   - 纤维组织增生
   - 肝细胞再生结节

三、临床病理联系
1. 门脉高压症：脾肿大、腹水、侧支循环形成
2. 肝功能不全：黄疸、凝血障碍、低蛋白血症`,
    gradingRubric: [
      { criterion: '病因', score: 5, description: '列举至少3个病因，每个1-2分' },
      { criterion: '病理变化', score: 10, description: '肉眼观和镜下观各5分' },
      { criterion: '临床病理联系', score: 8, description: '门脉高压和肝功能各4分' },
      { criterion: '论述完整性', score: 2, description: '逻辑清晰、结构完整' },
    ],
  },
  {
    id: 'q5',
    index: 5,
    type: 'short_answer',
    content: '简述门脉性肝硬化的主要病变特点。',
    maxScore: 15,
    referenceAnswer: `1. 大体改变：
   - 肝脏体积缩小、质地变硬
   - 表面呈弥漫性结节状，结节大小相近（直径多在0.1-0.5cm）
   - 切面见圆形或类圆形结节

2. 镜下改变：
   - 正常肝小叶结构被破坏
   - 假小叶形成（核心病变）
   - 广泛的纤维组织增生，分割肝实质
   - 肝细胞再生结节`,
    gradingRubric: [
      { criterion: '大体改变', score: 6, description: '描述体积、质地、表面、切面各1-2分' },
      { criterion: '镜下改变', score: 8, description: '假小叶4分，其他各1-2分' },
      { criterion: '表述准确', score: 1, description: '术语使用准确' },
    ],
  },
]

// 学生答案 Mock（李四的答案）
export const mockStudentAnswers: Record<string, StudentAnswer> = {
  q1: {
    questionId: 'q1',
    studentId: 'u2',
    answer: 'D',
    submittedAt: new Date('2026-03-20T15:10:00'),
  },
  q2: {
    questionId: 'q2',
    studentId: 'u2',
    answer: 'B',
    submittedAt: new Date('2026-03-20T15:15:00'),
  },
  q3: {
    questionId: 'q3',
    studentId: 'u2',
    answer: `肝细胞癌的主要病理特征包括癌细胞排列成梁状，细胞之间有血窦结构。可见胆汁分泌现象。组织学类型有梁状型、假腺管型和实体型。`,
    submittedAt: new Date('2026-03-20T15:23:45'),
  },
  q4: {
    questionId: 'q4',
    studentId: 'u2',
    answer: `一、病因
肝硬化的主要病因包括病毒性肝炎（乙型、丙型）、长期饮酒、胆汁淤积等。

二、病理变化
肉眼观肝脏缩小变硬，表面呈结节状。镜下可见假小叶形成，纤维组织增生。

三、临床病理联系
患者可出现门脉高压症状如脾肿大、腹水，以及肝功能不全的表现如黄疸、凝血障碍等。`,
    submittedAt: new Date('2026-03-20T15:35:00'),
  },
  q5: {
    questionId: 'q5',
    studentId: 'u2',
    answer: `门脉性肝硬化病变特点：
1. 肝脏缩小变硬，表面弥漫性结节
2. 镜下假小叶形成是核心病变
3. 纤维组织广泛增生`,
    submittedAt: new Date('2026-03-20T15:42:00'),
  },
}

// 批改统计 Mock
export const mockGradingStats: GradingStats = {
  averageScore: 78.5,
  highestScore: 95,
  lowestScore: 42,
  passRate: 87,
  distribution: {
    excellent: 8,
    good: 15,
    pass: 17,
    fail: 5,
  },
  questionStats: [
    { questionIndex: 1, avgScore: 8.5, maxScore: 10, accuracy: 85 },
    { questionIndex: 2, avgScore: 9.5, maxScore: 10, accuracy: 95 },
    { questionIndex: 3, avgScore: 9.3, maxScore: 15, accuracy: 62 },
    { questionIndex: 4, avgScore: 15.6, maxScore: 25, accuracy: 62 },
    { questionIndex: 5, avgScore: 12.3, maxScore: 15, accuracy: 82 },
  ],
}

// 快捷评语预设
export const quickComments = {
  positive: [
    '完全正确',
    '基本正确',
    '论述清晰',
    '要点完整',
    '逻辑清晰',
    '分析深入',
  ],
  neutral: [
    '部分正确',
    '需补充',
    '可进一步完善',
  ],
  negative: [
    '错误',
    '表述不清',
    '缺少要点',
    '论证不足',
    '格式问题',
  ],
}

// 获取学生提交列表
export function getStudentSubmissions(examId: string): StudentSubmission[] {
  // 实际项目中根据 examId 获取
  return mockStudentSubmissions
}

// 获取题目批改状态
export function getQuestionGradingStatus(studentId: string, examId: string): QuestionGradingStatus[] {
  // 实际项目中根据 studentId 和 examId 获取
  return mockQuestionGradingStatus
}

// 获取题目详情
export function getGradingQuestion(questionId: string): GradingQuestion | undefined {
  return mockGradingQuestions.find(q => q.id === questionId)
}

// 获取学生答案
export function getStudentAnswer(questionId: string, studentId: string): StudentAnswer | undefined {
  // 实际项目中根据 questionId 和 studentId 获取
  return mockStudentAnswers[questionId]
}

// 获取批改统计
export function getGradingStats(examId: string): GradingStats {
  return mockGradingStats
}
