import { create } from 'zustand';
import { Course, Chapter, Lesson } from '@/types/course';

interface CourseState {
  currentCourse: Course | null;
  currentChapter: Chapter | null;
  currentLesson: Lesson | null;
  watchProgress: Map<string, number>;  // lessonId -> progress percentage

  // Actions
  setCurrentCourse: (course: Course) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  setCurrentLesson: (lesson: Lesson | null) => void;
  updateWatchProgress: (lessonId: string, progress: number) => void;
  markLessonComplete: (lessonId: string) => void;
  reset: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  currentCourse: null,
  currentChapter: null,
  currentLesson: null,
  watchProgress: new Map(),

  setCurrentCourse: (course) => set({
    currentCourse: course,
    currentChapter: course.chapters[0] || null,
    currentLesson: course.chapters[0]?.lessons[0] || null,
  }),

  setCurrentChapter: (chapter) => set({
    currentChapter: chapter,
    currentLesson: chapter?.lessons[0] || null,
  }),

  setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

  updateWatchProgress: (lessonId, progress) => set((state) => {
    const newProgress = new Map(state.watchProgress);
    newProgress.set(lessonId, progress);
    return { watchProgress: newProgress };
  }),

  markLessonComplete: (lessonId) => set((state) => {
    if (!state.currentCourse) return state;

    const updatedChapters = state.currentCourse.chapters.map(chapter => ({
      ...chapter,
      lessons: chapter.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      ),
    }));

    // 计算新的进度
    const totalLessons = updatedChapters.reduce(
      (sum, chapter) => sum + chapter.lessons.length, 0
    );
    const completedLessons = updatedChapters.reduce(
      (sum, chapter) => sum + chapter.lessons.filter(l => l.completed).length, 0
    );
    const newProgress = totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    return {
      currentCourse: {
        ...state.currentCourse,
        chapters: updatedChapters,
        progress: newProgress,
        status: newProgress === 100 ? 'completed' : 'in_progress',
      },
    };
  }),

  reset: () => set({
    currentCourse: null,
    currentChapter: null,
    currentLesson: null,
    watchProgress: new Map(),
  }),
}));
