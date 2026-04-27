'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  QuizQuestion,
  ChapterProgress,
  UserAnswer,
  QuizMode,
  AppView,
  ExamResult,
  User,
  GamificationState,
} from './types';
import { CHAPTERS } from './chapters';

const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Principiante', minXP: 0, icon: '🌱' },
  { level: 2, name: 'Apprendista', minXP: 50, icon: '📘' },
  { level: 3, name: 'Studente', minXP: 150, icon: '📝' },
  { level: 4, name: 'Intermedio', minXP: 350, icon: '📚' },
  { level: 5, name: 'Avanzato', minXP: 700, icon: '🎓' },
  { level: 6, name: 'Esperto', minXP: 1200, icon: '🏅' },
  { level: 7, name: 'Maestro', minXP: 2000, icon: '🏆' },
  { level: 8, name: 'Campione', minXP: 3500, icon: '👑' },
];

function getLevelForXP(xp: number) {
  let result = LEVEL_THRESHOLDS[0];
  for (const l of LEVEL_THRESHOLDS) {
    if (xp >= l.minXP) result = l;
  }
  return result;
}

function getStreak(lastDate: string): number {
  if (!lastDate) return 0;
  const last = new Date(lastDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  last.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 1;
  if (diffDays === 1) return 2;
  return 0;
}

interface QuizState {
  currentView: AppView;
  quizMode: QuizMode;
  currentChapterSlug: string | null;
  quizTitle: string;
  questions: QuizQuestion[];
  currentIndex: number;
  userAnswers: UserAnswer[];
  isAnswered: boolean;
  selectedAnswer: boolean | null;
  isSpeaking: boolean;
  isFinished: boolean;
  chapterProgress: Record<string, ChapterProgress>;

  // Auth
  user: User | null;

  // Gamification
  xp: number;
  level: number;
  levelName: string;
  levelIcon: string;
  streak: number;
  lastStudyDate: string;
  totalStudyDays: number;

  // Exam
  examTimeRemaining: number;
  examTimerActive: boolean;
  examResults: ExamResult[];
  lastExamResult: ExamResult | null;

  // Actions
  setView: (view: AppView) => void;
  startQuiz: (chapterSlug: string | null, mode: QuizMode, title?: string, questions?: QuizQuestion[]) => void;
  answerQuestion: (answer: boolean) => void;
  nextQuestion: () => void;
  stopQuiz: () => void;
  goToHome: () => void;
  resetQuiz: () => void;
  setSpeaking: (speaking: boolean) => void;
  clearErrorQuestions: (chapterSlug: string) => void;

  // Auth actions
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;

  // Exam actions
  startExam: (questions: QuizQuestion[]) => void;
  setExamTimeRemaining: (time: number) => void;
  setExamTimerActive: (active: boolean) => void;
  submitExam: () => void;

  // Stats
  getTotalCorrect: () => number;
  getTotalWrong: () => number;
  getTotalErrors: () => number;
  getAccuracy: () => number;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      currentView: 'home',
      quizMode: 'chapter',
      currentChapterSlug: null,
      quizTitle: '',
      questions: [],
      currentIndex: 0,
      userAnswers: [],
      isAnswered: false,
      selectedAnswer: null,
      isSpeaking: false,
      isFinished: false,
      chapterProgress: {},

      // Auth
      user: null,

      // Gamification
      xp: 0,
      level: 1,
      levelName: 'Principiante',
      levelIcon: '🌱',
      streak: 0,
      lastStudyDate: '',
      totalStudyDays: 0,

      // Exam
      examTimeRemaining: 20 * 60,
      examTimerActive: false,
      examResults: [],
      lastExamResult: null,

      setView: (view) => set({ currentView: view }),

      startQuiz: (chapterSlug, mode, title, questions) => {
        set({
          currentView: mode === 'exam' ? 'exam' : 'quiz',
          quizMode: mode,
          currentChapterSlug: chapterSlug,
          quizTitle: title || '',
          questions: questions || [],
          currentIndex: 0,
          userAnswers: [],
          isAnswered: false,
          selectedAnswer: null,
          isFinished: false,
          examTimeRemaining: mode === 'exam' ? 20 * 60 : 20 * 60,
          examTimerActive: mode === 'exam',
        });
      },

      answerQuestion: (answer) => {
        const state = get();
        const currentQuestion = state.questions[state.currentIndex];
        if (!currentQuestion || state.isAnswered) return;

        const isCorrect = answer === currentQuestion.a;

        const userAnswer: UserAnswer = {
          questionId: currentQuestion.id,
          chapterSlug: state.currentChapterSlug || '',
          userAnswer: answer,
          correctAnswer: currentQuestion.a,
          isCorrect,
          timestamp: Date.now(),
        };

        // Find the chapter slug from question ID
        const idParts = currentQuestion.id.split('-');
        let chapterSlug = state.currentChapterSlug || '';
        if (!chapterSlug && idParts.length >= 2) {
          for (let i = idParts.length - 1; i >= 2; i--) {
            const candidate = idParts.slice(0, i).join('-');
            if (CHAPTERS.some((ch) => ch.slug === candidate)) {
              chapterSlug = candidate;
              break;
            }
          }
        }

        // Update progress
        const newChapterProgress = { ...state.chapterProgress };
        if (chapterSlug) {
          const existingProgress = newChapterProgress[chapterSlug] || {
            chapterSlug,
            totalAttempted: 0,
            correctCount: 0,
            wrongCount: 0,
            errorQuestionIds: [],
            lastAccessed: Date.now(),
          };

          const newErrorIds = isCorrect
            ? existingProgress.errorQuestionIds.filter((id) => id !== currentQuestion.id)
            : existingProgress.errorQuestionIds.includes(currentQuestion.id)
              ? existingProgress.errorQuestionIds
              : [...existingProgress.errorQuestionIds, currentQuestion.id];

          newChapterProgress[chapterSlug] = {
            ...existingProgress,
            totalAttempted: existingProgress.totalAttempted + 1,
            correctCount: existingProgress.correctCount + (isCorrect ? 1 : 0),
            wrongCount: existingProgress.wrongCount + (isCorrect ? 0 : 1),
            errorQuestionIds: newErrorIds,
            lastAccessed: Date.now(),
          };
        }

        // Update XP
        const xpChange = isCorrect ? 10 : -5;
        const newXp = Math.max(0, state.xp + xpChange);
        const newLevelInfo = getLevelForXP(newXp);

        // Update streak
        const today = new Date().toISOString().split('T')[0];
        const newStreak = state.lastStudyDate === today
          ? state.streak
          : getStreak(state.lastStudyDate);
        const newTotalStudyDays = state.lastStudyDate === today
          ? state.totalStudyDays
          : state.totalStudyDays + 1;

        set({
          isAnswered: true,
          selectedAnswer: answer,
          userAnswers: [...state.userAnswers, userAnswer],
          chapterProgress: newChapterProgress,
          xp: newXp,
          level: newLevelInfo.level,
          levelName: newLevelInfo.name,
          levelIcon: newLevelInfo.icon,
          streak: newStreak,
          lastStudyDate: today,
          totalStudyDays: newTotalStudyDays,
        });
      },

      nextQuestion: () => {
        const state = get();
        const nextIndex = state.currentIndex + 1;

        if (state.quizMode === 'exam' && nextIndex >= state.questions.length) {
          // Exam finished - submit
          get().submitExam();
        } else if (nextIndex >= state.questions.length) {
          set({ isFinished: true });
        } else {
          set({ currentIndex: nextIndex, isAnswered: false, selectedAnswer: null });
        }
      },

      stopQuiz: () => {
        if (get().quizMode === 'exam') {
          get().submitExam();
        } else {
          set({ isFinished: true });
        }
      },

      goToHome: () => {
        set({
          currentView: 'home',
          questions: [],
          currentIndex: 0,
          userAnswers: [],
          isAnswered: false,
          selectedAnswer: null,
          isFinished: false,
          examTimerActive: false,
          lastExamResult: null,
        });
      },

      resetQuiz: () => {
        set({
          currentView: 'home',
          quizMode: 'chapter',
          currentChapterSlug: null,
          questions: [],
          currentIndex: 0,
          userAnswers: [],
          isAnswered: false,
          selectedAnswer: null,
          isSpeaking: false,
          isFinished: false,
          examTimerActive: false,
          lastExamResult: null,
        });
      },

      setSpeaking: (speaking) => set({ isSpeaking: speaking }),

      clearErrorQuestions: (chapterSlug) => {
        const state = get();
        const progress = state.chapterProgress[chapterSlug];
        if (progress) {
          set({
            chapterProgress: {
              ...state.chapterProgress,
              [chapterSlug]: {
                ...progress,
                errorQuestionIds: [],
              },
            },
          });
        }
      },

      // Auth
      login: (email, password) => {
        const usersRaw = localStorage.getItem('quiz-patente-users');
        const users: (User & { password: string })[] = usersRaw ? JSON.parse(usersRaw) : [];
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
          const { password: _p, ...user } = found;
          void _p;
          set({ user });
          localStorage.setItem('quiz-patente-current-user', JSON.stringify(user));
          return true;
        }
        return false;
      },

      register: (name, email, password) => {
        const usersRaw = localStorage.getItem('quiz-patente-users');
        const users: (User & { password: string })[] = usersRaw ? JSON.parse(usersRaw) : [];
        if (users.find(u => u.email === email)) return false;

        const newUser: User & { password: string } = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2),
          email,
          name,
          createdAt: Date.now(),
          password,
        };
        users.push(newUser);
        localStorage.setItem('quiz-patente-users', JSON.stringify(users));

        const { password: _p, ...user } = newUser;
        void _p;
        set({ user });
        localStorage.setItem('quiz-patente-current-user', JSON.stringify(user));
        return true;
      },

      logout: () => {
        set({ user: null, currentView: 'home' });
        localStorage.removeItem('quiz-patente-current-user');
      },

      // Exam
      startExam: (questions) => {
        set({
          currentView: 'exam',
          quizMode: 'exam',
          currentChapterSlug: null,
          quizTitle: 'Esame Simulato',
          questions,
          currentIndex: 0,
          userAnswers: [],
          isAnswered: false,
          selectedAnswer: null,
          isFinished: false,
          examTimeRemaining: 20 * 60,
          examTimerActive: true,
          lastExamResult: null,
        });
      },

      setExamTimeRemaining: (time) => set({ examTimeRemaining: time }),

      setExamTimerActive: (active) => set({ examTimerActive: active }),

      submitExam: () => {
        const state = get();
        const answers = state.userAnswers;
        const correctCount = answers.filter(a => a.isCorrect).length;
        const wrongCount = answers.filter(a => !a.isCorrect).length;
        const timeSpent = (20 * 60) - state.examTimeRemaining;
        const score = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
        const passed = score >= 80 && wrongCount <= 4;

        const result: ExamResult = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2),
          type: 'exam',
          title: 'Esame Simulato',
          totalQuestions: state.questions.length,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          score,
          timeSpent,
          passed,
          date: Date.now(),
        };

        const newResults = [result, ...state.examResults].slice(0, 50);

        set({
          examTimerActive: false,
          lastExamResult: result,
          examResults: newResults,
          currentView: 'exam-result',
          isFinished: true,
        });
      },

      // Stats helpers
      getTotalCorrect: () => {
        return Object.values(get().chapterProgress).reduce((sum, p) => sum + p.correctCount, 0);
      },
      getTotalWrong: () => {
        return Object.values(get().chapterProgress).reduce((sum, p) => sum + p.wrongCount, 0);
      },
      getTotalErrors: () => {
        return Object.values(get().chapterProgress).reduce((sum, p) => sum + p.errorQuestionIds.length, 0);
      },
      getAccuracy: () => {
        const state = get();
        const total = Object.values(state.chapterProgress).reduce((sum, p) => sum + p.totalAttempted, 0);
        const correct = Object.values(state.chapterProgress).reduce((sum, p) => sum + p.correctCount, 0);
        return total > 0 ? Math.round((correct / total) * 100) : 0;
      },
    }),
    {
      name: 'patente-b-quiz-storage-v2',
      partialize: (state) => ({
        chapterProgress: state.chapterProgress,
        xp: state.xp,
        level: state.level,
        levelName: state.levelName,
        levelIcon: state.levelIcon,
        streak: state.streak,
        lastStudyDate: state.lastStudyDate,
        totalStudyDays: state.totalStudyDays,
        examResults: state.examResults,
        user: state.user,
      }),
    }
  )
);

export { LEVEL_THRESHOLDS, getLevelForXP };
