// ==========================================
// STATE LAYER - Zustand Quiz Store
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppView, QuizQuestion, UserAnswer, ChapterProgress, SessionState } from './types';

interface QuizState {
  // Navigation
  view: AppView;

  // Auth
  isLoggedIn: boolean;

  // Quiz session
  questions: QuizQuestion[];
  currentIndex: number;
  answers: UserAnswer[];
  isAnswered: boolean;
  selectedAnswer: boolean | null;
  isSpeaking: boolean;

  // Chapter progress
  chapterProgress: Record<string, ChapterProgress>;

  // Actions
  setView: (view: AppView) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  startQuiz: (questions: QuizQuestion[], title: string) => void;
  answerQuestion: (answer: boolean) => void;
  nextQuestion: () => void;
  resetQuiz: () => void;

  setSpeaking: (val: boolean) => void;

  // Progress
  updateProgress: (chapterSlug: string, questionId: string, isCorrect: boolean) => void;

  // Session save/load
  saveSession: (session: SessionState) => void;
  loadSession: () => SessionState | null;
  clearSession: () => void;
}

const SESSION_KEY = 'quiz-patente-session-v1';

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      view: 'login',
      isLoggedIn: false,
      questions: [],
      currentIndex: 0,
      answers: [],
      isAnswered: false,
      selectedAnswer: null,
      isSpeaking: false,
      chapterProgress: {},

      setView: (view) => set({ view }),

      login: (username, password) => {
        // Simple fixed credentials
        if (username === 'arkan' && password === '12345') {
          set({ isLoggedIn: true, view: 'home' });
          localStorage.setItem('quiz-auth', 'true');
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isLoggedIn: false, view: 'login', questions: [], currentIndex: 0, answers: [], isAnswered: false, selectedAnswer: null });
        localStorage.removeItem('quiz-auth');
      },

      startQuiz: (questions, title) => {
        set({
          view: 'quiz',
          questions,
          currentIndex: 0,
          answers: [],
          isAnswered: false,
          selectedAnswer: null,
        });
      },

      answerQuestion: (answer) => {
        const { questions, currentIndex, answers, isAnswered } = get();
        if (isAnswered || !questions[currentIndex]) return;

        const question = questions[currentIndex];
        const isCorrect = answer === question.a;

        const newAnswer: UserAnswer = {
          questionId: question.id,
          answer,
          correct: isCorrect,
          timestamp: Date.now(),
        };

        set({
          isAnswered: true,
          selectedAnswer: answer,
          answers: [...answers, newAnswer],
        });

        // Extract chapter slug from question ID (format: "chapterSlug-123" or "chapterSlug-topic-123")
        const chapterSlug = extractChapterSlug(question.id);
        if (chapterSlug) {
          get().updateProgress(chapterSlug, question.id, isCorrect);
        }
      },

      nextQuestion: () => {
        const { questions, currentIndex, answers } = get();
        if (currentIndex + 1 >= questions.length) {
          // Loop in infinite mode
          const { shuffleArray } = require('./utils');
          const shuffled = shuffleArray(questions);
          set({ questions: shuffled, currentIndex: 0, answers: [], isAnswered: false, selectedAnswer: null });
        } else {
          set({ currentIndex: currentIndex + 1, isAnswered: false, selectedAnswer: null });
        }
      },

      resetQuiz: () => {
        set({
          view: 'home',
          questions: [],
          currentIndex: 0,
          answers: [],
          isAnswered: false,
          selectedAnswer: null,
        });
        get().clearSession();
      },

      setSpeaking: (val) => set({ isSpeaking: val }),

      updateProgress: (chapterSlug, questionId, isCorrect) => {
        const { chapterProgress } = get();
        const existing = chapterProgress[chapterSlug] || {
          totalAttempted: 0,
          correctCount: 0,
          wrongCount: 0,
          errorIds: [],
          lastAccessed: 0,
        };

        const newErrorIds = isCorrect
          ? existing.errorIds.filter(id => id !== questionId)
          : existing.errorIds.includes(questionId)
            ? existing.errorIds
            : [...existing.errorIds, questionId];

        set({
          chapterProgress: {
            ...chapterProgress,
            [chapterSlug]: {
              totalAttempted: existing.totalAttempted + 1,
              correctCount: existing.correctCount + (isCorrect ? 1 : 0),
              wrongCount: existing.wrongCount + (isCorrect ? 0 : 1),
              errorIds: newErrorIds,
              lastAccessed: Date.now(),
            },
          },
        });
      },

      saveSession: (session) => {
        try {
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch {
          // Storage full - ignore
        }
      },

      loadSession: () => {
        try {
          const raw = localStorage.getItem(SESSION_KEY);
          if (!raw) return null;
          const { sanitizeSession } = require('./utils');
          return sanitizeSession(JSON.parse(raw));
        } catch {
          return null;
        }
      },

      clearSession: () => {
        try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
      },
    }),
    {
      name: 'quiz-patente-store-v1',
      version: 1,
      migrate: (persisted: Record<string, unknown>, version: number) => {
        // Reset on any version change for clean start
        return {
          chapterProgress: typeof persisted.chapterProgress === 'object' && persisted.chapterProgress !== null ? persisted.chapterProgress : {},
        };
      },
      partialize: (state) => ({
        chapterProgress: state.chapterProgress,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

/** Extract chapter slug from question ID */
function extractChapterSlug(questionId: string): string | null {
  // Format: "chapterSlug-topicSlug-123" or "chapterSlug-123"
  const parts = questionId.split('-');
  if (parts.length < 2) return null;
  return parts[0]; // First part is always chapter slug
}
