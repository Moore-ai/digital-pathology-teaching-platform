import { Exam, Question } from '@/types/exam';
import { mockQuestions } from './questions';

// 从题库中筛选特定分类的题目
function getQuestionsForExam(categories: string[], count: number): Question[] {
  const filtered = mockQuestions.filter(q => categories.includes(q.category));
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((q, index) => ({
    ...q,
    id: `exam-q-${Date.now()}-${index}`,
  }));
}

// 消化系统题目
const digestiveQuestions: Question[] = mockQuestions
  .filter(q => q.category === 'digestive')
  .slice(0, 8)
  .map((q, index) => ({ ...q, id: `exam-1-q-${index}` }));

// 呼吸系统题目
const respiratoryQuestions: Question[] = mockQuestions
  .filter(q => q.category === 'respiratory')
  .slice(0, 6)
  .map((q, index) => ({ ...q, id: `exam-3-q-${index}` }));

// 乳腺题目
const breastQuestions: Question[] = mockQuestions
  .filter(q => q.category === 'breast')
  .slice(0, 5)
  .map((q, index) => ({ ...q, id: `exam-4-q-${index}` }));

// 综合题目
const comprehensiveQuestions: Question[] = mockQuestions
  .slice(0, 10)
  .map((q, index) => ({ ...q, id: `exam-5-q-${index}` }));

export const mockExams: Exam[] = [
  {
    id: '1',
    title: '期中考试 - 消化系统病理',
    description: '涵盖消化系统各器官疾病的病理诊断，包括食管、胃、肠道、肝脏、胰腺等。',
    startTime: new Date('2026-04-15T09:00:00'),
    endTime: new Date('2026-04-15T11:00:00'),
    duration: 120,
    totalQuestions: digestiveQuestions.length,
    totalScore: digestiveQuestions.reduce((sum, q) => sum + q.score, 0),
    status: 'published',
    questions: digestiveQuestions,
    createdBy: 'T001',
    createdAt: new Date('2026-03-01'),
  },
  {
    id: '6',
    title: '第三单元测试 - 已结束',
    description: '肝脏疾病专题测试，涵盖肝炎、肝硬化、肝癌等内容。考试已结束，等待批改。',
    startTime: new Date('2026-03-18T14:00:00'),
    endTime: new Date('2026-03-18T15:30:00'),
    duration: 90,
    totalQuestions: digestiveQuestions.slice(0, 5).length,
    totalScore: digestiveQuestions.slice(0, 5).reduce((sum, q) => sum + q.score, 0),
    status: 'completed',
    questions: digestiveQuestions.slice(0, 5),
    createdBy: 'T001',
    createdAt: new Date('2026-03-15'),
  },
  {
    id: '2',
    title: '第三单元测试',
    description: '肝脏疾病专题测试，涵盖肝炎、肝硬化、肝癌等内容。',
    startTime: new Date('2026-03-20T14:00:00'),
    endTime: new Date('2026-03-20T15:30:00'),
    duration: 90,
    totalQuestions: digestiveQuestions.length,
    totalScore: digestiveQuestions.reduce((sum, q) => sum + q.score, 0),
    status: 'graded',
    questions: digestiveQuestions,
    createdBy: 'T001',
    createdAt: new Date('2026-03-15'),
  },
  {
    id: '3',
    title: '呼吸系统病理测验',
    description: '呼吸系统疾病的病理诊断测验。',
    startTime: new Date('2026-04-01T10:00:00'),
    endTime: new Date('2026-04-01T11:00:00'),
    duration: 60,
    totalQuestions: respiratoryQuestions.length,
    totalScore: respiratoryQuestions.reduce((sum, q) => sum + q.score, 0),
    status: 'ongoing',
    questions: respiratoryQuestions,
    createdBy: 'T002',
    createdAt: new Date('2026-03-25'),
  },
  {
    id: '4',
    title: '乳腺病理学随堂测试',
    description: '乳腺疾病病理诊断随堂测试。',
    startTime: new Date('2026-04-05T14:00:00'),
    endTime: new Date('2026-04-05T14:45:00'),
    duration: 45,
    totalQuestions: breastQuestions.length,
    totalScore: breastQuestions.reduce((sum, q) => sum + q.score, 0),
    status: 'draft',
    questions: breastQuestions,
    createdBy: 'T001',
    createdAt: new Date('2026-03-28'),
  },
  {
    id: '5',
    title: '期末考试 - 综合病理',
    description: '本学期综合病理学期末考试，涵盖所有学习内容。',
    startTime: new Date('2026-06-20T09:00:00'),
    endTime: new Date('2026-06-20T12:00:00'),
    duration: 180,
    totalQuestions: comprehensiveQuestions.length,
    totalScore: comprehensiveQuestions.reduce((sum, q) => sum + q.score, 0),
    status: 'draft',
    questions: comprehensiveQuestions,
    createdBy: 'T001',
    createdAt: new Date('2026-03-20'),
  },
];

// 根据状态筛选考试
export function getExamsByStatus(status: Exam['status']): Exam[] {
  return mockExams.filter(e => e.status === status);
}

// 获取考试详情
export function getExamById(id: string): Exam | undefined {
  return mockExams.find(e => e.id === id);
}

// 待参加的考试
export const pendingExams = mockExams.filter(e => e.status === 'published' || e.status === 'ongoing');

// 已完成的考试
export const completedExams = mockExams.filter(e => e.status === 'graded' || e.status === 'completed');
