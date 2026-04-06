import { create } from 'zustand';
import { Exam, ExamConfig, Question, ExamSubmission } from '@/types/exam';
import { CourseCategory } from '@/types/course';
import { mockQuestions } from '@/lib/mock/questions';

// 主观题批改结果
export interface SubjectiveGrade {
  questionId: string;
  score: number;
  comment?: string;
  gradedBy: string;
  gradedAt: Date;
}

// 学生提交记录接口
interface StudentSubmission {
  examId: string;
  studentId: string;
  score: number;
  answers: Map<string, string | string[]>;
  submittedAt: Date;
  // 主观题批改状态
  subjectiveGrades?: Map<string, SubjectiveGrade>;
  isGradingComplete?: boolean;
  gradedBy?: string;
  gradedAt?: Date;
}

interface ExamState {
  currentExam: Exam | null;
  currentQuestionIndex: number;
  answers: Map<string, string | string[]>;
  timeRemaining: number;        // 秒
  isSubmitted: boolean;
  isPaused: boolean;

  // 组卷相关
  examConfig: ExamConfig | null;

  // 所有考试列表（包括新创建的）
  exams: Exam[];

  // 学生提交记录
  studentSubmissions: StudentSubmission[];

  // Actions
  setCurrentExam: (exam: Exam) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  setTimeRemaining: (time: number) => void;
  pauseExam: () => void;
  resumeExam: () => void;
  submitExam: () => void;
  resetExam: () => void;

  // 组卷相关
  setExamConfig: (config: ExamConfig) => void;
  createExam: (config: ExamConfig) => Exam;
  addExam: (exam: Exam) => void;
  getExams: () => Exam[];

  // 学生提交相关
  submitStudentExam: (examId: string, studentId: string) => number;
  getStudentSubmission: (examId: string, studentId: string) => StudentSubmission | undefined;
  hasStudentSubmitted: (examId: string, studentId: string) => boolean;
  updateExamStatus: (examId: string, status: Exam['status']) => void;

  // 批改相关
  gradeSubjectiveQuestion: (examId: string, studentId: string, questionId: string, grade: SubjectiveGrade) => void;
  isSubjectiveGraded: (examId: string, studentId: string, questionId: string) => boolean;
  getSubjectiveGrade: (examId: string, studentId: string, questionId: string) => SubjectiveGrade | undefined;
  completeGrading: (examId: string, studentId: string, gradedBy: string) => void;
  isGradingComplete: (examId: string, studentId: string) => boolean;
  checkAndCompleteExamGrading: (examId: string) => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  currentExam: null,
  currentQuestionIndex: 0,
  answers: new Map(),
  timeRemaining: 0,
  isSubmitted: false,
  isPaused: false,
  examConfig: null,
  exams: [],
  studentSubmissions: [],

  setCurrentExam: (exam) => set({
    currentExam: exam,
    currentQuestionIndex: 0,
    timeRemaining: exam.duration * 60,
    answers: new Map(),
    isSubmitted: false,
    isPaused: false,
  }),

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

  setAnswer: (questionId, answer) => set((state) => {
    const newAnswers = new Map(state.answers);
    newAnswers.set(questionId, answer);
    return { answers: newAnswers };
  }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  pauseExam: () => set({ isPaused: true }),

  resumeExam: () => set({ isPaused: false }),

  submitExam: () => {
    const { currentExam, answers } = get();
    if (!currentExam) return;

    // 计算分数
    let score = 0;
    currentExam.questions.forEach((question) => {
      const userAnswer = answers.get(question.id);
      if (userAnswer) {
        if (question.type === 'multiple') {
          const correctAnswers = question.correctAnswer as string[];
          const userAnswers = userAnswer as string[];
          if (
            correctAnswers.length === userAnswers.length &&
            correctAnswers.every(a => userAnswers.includes(a))
          ) {
            score += question.score;
          }
        } else {
          if (userAnswer === question.correctAnswer) {
            score += question.score;
          }
        }
      }
    });

    set({ isSubmitted: true, isPaused: true });
  },

  resetExam: () => set({
    currentExam: null,
    currentQuestionIndex: 0,
    answers: new Map(),
    timeRemaining: 0,
    isSubmitted: false,
    isPaused: false,
  }),

  setExamConfig: (config) => set({ examConfig: config }),

  // 根据配置从题库抽取题目创建考试
  createExam: (config: ExamConfig): Exam => {
    const { exams } = get()

    // 根据知识点筛选题目
    let filteredQuestions = mockQuestions.filter(q =>
      config.categories.includes(q.category as CourseCategory)
    )

    // 按题型分组
    const questionsByType: Record<string, Question[]> = {
      single: [],
      multiple: [],
      judgment: [],
      short_answer: [],
    }

    filteredQuestions.forEach(q => {
      const type = q.type as keyof typeof questionsByType
      if (questionsByType[type]) {
        questionsByType[type].push(q)
      }
    })

    // 随机抽题函数
    const shuffleAndPick = (arr: Question[], count: number): Question[] => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, Math.min(count, shuffled.length))
    }

    // 题型配置
    const configTypes = {
      single: config.questionTypes.single,
      multiple: config.questionTypes.multiple,
      judgment: config.questionTypes.judgment,
      short_answer: config.questionTypes.shortAnswer,
    }

    // 按难度分布从各题型中抽题
    const selectedQuestions: Question[] = []
    const types: Array<'single' | 'multiple' | 'judgment' | 'short_answer'> = ['single', 'multiple', 'judgment', 'short_answer']

    types.forEach(type => {
      const targetCount = configTypes[type]
      if (targetCount === 0) return

      const typeQuestions = questionsByType[type]
      if (typeQuestions.length === 0) return

      // 按难度分组
      const byDifficulty = {
        easy: typeQuestions.filter(q => q.difficulty === 'easy'),
        medium: typeQuestions.filter(q => q.difficulty === 'medium'),
        hard: typeQuestions.filter(q => q.difficulty === 'hard'),
      }

      // 计算各难度需要的题目数量
      let easyTarget = Math.round(targetCount * config.difficultyDistribution.easy / 100)
      let mediumTarget = Math.round(targetCount * config.difficultyDistribution.medium / 100)
      let hardTarget = targetCount - easyTarget - mediumTarget

      // 调整以确保总和正确
      if (hardTarget < 0) {
        hardTarget = 0
        const total = easyTarget + mediumTarget
        if (total > targetCount) {
          easyTarget = Math.round(easyTarget * targetCount / total)
          mediumTarget = targetCount - easyTarget
        }
      }

      // 从各难度池中抽题
      const easyPicked = shuffleAndPick(byDifficulty.easy, easyTarget)
      const mediumPicked = shuffleAndPick(byDifficulty.medium, mediumTarget)
      const hardPicked = shuffleAndPick(byDifficulty.hard, hardTarget)

      let picked = [...easyPicked, ...mediumPicked, ...hardPicked]

      // 如果抽到的题目数量不足，从该题型所有题目中补充
      if (picked.length < targetCount) {
        const remaining = typeQuestions.filter(q => !picked.find(p => p.id === q.id))
        const additional = shuffleAndPick(remaining, targetCount - picked.length)
        picked = [...picked, ...additional]
      }

      selectedQuestions.push(...picked)
    })

    // 为每道题分配分值（使用教师设置的分值）
    const scoreConfig: Record<string, number> = {
      single: config.questionScores?.single || 2,
      multiple: config.questionScores?.multiple || 3,
      judgment: config.questionScores?.judgment || 1,
      short_answer: config.questionScores?.shortAnswer || 10,
    }

    const questionsWithScores = selectedQuestions.map((q, index) => ({
      ...q,
      id: `new-${Date.now()}-${index}`,
      score: scoreConfig[q.type] || q.score,
    }))

    // 创建新考试
    const newExam: Exam = {
      id: `exam-${Date.now()}`,
      title: config.name,
      description: `智能组卷生成 - 涵盖${config.categories.map(c => c).join('、')}等知识点`,
      startTime: new Date(),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天后结束
      duration: config.duration,
      totalQuestions: questionsWithScores.length,
      totalScore: questionsWithScores.reduce((sum, q) => sum + q.score, 0),
      status: 'published',
      questions: questionsWithScores,
      createdBy: 'current-user',
      createdAt: new Date(),
    }

    // 添加到考试列表
    set({ exams: [newExam, ...exams] })

    return newExam
  },

  addExam: (exam) => set((state) => ({
    exams: [exam, ...state.exams]
  })),

  getExams: () => get().exams,

  // 提交学生考试，返回分数
  submitStudentExam: (examId: string, studentId: string): number => {
    const { currentExam, answers, studentSubmissions } = get();
    if (!currentExam || currentExam.id !== examId) return 0;

    // 计算分数
    let score = 0;
    let correctCount = 0;
    currentExam.questions.forEach((question) => {
      const userAnswer = answers.get(question.id);
      if (userAnswer) {
        if (question.type === 'multiple') {
          const correctAnswers = question.correctAnswer as string[];
          const userAnswers = userAnswer as string[];
          if (
            correctAnswers.length === userAnswers.length &&
            correctAnswers.every(a => userAnswers.includes(a))
          ) {
            score += question.score;
            correctCount++;
          }
        } else {
          if (userAnswer === question.correctAnswer) {
            score += question.score;
            correctCount++;
          }
        }
      }
    });

    // 保存提交记录
    const submission: StudentSubmission = {
      examId,
      studentId,
      score,
      answers: new Map(answers),
      submittedAt: new Date(),
    };

    set({
      studentSubmissions: [...studentSubmissions, submission],
      isSubmitted: true,
      isPaused: true,
    });

    // 更新考试状态为已结束
    get().updateExamStatus(examId, 'completed');

    return score;
  },

  // 更新考试状态
  updateExamStatus: (examId: string, status: Exam['status']) => {
    const { exams, currentExam } = get();
    const examIndex = exams.findIndex(e => e.id === examId);

    if (examIndex !== -1) {
      // 考试已在 store 中，直接更新
      const updatedExams = [...exams];
      updatedExams[examIndex] = {
        ...updatedExams[examIndex],
        status,
      };
      set({ exams: updatedExams });
    } else if (currentExam && currentExam.id === examId) {
      // 考试不在 store 中但当前正在考试，将其添加到 store
      set({
        exams: [{ ...currentExam, status }, ...exams],
      });
    }
  },

  // 获取学生提交记录
  getStudentSubmission: (examId: string, studentId: string): StudentSubmission | undefined => {
    const { studentSubmissions } = get();
    return studentSubmissions.find(
      s => s.examId === examId && s.studentId === studentId
    );
  },

  // 检查学生是否已提交考试
  hasStudentSubmitted: (examId: string, studentId: string): boolean => {
    const { studentSubmissions } = get();
    return studentSubmissions.some(
      s => s.examId === examId && s.studentId === studentId
    );
  },

  // 批改主观题
  gradeSubjectiveQuestion: (examId: string, studentId: string, questionId: string, grade: SubjectiveGrade) => {
    const { studentSubmissions } = get();
    const submissionIndex = studentSubmissions.findIndex(
      s => s.examId === examId && s.studentId === studentId
    );

    if (submissionIndex === -1) return;

    const submission = studentSubmissions[submissionIndex];
    const subjectiveGrades = new Map(submission.subjectiveGrades || new Map());
    subjectiveGrades.set(questionId, grade);

    const updatedSubmissions = [...studentSubmissions];
    updatedSubmissions[submissionIndex] = {
      ...submission,
      subjectiveGrades,
    };

    set({ studentSubmissions: updatedSubmissions });
  },

  // 检查主观题是否已批改
  isSubjectiveGraded: (examId: string, studentId: string, questionId: string): boolean => {
    const { studentSubmissions } = get();
    const submission = studentSubmissions.find(
      s => s.examId === examId && s.studentId === studentId
    );
    return submission?.subjectiveGrades?.has(questionId) ?? false;
  },

  // 获取主观题批改结果
  getSubjectiveGrade: (examId: string, studentId: string, questionId: string): SubjectiveGrade | undefined => {
    const { studentSubmissions } = get();
    const submission = studentSubmissions.find(
      s => s.examId === examId && s.studentId === studentId
    );
    return submission?.subjectiveGrades?.get(questionId);
  },

  // 完成批改
  completeGrading: (examId: string, studentId: string, gradedBy: string) => {
    const { studentSubmissions } = get();
    const submissionIndex = studentSubmissions.findIndex(
      s => s.examId === examId && s.studentId === studentId
    );

    if (submissionIndex === -1) return;

    const submission = studentSubmissions[submissionIndex];

    // 检查是否已经批改完成
    if (submission.isGradingComplete) {
      console.warn('该学生试卷已批改完成，不能重复批改');
      return;
    }

    // 计算总分（客观题 + 主观题批改分数）
    let totalScore = 0;
    // 这里需要结合 currentExam 的题目来计算
    // 客观题分数已经在提交时计算，主观题需要加上批改分数
    const objectiveScore = submission.score; // 原始分数（客观题）
    let subjectiveScore = 0;

    submission.subjectiveGrades?.forEach((grade) => {
      subjectiveScore += grade.score;
    });

    totalScore = objectiveScore + subjectiveScore;

    const updatedSubmissions = [...studentSubmissions];
    updatedSubmissions[submissionIndex] = {
      ...submission,
      score: totalScore,
      isGradingComplete: true,
      gradedBy,
      gradedAt: new Date(),
    };

    set({ studentSubmissions: updatedSubmissions });

    // 检查是否所有学生都已批改完成
    get().checkAndCompleteExamGrading(examId);
  },

  // 检查批改是否完成
  isGradingComplete: (examId: string, studentId: string): boolean => {
    const { studentSubmissions } = get();
    const submission = studentSubmissions.find(
      s => s.examId === examId && s.studentId === studentId
    );
    return submission?.isGradingComplete ?? false;
  },

  // 检查并完成考试批改
  checkAndCompleteExamGrading: (examId: string) => {
    const { studentSubmissions, exams, currentExam } = get();

    // 获取该考试的所有提交
    const examSubmissions = studentSubmissions.filter(s => s.examId === examId);

    if (examSubmissions.length === 0) return;

    // 检查是否所有提交都已批改完成
    const allGraded = examSubmissions.every(s => s.isGradingComplete);

    if (allGraded) {
      // 更新考试状态为已批改
      const examIndex = exams.findIndex(e => e.id === examId);

      if (examIndex !== -1) {
        const updatedExams = [...exams];
        updatedExams[examIndex] = {
          ...updatedExams[examIndex],
          status: 'graded',
        };
        set({ exams: updatedExams });
      } else if (currentExam && currentExam.id === examId) {
        // 考试不在 store 中但当前正在处理，将其添加到 store
        set({
          exams: [{ ...currentExam, status: 'graded' }, ...exams],
        });
      }
    }
  },
}));

// 计时器 Hook
export function useExamTimer() {
  const { timeRemaining, isPaused, isSubmitted } = useExamStore();

  // 在实际应用中，这里会使用 useEffect 来实现计时
  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isPaused,
    isSubmitted,
  };
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
