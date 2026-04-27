export interface QuizQuestion {
  q: string;
  a: boolean;
  img?: string;
  id: string;
}

export interface ChapterInfo {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
}

export type QuizMode = 'chapter' | 'errors' | 'multi-chapter' | 'full-exam' | 'subtopics' | 'exam';

export interface UserAnswer {
  questionId: string;
  chapterSlug: string;
  userAnswer: boolean;
  correctAnswer: boolean;
  isCorrect: boolean;
  timestamp: number;
}

export interface ChapterProgress {
  chapterSlug: string;
  totalAttempted: number;
  correctCount: number;
  wrongCount: number;
  errorQuestionIds: string[];
  lastAccessed: number;
  lastQuestionId?: string;
}

export interface ExamResult {
  id: string;
  type: 'exam' | 'chapter' | 'errors' | 'full-exam' | 'multi-chapter';
  chapterSlug?: string;
  title: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  timeSpent: number;
  passed: boolean;
  date: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  totalStudyDays: number;
}

export type AppView = 'home' | 'login' | 'register' | 'quiz' | 'exam' | 'exam-result' | 'errors' | 'stats';

export type QuizData = Record<string, Record<string, Array<{ q: string; a: boolean; img?: string }>>>;
