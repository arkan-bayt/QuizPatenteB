// ============================================================
// STORE - Unified App Store
// ============================================================
import { create } from 'zustand';
import { QuizQuestion, Chapter } from '@/data/quizData';
import { AppUser } from '@/data/supabaseClient';

export type Screen = 'loading' | 'login' | 'home' | 'chapter' | 'quiz' | 'exam' | 'result' | 'wrong' | 'stats' | 'admin' | 'resume' | 'aiAnalysis' | 'aiChat' | 'studyPlan' | 'teacherDashboard' | 'studentDashboard' | 'studentsList' | 'assignmentResults' | 'createAssignment';
export type QuizMode = 'chapter' | 'subtopic' | 'exam' | 'wrong';

interface State {
  screen: Screen;
  user: AppUser | null;
  users: AppUser[];
  chapters: Chapter[];
  allQuestions: QuizQuestion[];

  // Navigation params
  activeChapterId: number | null;
  activeSubtopic: string | null;
  selectedChapterIds: number[];

  // Quiz state
  quizMode: QuizMode;
  quizQuestions: QuizQuestion[];
  currentIdx: number;
  correctCount: number;
  wrongCount: number;
  selectedAnswer: boolean | null;
  showFeedback: boolean;
  isComplete: boolean;
  autoAdvance: boolean;
  showResumePopup: boolean;

  // Results
  examPassed: boolean;

  // Auth
  authError: string | null;
  adminMsg: string | null;

  // Assignment navigation
  activeAssignmentId: string | null;
  activeAssignmentConfig: { chapters: number[]; number_of_questions: number; time_limit_minutes: number | null; max_attempts: number } | null;

  // Actions
  setScreen: (s: Screen) => void;
  setUser: (u: AppUser | null) => void;
  setUsers: (u: AppUser[]) => void;
  setData: (ch: Chapter[], qs: QuizQuestion[]) => void;
  setAuthError: (e: string | null) => void;
  setAdminMsg: (m: string | null) => void;

  // Navigation
  openChapter: (id: number) => void;
  openTeacherDashboard: () => void;
  openStudentDashboard: () => void;
  openStudentsList: () => void;
  openAssignmentResults: (id: string) => void;
  startAssignmentQuiz: (assignmentId: string, config: { chapters: number[]; number_of_questions: number; time_limit_minutes: number | null; max_attempts: number }) => void;
  openSubtopic: (chapterId: number, subtopic: string) => void;
  goHome: () => void;
  setActiveChapterId: (id: number) => void;

  // Selection
  toggleChapterId: (id: number) => void;
  selectAllChapters: () => void;
  deselectAllChapters: () => void;

  // Quiz
  startQuiz: (qs: QuizQuestion[], mode: QuizMode, idx?: number, c?: number, w?: number) => void;
  submitAnswer: (val: boolean) => void;
  goNext: () => void;
  setAutoAdvance: (v: boolean) => void;
  setShowResumePopup: (v: boolean) => void;
  setExamPassed: (v: boolean) => void;

  // Getters
  getCurrentQ: () => QuizQuestion | null;
  getProgressPct: () => number;
}

export const useStore = create<State>((set, get) => ({
  screen: 'loading', user: null, users: [], chapters: [], allQuestions: [],
  activeChapterId: null, activeSubtopic: null, selectedChapterIds: [],
  quizMode: 'chapter', quizQuestions: [], currentIdx: 0,
  correctCount: 0, wrongCount: 0, selectedAnswer: null,
  showFeedback: false, isComplete: false, autoAdvance: true,
  showResumePopup: false, examPassed: false, authError: null, adminMsg: null, activeAssignmentId: null, activeAssignmentConfig: null,

  setScreen: (s) => set({ screen: s }),
  setUser: (u) => set({ user: u }),
  setUsers: (u) => set({ users: u }),
  setData: (ch, qs) => set({ chapters: ch, allQuestions: qs }),
  setAuthError: (e) => set({ authError: e }),
  setAdminMsg: (m) => set({ adminMsg: m }),

  openTeacherDashboard: () => set({ screen: 'teacherDashboard' }),
  openStudentDashboard: () => set({ screen: 'studentDashboard' }),
  openStudentsList: () => set({ screen: 'studentsList' }),
  openAssignmentResults: (id) => set({ activeAssignmentId: id, screen: 'assignmentResults' }),
  startAssignmentQuiz: (assignmentId, config) => set({ activeAssignmentId: assignmentId, activeAssignmentConfig: config }),

  openChapter: (id) => set({ activeChapterId: id, screen: 'chapter', activeSubtopic: null }),
  openSubtopic: (chapterId, subtopic) => set({ activeChapterId: chapterId, activeSubtopic: subtopic, screen: 'quiz' }),
  goHome: () => set({ screen: 'home', activeChapterId: null, activeSubtopic: null, selectedChapterIds: [] }),
  setActiveChapterId: (id) => set({ activeChapterId: id }),

  toggleChapterId: (id) => set((s) => ({
    selectedChapterIds: s.selectedChapterIds.includes(id)
      ? s.selectedChapterIds.filter((x) => x !== id)
      : [...s.selectedChapterIds, id],
  })),
  selectAllChapters: () => set((s) => ({ selectedChapterIds: s.chapters.map((c) => c.id) })),
  deselectAllChapters: () => set({ selectedChapterIds: [] }),

  startQuiz: (qs, mode, idx = 0, c = 0, w = 0) => {
    const shuffled = mode === 'exam' || mode === 'wrong' ? [...qs].sort(() => Math.random() - 0.5) : [...qs].sort(() => Math.random() - 0.5);
    set({
      quizQuestions: shuffled, quizMode: mode, currentIdx: idx,
      correctCount: c, wrongCount: w, selectedAnswer: null,
      showFeedback: false, isComplete: false, screen: mode === 'exam' ? 'exam' : 'quiz',
    });
  },

  submitAnswer: (val) => {
    const s = get();
    const q = s.quizQuestions[s.currentIdx];
    if (!q || s.showFeedback) return;
    const ok = val === q.answer;
    set({ selectedAnswer: val, showFeedback: true, correctCount: ok ? s.correctCount + 1 : s.correctCount, wrongCount: ok ? s.wrongCount : s.wrongCount + 1 });
  },

  goNext: () => {
    const s = get();
    const next = s.currentIdx + 1;
    if (next >= s.quizQuestions.length) {
      set({ isComplete: true, showFeedback: false, screen: 'result' });
    } else {
      set({ currentIdx: next, selectedAnswer: null, showFeedback: false });
    }
  },

  setAutoAdvance: (v) => set({ autoAdvance: v }),
  setShowResumePopup: (v) => set({ showResumePopup: v }),
  setExamPassed: (v) => set({ examPassed: v }),

  getCurrentQ: () => {
    const s = get();
    if (s.currentIdx < 0 || s.currentIdx >= s.quizQuestions.length) return null;
    return s.quizQuestions[s.currentIdx];
  },

  getProgressPct: () => {
    const s = get();
    const answered = s.correctCount + s.wrongCount;
    return s.quizQuestions.length > 0 ? Math.round((answered / s.quizQuestions.length) * 100) : 0;
  },
}));
