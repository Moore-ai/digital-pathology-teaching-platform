import { create } from 'zustand';
import { Exam, ExamConfig } from '@/types/exam';

interface ExamState {
  currentExam: Exam | null;
  currentQuestionIndex: number;
  answers: Map<string, string | string[]>;
  timeRemaining: number;        // 秒
  isSubmitted: boolean;
  isPaused: boolean;

  // 组卷相关
  examConfig: ExamConfig | null;

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
}

export const useExamStore = create<ExamState>((set, get) => ({
  currentExam: null,
  currentQuestionIndex: 0,
  answers: new Map(),
  timeRemaining: 0,
  isSubmitted: false,
  isPaused: false,
  examConfig: null,

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
    const { currentExam } = get();
    if (!currentExam) return;

    // 计算分数（Mock 逻辑）
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
