// 知识点节点
export interface KnowledgeNode {
  id: string
  name: string
  category: string
  masteryLevel: number  // 0-100 掌握度
  status: 'mastered' | 'learning' | 'weak' | 'unlearned'
  relatedResources: {
    courses: string[]
    slices: string[]
    questions: string[]
  }
  x?: number
  y?: number
}

// 知识点边
export interface KnowledgeEdge {
  source: string
  target: string
  relationship: 'prerequisite' | 'related' | 'extension'
  weight: number
}

// 知识点详情
export interface KnowledgePoint {
  id: string
  name: string
  description: string
  category: string        // 所属章节/模块
  difficulty: number      // 难度等级 1-5

  // 关联信息
  prerequisites: string[] // 前置知识点
  extensions: string[]    // 扩展知识点
  relatedPoints: string[] // 相关知识点

  // 资源关联
  courses: string[]       // 关联课程
  slices: string[]        // 关联切片
  questions: string[]     // 关联题目

  // 标签
  tags: string[]
  keywords: string[]
}

// 知识图谱数据
export interface KnowledgeGraph {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}

// 错误诊断
export interface ErrorDiagnosis {
  id: string
  questionId: string
  questionContent: string
  questionType: 'single' | 'multiple' | 'judgment' | 'short_answer'
  userAnswer: string
  correctAnswer: string
  errorType: 'concept_confusion' | 'detail_omission' | 'reasoning_error'
  examId: string
  examName: string
  timestamp: Date

  // AI 分析结果
  analysis: {
    errorReason: string
    relatedKnowledge: {
      id: string
      name: string
      masteryLevel: number
    }[]
    suggestions: string[]
  }

  // 推荐资源
  recommendedResources: RecommendedResource[]
}

// 推荐资源
export interface RecommendedResource {
  type: 'course' | 'slice' | 'exercise'
  id: string
  title: string
  description: string
  estimatedTime?: number
}

// 试题度量
export interface QuestionMetrics {
  questionId: string
  questionNumber: number
  questionType: 'single' | 'multiple' | 'judgment' | 'short_answer'
  questionContent: string
  difficulty: number       // 0-1 难度系数
  discrimination: number   // 0-1 区分度
  correctRate: number      // 正确率

  // 知识点关联
  knowledgePoints: {
    id: string
    name: string
    isCore: boolean
  }[]

  // AI 评估
  aiAssessment: {
    quality: 'excellent' | 'good' | 'needs_improvement' | 'problematic'
    issues: string[]
    suggestions: string[]
  }

  // 答题分布
  answerDistribution: {
    option: string
    count: number
    percentage: number
  }[]

  // 是否需要关注
  needsAttention: boolean
}

// 试卷分析结果
export interface ExamAnalysisResult {
  examId: string
  examName: string

  // 试卷整体质量
  overallMetrics: {
    difficulty: number
    discrimination: number
    reliability: number
    knowledgeCoverage: number
  }

  // 各题目分析
  questions: QuestionMetrics[]

  // 知识点覆盖
  knowledgeCoverage: {
    covered: string[]
    uncovered: string[]
    weaklyCovered: string[]
  }

  // AI 建议
  aiSuggestions: string[]
}

// 聊天消息
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date

  // RAG 引用来源
  sources?: {
    type: 'textbook' | 'course' | 'slice' | 'question'
    id: string
    title: string
    page?: string
  }[]

  // 建议问题
  suggestedQuestions?: string[]

  // 关联操作
  actions?: {
    label: string
    action: 'view_slice' | 'watch_course' | 'practice'
    target: string
  }[]
}

// 错误类型统计
export interface ErrorTypeStats {
  type: 'concept_confusion' | 'detail_omission' | 'reasoning_error'
  label: string
  count: number
  percentage: number
}

// 掌握度摘要
export interface MasterySummary {
  total: number
  mastered: number
  learning: number
  weak: number
  unlearned: number
  averageMastery: number
}

// 学习建议
export interface StudyRecommendation {
  knowledgePoint: string
  knowledgePointId: string
  reason: string
  resources: RecommendedResource[]
  priority: number
}

// 分析概览
export interface AnalysisOverview {
  // 知识点概览
  knowledgeOverview: {
    totalPoints: number
    masteredCount: number
    weakPoints: string[]
    masteryLevel: number
  }

  // 错题概览
  errorOverview: {
    totalErrors: number
    pendingAnalysis: number
    errorTypeStats: ErrorTypeStats[]
  }

  // 学习趋势
  learningTrend: {
    date: string
    correctRate: number
    studyTime: number
  }[]

  // 最近的AI问答
  recentChats: ChatMessage[]
}
