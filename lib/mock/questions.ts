import { Question } from '@/types/exam';

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    type: 'single',
    content: '下列哪项不是肝细胞癌的病理特征？',
    options: [
      { key: 'A', value: '癌细胞呈梁状排列' },
      { key: 'B', value: '可见胆汁分泌' },
      { key: 'C', value: '常伴有肝硬化背景' },
      { key: 'D', value: '肿瘤细胞呈巢状排列，细胞间桥明显' },
    ],
    correctAnswer: 'D',
    explanation: '细胞间桥明显是鳞状细胞癌的特征，肝细胞癌不具备此特征。肝细胞癌的典型特征包括：梁状排列、胆汁分泌、血窦丰富、常伴肝硬化背景。',
    score: 2,
    difficulty: 'medium',
    category: 'digestive',
    createdBy: 'T001',
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'q2',
    type: 'multiple',
    content: '肝硬化常见的病因包括：',
    options: [
      { key: 'A', value: '乙型肝炎病毒感染' },
      { key: 'B', value: '酒精中毒' },
      { key: 'C', value: '胆汁淤积' },
      { key: 'D', value: '自身免疫性肝炎' },
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: '以上均为肝硬化的常见病因。在我国，乙型肝炎病毒感染是最常见的原因。',
    score: 2,
    difficulty: 'easy',
    category: 'digestive',
    createdBy: 'T001',
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'q3',
    type: 'single',
    content: '胃溃疡最常见的并发症是：',
    options: [
      { key: 'A', value: '出血' },
      { key: 'B', value: '穿孔' },
      { key: 'C', value: '幽门梗阻' },
      { key: 'D', value: '癌变' },
    ],
    correctAnswer: 'A',
    explanation: '胃溃疡最常见的并发症是出血，约占患者的20-30%。穿孔、幽门梗阻和癌变相对较少见。',
    score: 2,
    difficulty: 'easy',
    category: 'digestive',
    createdBy: 'T001',
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'q4',
    type: 'judgment',
    content: 'Barrett食管是食管腺癌的癌前病变。',
    correctAnswer: '正确',
    explanation: 'Barrett食管是指食管下段的鳞状上皮被柱状上皮取代，是食管腺癌的重要癌前病变，发生腺癌的风险较正常人群高30-40倍。',
    score: 1,
    difficulty: 'easy',
    category: 'digestive',
    createdBy: 'T001',
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'q5',
    type: 'single',
    content: '肺腺癌最常见的生长模式是：',
    options: [
      { key: 'A', value: '贴壁状生长' },
      { key: 'B', value: '乳头状生长' },
      { key: 'C', value: '腺泡状生长' },
      { key: 'D', value: '实性生长' },
    ],
    correctAnswer: 'A',
    explanation: '贴壁状生长是肺腺癌最常见的生长模式，也是预后相对较好的一种类型。',
    score: 2,
    difficulty: 'medium',
    category: 'respiratory',
    createdBy: 'T002',
    createdAt: new Date('2024-10-01'),
  },
  {
    id: 'q6',
    type: 'multiple',
    content: '乳腺浸润性导管癌的病理特征包括：',
    options: [
      { key: 'A', value: '不规则腺管结构' },
      { key: 'B', value: '细胞异型性' },
      { key: 'C', value: '间质纤维化' },
      { key: 'D', value: '核分裂象增多' },
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: '乳腺浸润性导管癌具有以上所有特征，是最常见的乳腺恶性肿瘤类型。',
    score: 2,
    difficulty: 'medium',
    category: 'breast',
    createdBy: 'T001',
    createdAt: new Date('2024-11-01'),
  },
  {
    id: 'q7',
    type: 'single',
    content: '甲状腺乳头状癌最特征性的细胞核形态是：',
    options: [
      { key: 'A', value: '毛玻璃样核' },
      { key: 'B', value: '核仁明显' },
      { key: 'C', value: '核深染' },
      { key: 'D', value: '核固缩' },
    ],
    correctAnswer: 'A',
    explanation: '甲状腺乳头状癌的特征性核形态包括毛玻璃样核、核沟和核内包涵体。',
    score: 2,
    difficulty: 'medium',
    category: 'endocrine',
    createdBy: 'T002',
    createdAt: new Date('2024-11-01'),
  },
  {
    id: 'q8',
    type: 'short_answer',
    content: '简述肝硬化的病理形态特征。',
    correctAnswer: '肝硬化病理形态特征：1.假小叶形成；2.纤维间隔包绕；3.肝细胞变性坏死与再生；4.小胆管增生；5.炎性细胞浸润。',
    explanation: '肝硬化的核心病理特征是假小叶形成，这是诊断肝硬化的金标准。',
    score: 5,
    difficulty: 'hard',
    category: 'digestive',
    createdBy: 'T001',
    createdAt: new Date('2024-09-01'),
  },
  {
    id: 'q9',
    type: 'single',
    content: '胶质母细胞瘤的WHO分级是：',
    options: [
      { key: 'A', value: 'I级' },
      { key: 'B', value: 'II级' },
      { key: 'C', value: 'III级' },
      { key: 'D', value: 'IV级' },
    ],
    correctAnswer: 'D',
    explanation: '胶质母细胞瘤（GBM）是最高级别的胶质瘤，WHO分级为IV级，预后极差。',
    score: 2,
    difficulty: 'easy',
    category: 'nervous',
    createdBy: 'T002',
    createdAt: new Date('2024-11-01'),
  },
  {
    id: 'q10',
    type: 'judgment',
    content: '肾透明细胞癌是最常见的肾细胞癌类型。',
    correctAnswer: '正确',
    explanation: '肾透明细胞癌占肾细胞癌的70-80%，是最常见的类型，与VHL基因突变相关。',
    score: 1,
    difficulty: 'easy',
    category: 'urinary',
    createdBy: 'T003',
    createdAt: new Date('2024-12-01'),
  },
];

// 根据分类筛选题目
export function getQuestionsByCategory(category: string): Question[] {
  return mockQuestions.filter(q => q.category === category);
}

// 根据难度筛选题目
export function getQuestionsByDifficulty(difficulty: Question['difficulty']): Question[] {
  return mockQuestions.filter(q => q.difficulty === difficulty);
}

// 根据类型筛选题目
export function getQuestionsByType(type: Question['type']): Question[] {
  return mockQuestions.filter(q => q.type === type);
}

// 获取题目详情
export function getQuestionById(id: string): Question | undefined {
  return mockQuestions.find(q => q.id === id);
}

// 题库统计
export const questionStats = {
  total: mockQuestions.length,
  byType: {
    single: mockQuestions.filter(q => q.type === 'single').length,
    multiple: mockQuestions.filter(q => q.type === 'multiple').length,
    judgment: mockQuestions.filter(q => q.type === 'judgment').length,
    short_answer: mockQuestions.filter(q => q.type === 'short_answer').length,
  },
  byDifficulty: {
    easy: mockQuestions.filter(q => q.difficulty === 'easy').length,
    medium: mockQuestions.filter(q => q.difficulty === 'medium').length,
    hard: mockQuestions.filter(q => q.difficulty === 'hard').length,
  },
};
