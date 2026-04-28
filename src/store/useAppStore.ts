// ============================================================
// STORE - Quiz App Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { QuizQuestion, Chapter } from '@/data/quizData';

export type AppScreen = 'loading' | 'login' | 'select' | 'quiz' | 'result';

interface AppState {
  screen: AppScreen;
  isLoading: boolean;

  // Auth
  isAdmin: boolean;
  adminUsername: string | null;
  authError: string | null;

  // Data
  chapters: Chapter[];
  allQuestions: QuizQuestion[];

  // Selection
  selectedChapterIds: number[];

  // Quiz
  quizQuestions: QuizQuestion[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  selectedAnswer: boolean | null;
  showFeedback: boolean;
  isComplete: boolean;

  // Resume
  showResumePopup: boolean;

  // Actions - Auth
  login: (username: string) => void;
  logout: () => void;
  setAuthError: (msg: string | null) => void;

  // Actions - Data
  setData: (chapters: Chapter[], questions: QuizQuestion[]) => void;

  // Actions - Navigation
  setScreen: (screen: AppScreen) => void;

  // Actions - Selection
  toggleChapter: (id: number) => void;
  selectAll: () => void;
  deselectAll: () => void;

  // Actions - Quiz
  startQuiz: (questions: QuizQuestion[], index?: number, correct?: number, wrong?: number) => void;
  answer: (val: boolean) => void;
  next: () => void;
  restart: () => void;

  // Actions - Resume
  setShowResumePopup: (v: boolean) => void;

  // Getters
  currentQuestion: () => QuizQuestion | null;
  score: () => { correct: number; wrong: number; total: number; pct: number };
}

export const useAppStore = create<AppState>((set, get) => ({
  screen: 'loading',
  isLoading: false,
  isAdmin: false,
  adminUsername: null,
  authError: null,
  chapters: [],
  allQuestions: [],
  selectedChapterIds: [],
  quizQuestions: [],
  currentIndex: 0,
  correctCount: 0,
  wrongCount: 0,
  selectedAnswer: null,
  showFeedback: false,
  isComplete: false,
  showResumePopup: false,

  login: (username) => set({ isAdmin: true, adminUsername: username, authError: null, screen: 'select' }),
  logout: () => set({ isAdmin: false, adminUsername: null, screen: 'login', selectedChapterIds: [], quizQuestions: [], currentIndex: 0, correctCount: 0, wrongCount: 0, selectedAnswer: null, showFeedback: false, isComplete: false }),
  setAuthError: (msg) => set({ authError: msg }),
  setData: (chapters, questions) => set({ chapters, allQuestions: questions, isLoading: false }),
  setScreen: (screen) => set({ screen }),

  toggleChapter: (id) => set((s) => {
    const has = s.selectedChapterIds.includes(id);
    return { selectedChapterIds: has ? s.selectedChapterIds.filter((x) => x !== id) : [...s.selectedChapterIds, id] };
  }),
  selectAll: () => set((s) => ({ selectedChapterIds: s.chapters.map((c) => c.id) })),
  deselectAll: () => set({ selectedChapterIds: [] }),

  startQuiz: (questions, index = 0, correct = 0, wrong = 0) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    set({
      quizQuestions: shuffled, currentIndex: index, correctCount: correct,
      wrongCount: wrong, selectedAnswer: null, showFeedback: false, isComplete: false, screen: 'quiz',
    });
  },

  answer: (val) => {
    const s = get();
    const q = s.quizQuestions[s.currentIndex];
    if (!q || s.showFeedback) return;
    const correct = val === q.answer;
    set({
      selectedAnswer: val, showFeedback: true,
      correctCount: correct ? s.correctCount + 1 : s.correctCount,
      wrongCount: correct ? s.wrongCount : s.wrongCount + 1,
    });
  },

  next: () => {
    const s = get();
    const next = s.currentIndex + 1;
    if (next >= s.quizQuestions.length) {
      set({ isComplete: true, showFeedback: false, screen: 'result' });
    } else {
      set({ currentIndex: next, selectedAnswer: null, showFeedback: false });
    }
  },

  restart: () => set({
    quizQuestions: [], currentIndex: 0, correctCount: 0, wrongCount: 0,
    selectedAnswer: null, showFeedback: false, isComplete: false, screen: 'select',
  }),

  setShowResumePopup: (v) => set({ showResumePopup: v }),

  currentQuestion: () => {
    const s = get();
    if (s.currentIndex < 0 || s.currentIndex >= s.quizQuestions.length) return null;
    return s.quizQuestions[s.currentIndex];
  },

  score: () => {
    const s = get();
    const total = s.correctCount + s.wrongCount;
    return { correct: s.correctCount, wrong: s.wrongCount, total, pct: total > 0 ? Math.round((s.correctCount / total) * 100) : 0 };
  },
}));
