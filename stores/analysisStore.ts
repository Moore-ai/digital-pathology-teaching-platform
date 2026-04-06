import { create } from 'zustand'
import {
  KnowledgeNode,
  KnowledgeEdge,
  KnowledgeGraph,
  KnowledgePoint,
  ErrorDiagnosis,
  ErrorTypeStats,
  ChatMessage,
  QuestionMetrics,
  ExamAnalysisResult,
  MasterySummary,
  StudyRecommendation,
  AnalysisOverview,
} from '@/types/analysis'

// 模拟知识点数据
const mockKnowledgePoints: KnowledgePoint[] = [
  {
    id: 'kp-1',
    name: '肝细胞癌的病理特征',
    description: '肝细胞癌的组织学特征、细胞形态及特殊表现',
    category: '消化系统病理',
    difficulty: 4,
    prerequisites: ['kp-3'],
    extensions: ['kp-2'],
    relatedPoints: ['kp-4', 'kp-5'],
    courses: ['course-1'],
    slices: ['slice-1', 'slice-2'],
    questions: ['q-1', 'q-2', 'q-3'],
    tags: ['肝脏肿瘤', '恶性肿瘤'],
    keywords: ['肝细胞癌', 'HCC', '梁状型'],
  },
  {
    id: 'kp-2',
    name: '胆管癌的分类与诊断',
    description: '胆管癌的分型、病理特征及诊断要点',
    category: '消化系统病理',
    difficulty: 4,
    prerequisites: ['kp-3'],
    extensions: [],
    relatedPoints: ['kp-1', 'kp-5'],
    courses: ['course-1'],
    slices: ['slice-3'],
    questions: ['q-4', 'q-5'],
    tags: ['胆管肿瘤', '恶性肿瘤'],
    keywords: ['胆管癌', '腺癌'],
  },
  {
    id: 'kp-3',
    name: '肝硬化的病理变化',
    description: '肝硬化的病因、病理变化及临床联系',
    category: '消化系统病理',
    difficulty: 3,
    prerequisites: [],
    extensions: ['kp-1', 'kp-2'],
    relatedPoints: ['kp-4'],
    courses: ['course-1'],
    slices: ['slice-4'],
    questions: ['q-6', 'q-7'],
    tags: ['肝硬化', '肝脏疾病'],
    keywords: ['肝硬化', '假小叶'],
  },
  {
    id: 'kp-4',
    name: '病毒性肝炎的基本病变',
    description: '各型病毒性肝炎的病理变化及鉴别',
    category: '消化系统病理',
    difficulty: 3,
    prerequisites: [],
    extensions: ['kp-3'],
    relatedPoints: ['kp-1'],
    courses: ['course-1'],
    slices: ['slice-5'],
    questions: ['q-8', 'q-9', 'q-10'],
    tags: ['病毒性肝炎', '肝脏疾病'],
    keywords: ['肝炎', '肝细胞坏死'],
  },
  {
    id: 'kp-5',
    name: '肝脏肿瘤的鉴别诊断',
    description: '肝脏良恶性肿瘤的鉴别要点',
    category: '消化系统病理',
    difficulty: 5,
    prerequisites: ['kp-1', 'kp-2'],
    extensions: [],
    relatedPoints: ['kp-3', 'kp-4'],
    courses: ['course-1'],
    slices: ['slice-6'],
    questions: ['q-11', 'q-12'],
    tags: ['肝脏肿瘤', '鉴别诊断'],
    keywords: ['肝脏肿瘤', '鉴别诊断', 'AFP'],
  },
  {
    id: 'kp-6',
    name: '胃溃疡的病理特征',
    description: '胃溃疡的病因、病理变化及并发症',
    category: '消化系统病理',
    difficulty: 3,
    prerequisites: [],
    extensions: [],
    relatedPoints: ['kp-7'],
    courses: ['course-2'],
    slices: ['slice-7'],
    questions: ['q-13', 'q-14'],
    tags: ['胃溃疡', '消化性溃疡'],
    keywords: ['胃溃疡', '消化性溃疡'],
  },
  {
    id: 'kp-7',
    name: '胃癌的分型与分期',
    description: '胃癌的组织学分型、TNM分期及预后',
    category: '消化系统病理',
    difficulty: 4,
    prerequisites: ['kp-6'],
    extensions: [],
    relatedPoints: ['kp-8'],
    courses: ['course-2'],
    slices: ['slice-8', 'slice-9'],
    questions: ['q-15', 'q-16', 'q-17'],
    tags: ['胃癌', '恶性肿瘤'],
    keywords: ['胃癌', '腺癌', '印戒细胞癌'],
  },
  {
    id: 'kp-8',
    name: '结直肠癌的病理特征',
    description: '结直肠癌的组织学类型及分期',
    category: '消化系统病理',
    difficulty: 4,
    prerequisites: [],
    extensions: [],
    relatedPoints: ['kp-7'],
    courses: ['course-2'],
    slices: ['slice-10'],
    questions: ['q-18', 'q-19'],
    tags: ['结直肠癌', '恶性肿瘤'],
    keywords: ['结直肠癌', '腺癌'],
  },
  {
    id: 'kp-9',
    name: '肺鳞状细胞癌',
    description: '肺鳞癌的组织学特征及免疫组化',
    category: '呼吸系统病理',
    difficulty: 4,
    prerequisites: ['kp-10'],
    extensions: [],
    relatedPoints: ['kp-11'],
    courses: ['course-3'],
    slices: ['slice-11'],
    questions: ['q-20', 'q-21'],
    tags: ['肺癌', '鳞癌'],
    keywords: ['肺鳞癌', '角化'],
  },
  {
    id: 'kp-10',
    name: '肺腺癌的病理特征',
    description: '肺腺癌的组织学类型及分子遗传学',
    category: '呼吸系统病理',
    difficulty: 4,
    prerequisites: [],
    extensions: ['kp-9'],
    relatedPoints: ['kp-11'],
    courses: ['course-3'],
    slices: ['slice-12'],
    questions: ['q-22', 'q-23', 'q-24'],
    tags: ['肺癌', '腺癌'],
    keywords: ['肺腺癌', 'EGFR'],
  },
]

// 模拟知识图谱节点
const generateKnowledgeNodes = (): KnowledgeNode[] => {
  const masteryLevels: Record<string, number> = {
    'kp-1': 38,
    'kp-2': 45,
    'kp-3': 72,
    'kp-4': 95,
    'kp-5': 52,
    'kp-6': 88,
    'kp-7': 65,
    'kp-8': 78,
    'kp-9': 55,
    'kp-10': 82,
  }

  return mockKnowledgePoints.map((kp, index) => {
    const mastery = masteryLevels[kp.id] || Math.floor(Math.random() * 100)
    let status: KnowledgeNode['status'] = 'unlearned'
    if (mastery >= 80) status = 'mastered'
    else if (mastery >= 50) status = 'learning'
    else if (mastery > 0) status = 'weak'

    // 简单的圆形布局
    const angle = (index / mockKnowledgePoints.length) * 2 * Math.PI
    const radius = 200

    return {
      id: kp.id,
      name: kp.name,
      category: kp.category,
      masteryLevel: mastery,
      status,
      relatedResources: {
        courses: kp.courses,
        slices: kp.slices,
        questions: kp.questions,
      },
      x: 300 + radius * Math.cos(angle),
      y: 250 + radius * Math.sin(angle),
    }
  })
}

// 模拟知识图谱边
const generateKnowledgeEdges = (): KnowledgeEdge[] => {
  const edges: KnowledgeEdge[] = []

  mockKnowledgePoints.forEach(kp => {
    // 前置关系
    kp.prerequisites.forEach(preId => {
      edges.push({
        source: preId,
        target: kp.id,
        relationship: 'prerequisite',
        weight: 1,
      })
    })

    // 扩展关系
    kp.extensions.forEach(extId => {
      edges.push({
        source: kp.id,
        target: extId,
        relationship: 'extension',
        weight: 0.8,
      })
    })

    // 相关关系
    kp.relatedPoints.forEach(relId => {
      // 避免重复边
      const exists = edges.some(e =>
        (e.source === kp.id && e.target === relId) ||
        (e.source === relId && e.target === kp.id)
      )
      if (!exists) {
        edges.push({
          source: kp.id,
          target: relId,
          relationship: 'related',
          weight: 0.5,
        })
      }
    })
  })

  return edges
}

// 模拟错题数据
const mockErrorDiagnoses: ErrorDiagnosis[] = [
  {
    id: 'error-1',
    questionId: 'q-1',
    questionContent: '肝细胞癌最常见的组织学类型是？\nA. 梁状型\nB. 假腺管型\nC. 实体型\nD. 硬化型',
    questionType: 'single',
    userAnswer: 'B',
    correctAnswer: 'A',
    errorType: 'concept_confusion',
    examId: 'exam-1',
    examName: '期中病理学考试',
    timestamp: new Date('2026-03-15'),
    analysis: {
      errorReason: '您混淆了肝细胞癌的组织学类型分类。梁状型是肝细胞癌最常见的组织学类型，约占70%以上。假腺管型虽然也可见，但不是最常见类型。',
      relatedKnowledge: [
        { id: 'kp-1', name: '肝细胞癌的病理特征', masteryLevel: 38 },
        { id: 'kp-5', name: '肝脏肿瘤的鉴别诊断', masteryLevel: 52 },
      ],
      suggestions: [
        '复习课程第5章"肝脏肿瘤"第2节',
        '观看切片"肝细胞癌-梁状型"典型病例',
        '完成"肝脏肿瘤"专项练习',
      ],
    },
    recommendedResources: [
      { type: 'course', id: 'course-1', title: '肝脏肿瘤病理学', description: '讲解肝细胞癌组织学类型', estimatedTime: 45 },
      { type: 'slice', id: 'slice-1', title: '肝细胞癌-梁状型', description: '典型梁状型肝细胞癌切片' },
      { type: 'exercise', id: 'exercise-1', title: '肝脏肿瘤鉴别诊断', description: '针对性强化训练', estimatedTime: 30 },
    ],
  },
  {
    id: 'error-2',
    questionId: 'q-5',
    questionContent: '肝细胞癌与胆管癌的主要区别是？\nA. 肿瘤大小\nB. 发病部位\nC. 细胞形态和胆管结构\nD. 临床症状',
    questionType: 'single',
    userAnswer: 'A',
    correctAnswer: 'C',
    errorType: 'concept_confusion',
    examId: 'exam-1',
    examName: '期中病理学考试',
    timestamp: new Date('2026-03-15'),
    analysis: {
      errorReason: '您混淆了肝细胞癌与胆管癌的鉴别要点。两者在肿瘤大小上无特异性差异，主要区别在于细胞形态学特征和胆管结构的保留情况。',
      relatedKnowledge: [
        { id: 'kp-1', name: '肝细胞癌的病理特征', masteryLevel: 38 },
        { id: 'kp-2', name: '胆管癌的分类与诊断', masteryLevel: 45 },
        { id: 'kp-5', name: '肝脏肿瘤的鉴别诊断', masteryLevel: 52 },
      ],
      suggestions: [
        '复习课程第5章"肝脏肿瘤"第3节',
        '观看切片"肝细胞癌vs胆管癌对比"',
        '完成"肝脏肿瘤鉴别"专项练习',
      ],
    },
    recommendedResources: [
      { type: 'course', id: 'course-1', title: '肝脏肿瘤病理学', description: '讲解肝细胞癌与胆管癌鉴别', estimatedTime: 45 },
      { type: 'slice', id: 'slice-6', title: '肝细胞癌vs胆管癌对比', description: '直观对比两种肿瘤的病理特征' },
    ],
  },
  {
    id: 'error-3',
    questionId: 'q-8',
    questionContent: '病毒性肝炎最常见的坏死类型是？\nA. 凝固性坏死\nB. 液化性坏死\nC. 点状坏死\nD. 桥接坏死',
    questionType: 'single',
    userAnswer: 'A',
    correctAnswer: 'C',
    errorType: 'detail_omission',
    examId: 'exam-2',
    examName: '单元测试',
    timestamp: new Date('2026-03-20'),
    analysis: {
      errorReason: '您遗漏了病毒性肝炎的特征性病变。急性病毒性肝炎最常见的肝细胞坏死类型是点状坏死，而非凝固性坏死。',
      relatedKnowledge: [
        { id: 'kp-4', name: '病毒性肝炎的基本病变', masteryLevel: 95 },
      ],
      suggestions: [
        '注意区分不同器官的坏死类型',
        '记住肝脏作为实质器官的特点',
        '复习病毒性肝炎的病理变化章节',
      ],
    },
    recommendedResources: [
      { type: 'course', id: 'course-1', title: '病毒性肝炎', description: '详细讲解各型肝炎病理变化', estimatedTime: 30 },
    ],
  },
  {
    id: 'error-4',
    questionId: 'q-11',
    questionContent: '患者男性，58岁，右上腹隐痛3个月，CT显示肝右叶占位。AFP 800ng/ml。最可能的诊断是？',
    questionType: 'single',
    userAnswer: 'B. 肝血管瘤',
    correctAnswer: 'A. 肝细胞癌',
    errorType: 'reasoning_error',
    examId: 'exam-1',
    examName: '期中病理学考试',
    timestamp: new Date('2026-03-15'),
    analysis: {
      errorReason: '您的临床推理存在问题。AFP显著升高（>400ng/ml）是肝细胞癌的重要诊断依据，肝血管瘤一般不会导致AFP升高。',
      relatedKnowledge: [
        { id: 'kp-1', name: '肝细胞癌的病理特征', masteryLevel: 38 },
        { id: 'kp-5', name: '肝脏肿瘤的鉴别诊断', masteryLevel: 52 },
      ],
      suggestions: [
        '理解AFP在肝癌诊断中的意义',
        '掌握肝脏肿瘤的临床病理联系',
        '多做病例分析题提高推理能力',
      ],
    },
    recommendedResources: [
      { type: 'course', id: 'course-1', title: '肝脏肿瘤病理学', description: '包含临床病理联系内容', estimatedTime: 45 },
      { type: 'exercise', id: 'exercise-2', title: '病例分析练习', description: '肝脏肿瘤病例分析', estimatedTime: 20 },
    ],
  },
]

// 模拟试题分析数据
const mockQuestionMetrics: QuestionMetrics[] = [
  {
    questionId: 'q-1',
    questionNumber: 1,
    questionType: 'single',
    questionContent: '肝细胞癌最常见的组织学类型是？',
    difficulty: 0.35,
    discrimination: 0.42,
    correctRate: 85,
    knowledgePoints: [
      { id: 'kp-1', name: '肝细胞癌的病理特征', isCore: true },
      { id: 'kp-5', name: '肝脏肿瘤的鉴别诊断', isCore: false },
    ],
    aiAssessment: {
      quality: 'good',
      issues: [],
      suggestions: ['题目设计合理，考查核心知识点。建议增加临床案例分析题以提高应用层面考核。'],
    },
    answerDistribution: [
      { option: 'A', count: 38, percentage: 85 },
      { option: 'B', count: 4, percentage: 9 },
      { option: 'C', count: 2, percentage: 4 },
      { option: 'D', count: 1, percentage: 2 },
    ],
    needsAttention: false,
  },
  {
    questionId: 'q-5',
    questionNumber: 5,
    questionType: 'single',
    questionContent: '患者男性，58岁，右上腹隐痛3个月...',
    difficulty: 0.72,
    discrimination: 0.21,
    correctRate: 42,
    knowledgePoints: [
      { id: 'kp-1', name: '肝细胞癌的病理特征', isCore: true },
      { id: 'kp-5', name: '肝脏肿瘤的鉴别诊断', isCore: true },
    ],
    aiAssessment: {
      quality: 'needs_improvement',
      issues: [
        '难度偏高 (0.72 > 0.7 建议值)',
        '区分度较低 (0.21 < 0.3 及格线)',
        '可能存在知识点超纲或题干表述不清',
      ],
      suggestions: [
        '建议修改题目：1) 增加提示信息 2) 简化病例描述 3) 明确考察范围',
        '或考虑降低分值',
      ],
    },
    answerDistribution: [
      { option: 'A', count: 19, percentage: 42 },
      { option: 'B', count: 13, percentage: 29 },
      { option: 'C', count: 8, percentage: 18 },
      { option: 'D', count: 5, percentage: 11 },
    ],
    needsAttention: true,
  },
]

interface AnalysisState {
  // 知识点相关
  knowledgePoints: KnowledgePoint[]
  knowledgeGraph: KnowledgeGraph
  selectedKnowledgePoint: KnowledgeNode | null
  masterySummary: MasterySummary

  // 错题诊断相关
  errorDiagnoses: ErrorDiagnosis[]
  errorTypeStats: ErrorTypeStats[]
  currentDiagnosis: ErrorDiagnosis | null

  // 聊天相关
  chatMessages: ChatMessage[]
  isChatLoading: boolean

  // 试题分析相关
  examAnalysisResult: ExamAnalysisResult | null
  questionMetrics: QuestionMetrics[]

  // 分析概览
  analysisOverview: AnalysisOverview | null

  // Actions
  fetchKnowledgeData: () => Promise<void>
  selectKnowledgePoint: (point: KnowledgeNode | null) => void
  fetchErrorDiagnoses: () => Promise<void>
  diagnoseError: (errorId: string) => Promise<void>
  sendMessage: (message: string) => Promise<void>
  fetchExamAnalysis: (examId: string) => Promise<void>
  fetchAnalysisOverview: () => Promise<void>
  getStudyRecommendations: () => StudyRecommendation[]
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  // 初始状态
  knowledgePoints: [],
  knowledgeGraph: { nodes: [], edges: [] },
  selectedKnowledgePoint: null,
  masterySummary: {
    total: 0,
    mastered: 0,
    learning: 0,
    weak: 0,
    unlearned: 0,
    averageMastery: 0,
  },
  errorDiagnoses: [],
  errorTypeStats: [],
  currentDiagnosis: null,
  chatMessages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: `您好！我是病理学智能助手，可以帮您：

• 解答病理学知识点问题
• 分析考试题目
• 推荐学习资源
• 解释诊断思路

试试问："肝细胞癌的典型病理特征有哪些？"`,
      timestamp: new Date(),
      suggestedQuestions: [
        '肝细胞癌的典型病理特征有哪些？',
        '如何鉴别肝细胞癌和胆管癌？',
        '肝硬化的病理变化是什么？',
      ],
    },
  ],
  isChatLoading: false,
  examAnalysisResult: null,
  questionMetrics: [],
  analysisOverview: null,

  // 获取知识点数据
  fetchKnowledgeData: async () => {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 300))

    const nodes = generateKnowledgeNodes()
    const edges = generateKnowledgeEdges()

    // 计算掌握度摘要
    const summary: MasterySummary = {
      total: nodes.length,
      mastered: nodes.filter(n => n.status === 'mastered').length,
      learning: nodes.filter(n => n.status === 'learning').length,
      weak: nodes.filter(n => n.status === 'weak').length,
      unlearned: nodes.filter(n => n.status === 'unlearned').length,
      averageMastery: Math.round(nodes.reduce((sum, n) => sum + n.masteryLevel, 0) / nodes.length),
    }

    set({
      knowledgePoints: mockKnowledgePoints,
      knowledgeGraph: { nodes, edges },
      masterySummary: summary,
    })
  },

  // 选择知识点
  selectKnowledgePoint: (point) => set({ selectedKnowledgePoint: point }),

  // 获取错题诊断数据
  fetchErrorDiagnoses: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))

    // 计算错误类型统计
    const typeCounts: Record<string, number> = {}
    mockErrorDiagnoses.forEach(e => {
      typeCounts[e.errorType] = (typeCounts[e.errorType] || 0) + 1
    })

    const typeLabels: Record<string, string> = {
      concept_confusion: '概念混淆',
      detail_omission: '细节遗漏',
      reasoning_error: '推理错误',
    }

    const errorTypeStats: ErrorTypeStats[] = Object.entries(typeCounts).map(([type, count]) => ({
      type: type as ErrorTypeStats['type'],
      label: typeLabels[type],
      count,
      percentage: Math.round((count / mockErrorDiagnoses.length) * 100),
    }))

    set({
      errorDiagnoses: mockErrorDiagnoses,
      errorTypeStats,
    })
  },

  // 诊断单个错题
  diagnoseError: async (errorId) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const error = mockErrorDiagnoses.find(e => e.id === errorId)
    if (error) {
      set({ currentDiagnosis: error })
    }
  },

  // 发送聊天消息
  sendMessage: async (message: string) => {
    const { chatMessages } = get()

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    set({
      chatMessages: [...chatMessages, userMessage],
      isChatLoading: true,
    })

    // 模拟AI响应
    await new Promise(resolve => setTimeout(resolve, 1000))

    const aiResponse = generateAIResponse(message)
    set(state => ({
      chatMessages: [...state.chatMessages, aiResponse],
      isChatLoading: false,
    }))
  },

  // 获取考试分析
  fetchExamAnalysis: async (examId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const examAnalysis: ExamAnalysisResult = {
      examId,
      examName: '期中病理学考试',
      overallMetrics: {
        difficulty: 0.65,
        discrimination: 0.42,
        reliability: 0.78,
        knowledgeCoverage: 0.78,
      },
      questions: mockQuestionMetrics,
      knowledgeCoverage: {
        covered: ['kp-1', 'kp-2', 'kp-3', 'kp-4', 'kp-5'],
        uncovered: ['kp-9', 'kp-10'],
        weaklyCovered: ['kp-6', 'kp-7'],
      },
      aiSuggestions: [
        '建议增加呼吸系统病理相关题目，当前覆盖不足',
        '第5题难度偏高且区分度低，建议修改或替换',
        '整体试卷质量良好，知识点覆盖较全面',
      ],
    }

    set({
      examAnalysisResult: examAnalysis,
      questionMetrics: mockQuestionMetrics,
    })
  },

  // 获取分析概览
  fetchAnalysisOverview: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const overview: AnalysisOverview = {
      knowledgeOverview: {
        totalPoints: 10,
        masteredCount: 3,
        weakPoints: ['肝细胞癌的病理特征', '胆管癌的分类与诊断'],
        masteryLevel: 67,
      },
      errorOverview: {
        totalErrors: 4,
        pendingAnalysis: 1,
        errorTypeStats: [
          { type: 'concept_confusion', label: '概念混淆', count: 2, percentage: 50 },
          { type: 'detail_omission', label: '细节遗漏', count: 1, percentage: 25 },
          { type: 'reasoning_error', label: '推理错误', count: 1, percentage: 25 },
        ],
      },
      learningTrend: [
        { date: '2026-03-30', correctRate: 68, studyTime: 45 },
        { date: '2026-03-31', correctRate: 72, studyTime: 60 },
        { date: '2026-04-01', correctRate: 70, studyTime: 30 },
        { date: '2026-04-02', correctRate: 75, studyTime: 55 },
        { date: '2026-04-03', correctRate: 73, studyTime: 40 },
        { date: '2026-04-04', correctRate: 78, studyTime: 65 },
        { date: '2026-04-05', correctRate: 80, studyTime: 50 },
      ],
      recentChats: [],
    }

    set({ analysisOverview: overview })
  },

  // 获取学习建议
  getStudyRecommendations: () => {
    const { knowledgeGraph } = get()
    const weakNodes = knowledgeGraph.nodes
      .filter(n => n.status === 'weak')
      .sort((a, b) => a.masteryLevel - b.masteryLevel)

    return weakNodes.slice(0, 3).map((node, index) => ({
      knowledgePoint: node.name,
      knowledgePointId: node.id,
      reason: node.masteryLevel < 50 ? '掌握度较低，需要重点复习' : '掌握度不足，建议加强学习',
      resources: [
        { type: 'course' as const, id: node.relatedResources.courses[0] || '', title: `${node.name}课程`, description: '系统讲解相关知识', estimatedTime: 45 },
        { type: 'slice' as const, id: node.relatedResources.slices[0] || '', title: '相关切片', description: '直观了解病理变化' },
        { type: 'exercise' as const, id: '', title: '专项练习', description: '针对性强化训练', estimatedTime: 20 },
      ],
      priority: index + 1,
    }))
  },
}))

// 模拟AI响应生成
function generateAIResponse(question: string): ChatMessage {
  const lowerQuestion = question.toLowerCase()

  let content = ''
  let sources: ChatMessage['sources'] = []

  if (lowerQuestion.includes('肝细胞癌') || lowerQuestion.includes('肝癌')) {
    content = `肝细胞癌（Hepatocellular Carcinoma, HCC）是肝脏最常见的原发性恶性肿瘤，其典型病理特征包括：

### 组织学特征

1. **细胞形态**
   - 肝细胞样细胞，多角形
   - 胞质丰富，嗜酸性或透明
   - 核仁明显

2. **组织结构**
   - 梁状型（最常见）：癌细胞排列成梁状，由血窦分隔
   - 假腺管型：形成腺样结构
   - 实体型：癌细胞密集排列

3. **特殊表现**
   - 胆汁分泌：胞质内可见胆色素
   - 脂肪变性：部分区域可见脂肪空泡
   - Mallory小体：嗜酸性包涵体`
    sources = [
      { type: 'textbook', id: 'book-1', title: '《Robbins基础病理学》第10版', page: 'P.532-535' },
      { type: 'course', id: 'course-1', title: '消化病理学 - 第5章肝脏肿瘤' },
      { type: 'slice', id: 'slice-1', title: '肝细胞癌-梁状型典型病例' },
    ]
  } else if (lowerQuestion.includes('胆管癌')) {
    content = `胆管癌（Cholangiocarcinoma）是起源于胆管上皮的恶性肿瘤，其病理特征包括：

### 组织学特征

1. **大体形态**
   - 肝内型：位于肝实质内
   - 肝门型：位于肝门部胆管
   - 远端型：位于胆管远端

2. **镜下特点**
   - 腺癌结构，形成不规则腺管
   - 细胞异型性明显
   - 间质纤维组织增生明显

3. **鉴别要点**
   - 与肝细胞癌鉴别：保留胆管结构
   - 免疫组化：CK7、CK19阳性，HepPar-1阴性`
    sources = [
      { type: 'textbook', id: 'book-1', title: '《Robbins基础病理学》第10版', page: 'P.538-540' },
      { type: 'course', id: 'course-1', title: '消化病理学 - 第5章肝脏肿瘤' },
    ]
  } else if (lowerQuestion.includes('肝硬化')) {
    content = `肝硬化是肝脏慢性损伤的终末期改变，其主要病理特征包括：

### 病理变化

1. **大体形态**
   - 肝脏体积缩小、质地变硬
   - 表面呈弥漫性结节状
   - 切面可见再生结节

2. **镜下特点**
   - 假小叶形成（特征性病变）
   - 肝细胞再生结节
   - 纤维间隔包绕

3. **常见病因**
   - 病毒性肝炎（我国最常见）
   - 酒精性肝病
   - 胆汁淤积
   - 代谢性疾病`
    sources = [
      { type: 'textbook', id: 'book-1', title: '《Robbins基础病理学》第10版', page: 'P.525-528' },
      { type: 'course', id: 'course-1', title: '消化病理学 - 肝硬化章节' },
    ]
  } else {
    content = `您的问题涉及病理学相关知识，我来为您解答：

根据您的问题，我需要了解更多上下文才能提供准确的回答。您可以：

1. 具体说明您想了解的知识点
2. 提供相关的病例或问题背景
3. 告诉我您的学习目标

我会根据知识库为您提供专业的解答。`
  }

  return {
    id: `ai-${Date.now()}`,
    role: 'assistant',
    content,
    timestamp: new Date(),
    sources,
    suggestedQuestions: [
      '肝细胞癌如何与胆管癌鉴别？',
      '肝细胞癌的免疫组化特征？',
      '肝硬化如何发展为肝癌？',
    ],
    actions: [
      { label: '查看相关切片', action: 'view_slice', target: 'slice-1' },
      { label: '观看课程', action: 'watch_course', target: 'course-1' },
    ],
  }
}
