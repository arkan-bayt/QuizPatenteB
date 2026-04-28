// ============================================================
// STORE - Quiz Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { QuizQuestion } from '@/data/quizData';

export type AppScreen = 'login' | 'select' | 'quiz' | 'result';

interface QuizStoreState {
  // Navigation
  screen: AppScreen;

  // Selection
  selectedChapterIds: number[];

  // Quiz state
  questions: QuizQuestion[];
  currentIndex: number;
  correctCount: number;
  totalAnswered: number;
  selectedAnswer: boolean | null;
  showFeedback: boolean;
  isComplete: boolean;
  showResumePopup: boolean;

  // Navigation setters
  setScreen: (screen: AppScreen) => void;

  // Selection setters
  toggleChapter: (chapterId: number) => void;
  selectAllChapters: (allIds: number[]) => void;
  deselectAllChapters: () => void;

  // Quiz actions
  startQuiz: (questions: QuizQuestion[]) => void;
  submitAnswer: (answer: boolean) => void;
  nextQuestion: () => void;
  restartQuiz: () => void;

  // Resume popup
  setShowResumePopup: (show: boolean) => void;

  // Getters (as functions to avoid serialization issues)
  getCurrentQuestion: () => QuizQuestion | null;
  getScore: () => { correct: number; total: number; percentage: number };
}

export const useQuizStore = create<QuizStoreState>((set, get) => ({
  // Navigation
  screen: 'login',

  // Selection
  selectedChapterIds: [],

  // Quiz state
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  totalAnswered: 0,
  selectedAnswer: null,
  showFeedback: false,
  isComplete: false,
  showResumePopup: false,

  // Navigation
  setScreen: (screen) => set({ screen }),

  // Selection
  toggleChapter: (chapterId) => set((state) => {
    const exists = state.selectedChapterIds.includes(chapterId);
    if (exists) {
      return { selectedChapterIds: state.selectedChapterIds.filter((id) => id !== chapterId) };
    }
    return { selectedChapterIds: [...state.selectedChapterIds, chapterId] };
  }),

  selectAllChapters: (allIds) => set({ selectedChapterIds: [...allIds] }),

  deselectAllChapters: () => set({ selectedChapterIds: [] }),

  // Quiz actions
  startQuiz: (questions) => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    set({
      questions: shuffled,
      currentIndex: 0,
      correctCount: 0,
      totalAnswered: 0,
      selectedAnswer: null,
      showFeedback: false,
      isComplete: false,
      screen: 'quiz',
    });
  },

  submitAnswer: (answer) => {
    const state = get();
    const currentQuestion = state.questions[state.currentIndex];
    if (!currentQuestion || state.showFeedback) return;

    const isCorrect = answer === currentQuestion.answer;
    set({
      selectedAnswer: answer,
      showFeedback: true,
      correctCount: isCorrect ? state.correctCount + 1 : state.correctCount,
      totalAnswered: state.totalAnswered + 1,
    });
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.questions.length) {
      set({ isComplete: true, showFeedback: false, screen: 'result' });
    } else {
      set({
        currentIndex: nextIndex,
        selectedAnswer: null,
        showFeedback: false,
      });
    }
  },

  restartQuiz: () => set({
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    totalAnswered: 0,
    selectedAnswer: null,
    showFeedback: false,
    isComplete: false,
    screen: 'select',
  }),

  // Resume popup
  setShowResumePopup: (show) => set({ showResumePopup: show }),

  // Getters
  getCurrentQuestion: () => {
    const state = get();
    if (state.currentIndex < 0 || state.currentIndex >= state.questions.length) {
      return null;
    }
    return state.questions[state.currentIndex];
  },

  getScore: () => {
    const state = get();
    const percentage = state.totalAnswered > 0
      ? Math.round((state.correctCount / state.totalAnswered) * 100)
      : 0;
    return { correct: state.correctCount, total: state.totalAnswered, percentage };
  },
}));
