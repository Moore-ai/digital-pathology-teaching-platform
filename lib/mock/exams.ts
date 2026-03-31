import { Exam } from '@/types/exam';

export const mockExams: Exam[] = [
  {
    id: '1',
    title: '期中考试 - 消化系统病理',
    description: '涵盖消化系统各器官疾病的病理诊断，包括食管、胃、肠道、肝脏、胰腺等。',
    startTime: new Date('2026-04-15T09:00:00'),
    endTime: new Date('2026-04-15T11:00:00'),
    duration: 120,
    totalQuestions: 50,
    totalScore: 100,
    status: 'published',
    questions: [],
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
    totalQuestions: 5,
    totalScore: 75,
    status: 'completed',
    questions: [],
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
    totalQuestions: 30,
    totalScore: 100,
    status: 'graded',
    questions: [],
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
    totalQuestions: 20,
    totalScore: 100,
    status: 'ongoing',
    questions: [],
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
    totalQuestions: 15,
    totalScore: 100,
    status: 'draft',
    questions: [],
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
    totalQuestions: 100,
    totalScore: 100,
    status: 'draft',
    questions: [],
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
