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
  SavedQuizSession,
} from './types';
import { CHAPTERS } from './chapters';
import { loadProgressFromServer, saveProgressToServer, retryPendingSync, setupOnlineListener, createDebouncedSync, ProgressMap } from './progress-sync';
import { generateSessionKey, saveQuizSession, deleteSessionByParams } from './session-manager';

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

  // Sync
  isSyncing: boolean;
  loadProgress: () => Promise<void>;
  syncProgress: () => void;
  flushSync: () => Promise<boolean>;

  // Session state for resume functionality
  currentSessionKey: string | null;
  currentSessionMeta: {
    chapterSlugs?: string[];
    subtopics?: string[];
  } | null;

  // Actions
  setView: (view: AppView) => void;
  startQuiz: (chapterSlug: string | null, mode: QuizMode, title?: string, questions?: QuizQuestion[], meta?: { chapterSlugs?: string[]; subtopics?: string[] }) => void;
  resumeQuiz: (session: SavedQuizSession) => void;
  answerQuestion: (answer: boolean) => void;
  nextQuestion: () => void;
  stopQuiz: () => void;
  goToHome: () => void;
  resetQuiz: () => void;
  setSpeaking: (speaking: boolean) => void;
  clearErrorQuestions: (chapterSlug: string) => void;
  saveCurrentSession: () => void;

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

      // Sync
      isSyncing: false,

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

      // Load progress from Supabase on login
      loadProgress: async () => {
        try {
          set({ isSyncing: true });
          const serverProgress = await loadProgressFromServer();
          if (serverProgress && Object.keys(serverProgress).length > 0) {
            // Validate and sanitize server data before merging
            const sanitizedServer: Record<string, ChapterProgress> = {};
            for (const [key, val] of Object.entries(serverProgress)) {
              if (!val || typeof val !== 'object') continue;
              sanitizedServer[key] = {
                chapterSlug: typeof val.chapterSlug === 'string' ? val.chapterSlug : key,
                totalAttempted: typeof val.totalAttempted === 'number' && isFinite(val.totalAttempted) ? Math.max(0, val.totalAttempted) : 0,
                correctCount: typeof val.correctCount === 'number' && isFinite(val.correctCount) ? Math.max(0, val.correctCount) : 0,
                wrongCount: typeof val.wrongCount === 'number' && isFinite(val.wrongCount) ? Math.max(0, val.wrongCount) : 0,
                errorQuestionIds: Array.isArray(val.errorQuestionIds) ? val.errorQuestionIds.filter((id: any) => typeof id === 'string') : [],
                lastAccessed: typeof val.lastAccessed === 'number' && isFinite(val.lastAccessed) ? val.lastAccessed : 0,
                lastQuestionId: typeof val.lastQuestionId === 'string' ? val.lastQuestionId : undefined,
              };
            }
            // Merge: server data as base, local overrides if newer
            const local = get().chapterProgress;
            const merged = { ...sanitizedServer };
            for (const [key, val] of Object.entries(local)) {
              const serverVal = sanitizedServer[key];
              if (!serverVal || val.lastAccessed > (serverVal.lastAccessed || 0)) {
                merged[key] = val;
              }
            }
            set({ chapterProgress: merged });
          }
          // Also retry any pending offline syncs
          await retryPendingSync();
        } catch {
          // Silent fail - local data still works
        } finally {
          set({ isSyncing: false });
        }
      },

      // Debounced sync to Supabase
      syncProgress: () => {
        const { sync } = getDebouncedSync();
        sync(get().chapterProgress);
      },

      // Force immediate sync (e.g. before leaving page)
      flushSync: async () => {
        set({ isSyncing: true });
        try {
          const ok = await getDebouncedSync().flush();
          return ok;
        } finally {
          set({ isSyncing: false });
        }
      },

      setView: (view) => set({ currentView: view }),

      // Session state
      currentSessionKey: null,
      currentSessionMeta: null,

      startQuiz: (chapterSlug, mode, title, questions, meta) => {
        const sessionKey = generateSessionKey({
          quizMode: mode,
          chapterSlug,
          chapterSlugs: meta?.chapterSlugs,
          subtopics: meta?.subtopics,
        });
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
          currentSessionKey: sessionKey,
          currentSessionMeta: meta || null,
        });
      },

      resumeQuiz: (session) => {
        set({
          currentView: 'quiz',
          quizMode: session.quizMode,
          currentChapterSlug: session.chapterSlug,
          quizTitle: session.quizTitle,
          questions: session.questions,
          currentIndex: session.currentIndex,
          userAnswers: session.userAnswers,
          isAnswered: false,
          selectedAnswer: null,
          isFinished: false,
          currentSessionKey: session.sessionKey,
          currentSessionMeta: {
            chapterSlugs: session.chapterSlugs || undefined,
            subtopics: session.subtopics || undefined,
          },
        });
      },

      saveCurrentSession: () => {
        const state = get();
        if (!state.currentSessionKey || state.questions.length === 0) return;
        if (state.quizMode === 'exam') return; // Don't save exam sessions

        const session: SavedQuizSession = {
          sessionKey: state.currentSessionKey,
          quizMode: state.quizMode,
          chapterSlug: state.currentChapterSlug,
          chapterSlugs: state.currentSessionMeta?.chapterSlugs || null,
          subtopics: state.currentSessionMeta?.subtopics || null,
          quizTitle: state.quizTitle,
          questions: state.questions,
          currentIndex: state.currentIndex,
          userAnswers: state.userAnswers,
          savedAt: Date.now(),
          createdAt: Date.now(),
        };
        saveQuizSession(session);
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
            lastQuestionId: currentQuestion.id,
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

        // Sync to Supabase in background
        get().syncProgress();
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
        const state = get();
        if (state.quizMode === 'exam') {
          get().submitExam();
        } else {
          // Save session before finishing
          get().saveCurrentSession();
          set({ isFinished: true });
        }
      },

      goToHome: () => {
        // Save session before leaving (if there's an active quiz with answers)
        const state = get();
        if (state.questions.length > 0 && state.userAnswers.length > 0 && state.quizMode !== 'exam') {
          get().saveCurrentSession();
        }
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
          currentSessionKey: null,
          currentSessionMeta: null,
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
      name: 'patente-b-quiz-storage-v3',
      version: 3,
      migrate: (persisted: any, version: number) => {
        // Always sanitize all persisted fields regardless of version
        const sanitizeUser = (u: any) => {
          if (!u || typeof u !== 'object') return null;
          return {
            id: typeof u.id === 'string' ? u.id : '',
            email: typeof u.email === 'string' ? u.email : '',
            name: typeof u.name === 'string' ? u.name : 'Utente',
            createdAt: typeof u.createdAt === 'number' ? u.createdAt : Date.now(),
          };
        };
        const sanitizeChapterProgress = (cp: any) => {
          if (!cp || typeof cp !== 'object') return {};
          const result: Record<string, ChapterProgress> = {};
          for (const [key, val] of Object.entries(cp)) {
            if (!val || typeof val !== 'object') continue;
            result[key] = {
              chapterSlug: typeof val.chapterSlug === 'string' ? val.chapterSlug : key,
              totalAttempted: typeof val.totalAttempted === 'number' && isFinite(val.totalAttempted) ? Math.max(0, val.totalAttempted) : 0,
              correctCount: typeof val.correctCount === 'number' && isFinite(val.correctCount) ? Math.max(0, val.correctCount) : 0,
              wrongCount: typeof val.wrongCount === 'number' && isFinite(val.wrongCount) ? Math.max(0, val.wrongCount) : 0,
              errorQuestionIds: Array.isArray(val.errorQuestionIds) ? val.errorQuestionIds.filter((id: any) => typeof id === 'string') : [],
              lastAccessed: typeof val.lastAccessed === 'number' && isFinite(val.lastAccessed) ? val.lastAccessed : 0,
              lastQuestionId: typeof val.lastQuestionId === 'string' ? val.lastQuestionId : undefined,
            };
          }
          return result;
        };
        const sanitizeExamResults = (results: any) => {
          if (!Array.isArray(results)) return [];
          return results.filter((r: any) => r && typeof r === 'object' && typeof r.score === 'number').map((r: any) => ({
            id: typeof r.id === 'string' ? r.id : Date.now().toString(36),
            type: typeof r.type === 'string' ? r.type : 'exam',
            title: typeof r.title === 'string' ? r.title : 'Esame',
            totalQuestions: typeof r.totalQuestions === 'number' ? r.totalQuestions : 30,
            correctAnswers: typeof r.correctAnswers === 'number' ? r.correctAnswers : 0,
            wrongAnswers: typeof r.wrongAnswers === 'number' ? r.wrongAnswers : 0,
            score: typeof r.score === 'number' ? r.score : 0,
            timeSpent: typeof r.timeSpent === 'number' ? r.timeSpent : 0,
            passed: typeof r.passed === 'boolean' ? r.passed : false,
            date: typeof r.date === 'number' ? r.date : Date.now(),
          })).slice(0, 50);
        };

        // IMPORTANT: Only return known properties - do NOT spread ...persisted
        // to avoid injecting corrupted/extra fields from older app versions
        const cleaned = {
          chapterProgress: sanitizeChapterProgress(persisted.chapterProgress),
          xp: (typeof persisted.xp === 'number' && isFinite(persisted.xp)) ? Math.max(0, persisted.xp) : 0,
          level: (typeof persisted.level === 'number' && persisted.level >= 1 && persisted.level <= 8) ? persisted.level : 1,
          levelName: (typeof persisted.levelName === 'string') ? persisted.levelName : 'Principiante',
          levelIcon: (typeof persisted.levelIcon === 'string') ? persisted.levelIcon : '\u{1F331}',
          streak: (typeof persisted.streak === 'number' && persisted.streak >= 0) ? persisted.streak : 0,
          lastStudyDate: (typeof persisted.lastStudyDate === 'string') ? persisted.lastStudyDate : '',
          totalStudyDays: (typeof persisted.totalStudyDays === 'number' && persisted.totalStudyDays >= 0) ? persisted.totalStudyDays : 0,
          examResults: sanitizeExamResults(persisted.examResults),
          user: sanitizeUser(persisted.user),
        };
        return cleaned;
      },
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
      onRehydrateStorage: () => {
        // Clean up old storage keys from previous versions
        if (typeof window !== 'undefined') {
          try { localStorage.removeItem('patente-b-quiz-storage-v2'); } catch { /* ignore */ }
          try { localStorage.removeItem('patente-b-quiz-storage-v1'); } catch { /* ignore */ }
        }
        return (state, error) => {
          if (error) {
            console.error('Failed to rehydrate store, clearing corrupted data:', error);
            try { localStorage.removeItem('patente-b-quiz-storage-v3'); } catch { /* ignore */ }
            try { localStorage.removeItem('patente-b-quiz-storage-v2'); } catch { /* ignore */ }
          }
          if (state) {
            const s = useQuizStore.getState();
            let needsReset = false;

            if (typeof s.levelIcon !== 'string') needsReset = true;
            if (typeof s.levelName !== 'string') needsReset = true;
            if (typeof s.xp !== 'number' || !isFinite(s.xp)) needsReset = true;
            if (typeof s.level !== 'number') needsReset = true;
            if (typeof s.streak !== 'number') needsReset = true;
            if (typeof s.totalStudyDays !== 'number') needsReset = true;
            if (typeof s.lastStudyDate !== 'string') needsReset = true;

            if (s.user && (typeof s.user.name !== 'string' || typeof s.user.email !== 'string')) {
              needsReset = true;
            }

            if (s.chapterProgress && typeof s.chapterProgress === 'object') {
              for (const [key, val] of Object.entries(s.chapterProgress)) {
                if (!val || typeof val !== 'object') {
                  needsReset = true;
                  break;
                }
                if (typeof val.totalAttempted !== 'number' ||
                    typeof val.correctCount !== 'number' ||
                    typeof val.wrongCount !== 'number' ||
                    !Array.isArray(val.errorQuestionIds)) {
                  needsReset = true;
                  break;
                }
              }
            }

            if (needsReset) {
              console.warn('Invalid rehydrated state detected, resetting to defaults');
              useQuizStore.setState({
                xp: 0, level: 1, levelName: 'Principiante', levelIcon: '\u{1F331}',
                streak: 0, lastStudyDate: '', totalStudyDays: 0,
                chapterProgress: {},
                examResults: [],
                user: null,
              });
            }
          }
        };
      },
    }
  )
);

// Singleton debounced sync
let _debouncedSync: ReturnType<typeof createDebouncedSync> | null = null;
function getDebouncedSync() {
  if (!_debouncedSync) {
    _debouncedSync = createDebouncedSync(2000);
    // Setup online listener for retry
    if (typeof window !== 'undefined') {
      setupOnlineListener();
    }
  }
  return _debouncedSync;
}

// Sync on page close/visibility change
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      useQuizStore.getState().flushSync();
      // Also save current quiz session
      const state = useQuizStore.getState();
      if (state.questions.length > 0 && state.userAnswers.length > 0 && state.quizMode !== 'exam') {
        state.saveCurrentSession();
      }
    }
  });
  window.addEventListener('beforeunload', () => {
    useQuizStore.getState().flushSync();
    // Also save current quiz session
    const state = useQuizStore.getState();
    if (state.questions.length > 0 && state.userAnswers.length > 0 && state.quizMode !== 'exam') {
      state.saveCurrentSession();
    }
  });
}

export { LEVEL_THRESHOLDS, getLevelForXP };
