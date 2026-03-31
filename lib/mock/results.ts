// 成绩相关类型定义
export type ScoreLevel = 'excellent' | 'good' | 'pass' | 'fail'

export interface ExamResult {
  id: string
  examId: string
  examTitle: string
  examDescription?: string
  category: string
  score: number
  totalScore: number
  rank: number
  totalStudents: number
  correctCount: number
  wrongCount: number
  timeSpent: number
  submittedAt: Date
  accuracy: number
  level: ScoreLevel
}

export interface ResultStats {
  averageScore: number
  highestScore: number
  lowestScore: number
  currentRank: number
  totalStudents: number
  totalExams: number
  passRate: number
}

export interface TrendDataPoint {
  examId: string
  examName: string
  fullExamName: string
  score: number
  avgScore: number
  date: Date
}

// 计算成绩等级
export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 60) return 'pass'
  return 'fail'
}

// 成绩等级配置
export const scoreLevelConfig: Record<ScoreLevel, { label: string; color: string; bgClass: string; textClass: string }> = {
  excellent: { label: '优秀', color: '#10B981', bgClass: 'bg-success', textClass: 'text-success' },
  good: { label: '良好', color: '#2D8B8B', bgClass: 'bg-secondary', textClass: 'text-secondary' },
  pass: { label: '及格', color: '#F59E0B', bgClass: 'bg-warning', textClass: 'text-warning' },
  fail: { label: '不及格', color: '#EF4444', bgClass: 'bg-error', textClass: 'text-error' },
}

// 成绩记录 Mock 数据
export const mockResults: ExamResult[] = [
  {
    id: 'r1',
    examId: '2',
    examTitle: '第三单元测试',
    examDescription: '肝脏疾病专题测试',
    category: '消化系统',
    score: 85,
    totalScore: 100,
    rank: 8,
    totalStudents: 45,
    correctCount: 25,
    wrongCount: 5,
    timeSpent: 78,
    submittedAt: new Date('2026-03-20T15:30:00'),
    accuracy: 83.3,
    level: 'good',
  },
  {
    id: 'r2',
    examId: '6',
    examTitle: '病理学随堂测验',
    examDescription: '消化系统病理测验',
    category: '消化系统',
    score: 92,
    totalScore: 100,
    rank: 5,
    totalStudents: 42,
    correctCount: 18,
    wrongCount: 2,
    timeSpent: 35,
    submittedAt: new Date('2026-03-15T11:00:00'),
    accuracy: 90,
    level: 'excellent',
  },
  {
    id: 'r3',
    examId: '7',
    examTitle: '第二单元测试',
    examDescription: '呼吸系统病理测试',
    category: '呼吸系统',
    score: 72,
    totalScore: 100,
    rank: 25,
    totalStudents: 45,
    correctCount: 18,
    wrongCount: 12,
    timeSpent: 55,
    submittedAt: new Date('2026-03-10T11:00:00'),
    accuracy: 60,
    level: 'pass',
  },
  {
    id: 'r4',
    examId: '8',
    examTitle: '第一单元测试',
    examDescription: '病理学基础概念测试',
    category: '基础',
    score: 88,
    totalScore: 100,
    rank: 10,
    totalStudents: 45,
    correctCount: 22,
    wrongCount: 8,
    timeSpent: 65,
    submittedAt: new Date('2026-03-01T11:00:00'),
    accuracy: 73.3,
    level: 'good',
  },
  {
    id: 'r5',
    examId: '9',
    examTitle: '心血管系统测验',
    examDescription: '心血管病理诊断测验',
    category: '心血管系统',
    score: 95,
    totalScore: 100,
    rank: 2,
    totalStudents: 43,
    correctCount: 19,
    wrongCount: 1,
    timeSpent: 42,
    submittedAt: new Date('2026-03-05T11:00:00'),
    accuracy: 95,
    level: 'excellent',
  },
]

// 统计数据 Mock
export const mockResultStats: ResultStats = {
  averageScore: 86.4,
  highestScore: 95,
  lowestScore: 72,
  currentRank: 12,
  totalStudents: 45,
  totalExams: 5,
  passRate: 100,
}

// 趋势数据 Mock
export const mockTrendData: TrendDataPoint[] = [
  { examId: '8', examName: '单元1', fullExamName: '第一单元测试', score: 88, avgScore: 76, date: new Date('2026-03-01') },
  { examId: '9', examName: '心血管', fullExamName: '心血管系统测验', score: 95, avgScore: 78, date: new Date('2026-03-05') },
  { examId: '7', examName: '单元2', fullExamName: '第二单元测试', score: 72, avgScore: 75, date: new Date('2026-03-10') },
  { examId: '6', examName: '随堂', fullExamName: '病理学随堂测验', score: 92, avgScore: 78, date: new Date('2026-03-15') },
  { examId: '2', examName: '单元3', fullExamName: '第三单元测试', score: 85, avgScore: 76, date: new Date('2026-03-20') },
]

// 科目分类列表
export const categoryOptions = [
  { value: 'all', label: '全部科目' },
  { value: '基础', label: '基础' },
  { value: '消化系统', label: '消化系统' },
  { value: '呼吸系统', label: '呼吸系统' },
  { value: '心血管系统', label: '心血管系统' },
  { value: '泌尿系统', label: '泌尿系统' },
  { value: '神经系统', label: '神经系统' },
]

// 成绩等级筛选选项
export const levelOptions = [
  { value: 'all', label: '全部等级' },
  { value: 'excellent', label: '优秀' },
  { value: 'good', label: '良好' },
  { value: 'pass', label: '及格' },
  { value: 'fail', label: '不及格' },
]

// ============ 管理员视角数据 ============

// 班级信息
export interface ClassInfo {
  id: string
  name: string
  studentCount: number
}

// 班级成绩分布
export interface ClassScoreDistribution {
  excellent: number  // 优秀人数
  good: number       // 良好人数
  pass: number       // 及格人数
  fail: number       // 不及格人数
}

// 班级成绩统计
export interface ClassResultStats {
  classId: string
  className: string
  examTitle: string
  examId: string
  averageScore: number
  highestScore: number
  lowestScore: number
  submissionCount: number
  totalStudents: number
  passRate: number
  distribution: ClassScoreDistribution
}

// 班级列表
export const mockClasses: ClassInfo[] = [
  { id: 'c1', name: '2024级病理学1班', studentCount: 45 },
  { id: 'c2', name: '2024级病理学2班', studentCount: 42 },
  { id: 'c3', name: '2024级病理学3班', studentCount: 48 },
]

// 班级筛选选项
export const classOptions = [
  { value: 'all', label: '全部班级' },
  ...mockClasses.map(c => ({ value: c.id, label: c.name })),
]

// 班级成绩统计 Mock 数据
export const mockClassResults: ClassResultStats[] = [
  {
    classId: 'c1',
    className: '2024级病理学1班',
    examTitle: '第三单元测试',
    examId: '2',
    averageScore: 78.5,
    highestScore: 98,
    lowestScore: 42,
    submissionCount: 45,
    totalStudents: 45,
    passRate: 93.3,
    distribution: { excellent: 8, good: 18, pass: 16, fail: 3 },
  },
  {
    classId: 'c1',
    className: '2024级病理学1班',
    examTitle: '第二单元测试',
    examId: '7',
    averageScore: 72.3,
    highestScore: 95,
    lowestScore: 38,
    submissionCount: 45,
    totalStudents: 45,
    passRate: 86.7,
    distribution: { excellent: 5, good: 15, pass: 19, fail: 6 },
  },
  {
    classId: 'c2',
    className: '2024级病理学2班',
    examTitle: '第三单元测试',
    examId: '2',
    averageScore: 81.2,
    highestScore: 100,
    lowestScore: 55,
    submissionCount: 42,
    totalStudents: 42,
    passRate: 97.6,
    distribution: { excellent: 12, good: 20, pass: 9, fail: 1 },
  },
  {
    classId: 'c2',
    className: '2024级病理学2班',
    examTitle: '第二单元测试',
    examId: '7',
    averageScore: 75.8,
    highestScore: 96,
    lowestScore: 48,
    submissionCount: 42,
    totalStudents: 42,
    passRate: 92.9,
    distribution: { excellent: 7, good: 18, pass: 14, fail: 3 },
  },
  {
    classId: 'c3',
    className: '2024级病理学3班',
    examTitle: '第三单元测试',
    examId: '2',
    averageScore: 76.4,
    highestScore: 92,
    lowestScore: 45,
    submissionCount: 48,
    totalStudents: 48,
    passRate: 91.7,
    distribution: { excellent: 6, good: 22, pass: 16, fail: 4 },
  },
]

// 全局成绩统计（管理员视角）
export const mockGlobalStats = {
  totalClasses: 3,
  totalStudents: 135,
  totalExams: 5,
  overallAverage: 76.8,
  overallPassRate: 92.6,
}

