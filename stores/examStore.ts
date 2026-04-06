import { create } from 'zustand';
import { Exam, ExamConfig, Question, ExamSubmission } from '@/types/exam';
import { CourseCategory } from '@/types/course';
import { mockQuestions } from '@/lib/mock/questions';

// 学生提交记录接口
interface StudentSubmission {
  examId: string;
  studentId: string;
  score: number;
  answers: Map<string, string | string[]>;
  submittedAt: Date;
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

    // 按题型和难度分组
    const questionsByTypeAndDifficulty = {
      single: { easy: [] as Question[], medium: [] as Question[], hard: [] as Question[] },
      multiple: { easy: [] as Question[], medium: [] as Question[], hard: [] as Question[] },
      judgment: { easy: [] as Question[], medium: [] as Question[], hard: [] as Question[] },
      short_answer: { easy: [] as Question[], medium: [] as Question[], hard: [] as Question[] },
    }

    filteredQuestions.forEach(q => {
      const type = q.type as keyof typeof questionsByTypeAndDifficulty
      if (questionsByTypeAndDifficulty[type]) {
        questionsByTypeAndDifficulty[type][q.difficulty].push(q)
      }
    })

    // 随机抽题函数
    const shuffleAndPick = (arr: Question[], count: number): Question[] => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count)
    }

    // 根据难度分布和题型配置抽题
    const selectedQuestions: Question[] = []
    const types: Array<'single' | 'multiple' | 'judgment' | 'short_answer'> = ['single', 'multiple', 'judgment', 'short_answer']
    const configTypes = {
      single: config.questionTypes.single,
      multiple: config.questionTypes.multiple,
      judgment: config.questionTypes.judgment,
      short_answer: config.questionTypes.shortAnswer,
    }

    types.forEach(type => {
      const count = configTypes[type]
      if (count === 0) return

      const easyCount = Math.round(count * config.difficultyDistribution.easy / 100)
      const mediumCount = Math.round(count * config.difficultyDistribution.medium / 100)
      const hardCount = count - easyCount - mediumCount

      const typeQuestions = questionsByTypeAndDifficulty[type]
      selectedQuestions.push(
        ...shuffleAndPick(typeQuestions.easy, easyCount),
        ...shuffleAndPick(typeQuestions.medium, mediumCount),
        ...shuffleAndPick(typeQuestions.hard, hardCount)
      )
    })

    // 为每道题分配分值
    const questionsWithScores = selectedQuestions.map((q, index) => ({
      ...q,
      id: `new-${Date.now()}-${index}`,
      score: q.type === 'single' ? 2 : q.type === 'multiple' ? 3 : q.type === 'judgment' ? 1 : 10,
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

    return score;
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
