import { CourseCategory } from './course';
import { SliceReference } from './course';

export interface Exam {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  duration: number;          // 考试时长(分钟)
  totalQuestions: number;
  totalScore: number;
  status: ExamStatus;
  questions: Question[];
  submissions?: ExamSubmission[];
  createdBy: string;
  createdAt: Date;
}

export type ExamStatus =
  | 'draft'        // 草稿
  | 'published'    // 已发布
  | 'ongoing'      // 进行中
  | 'completed'    // 已结束
  | 'graded';      // 已批改

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  explanation?: string;
  score: number;
  difficulty: QuestionDifficulty;
  category: CourseCategory;
  relatedSlice?: SliceReference;
  createdBy: string;
  createdAt: Date;
}

export type QuestionType =
  | 'single'        // 单选题
  | 'multiple'      // 多选题
  | 'judgment'      // 判断题
  | 'short_answer'; // 简答题

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  key: string;     // A, B, C, D
  value: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: Answer[];
  score?: number;
  submittedAt: Date;
  gradedAt?: Date;
  gradedBy?: string;
}

export interface Answer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
}

// 智能组卷参数
export interface ExamConfig {
  name: string;
  duration: number;
  categories: CourseCategory[];
  difficultyDistribution: {
    easy: number;      // 百分比
    medium: number;
    hard: number;
  };
  questionTypes: {
    single: number;    // 数量
    multiple: number;
    judgment: number;
    shortAnswer: number;
  };
  questionScores?: {   // 每题分值（可选）
    single: number;
    multiple: number;
    judgment: number;
    shortAnswer: number;
  };
  totalScore: number;
}

// 考试结果统计
export interface ExamResultStats {
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  submissionCount: number;
  questionStats: QuestionStat[];
}

export interface QuestionStat {
  questionId: string;
  correctRate: number;
  averageTime: number;
  commonWrongAnswers: string[];
}
