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

/**
 * Represents a saved quiz session that can be resumed later.
 * Stored in localStorage so the user can continue from where they left off.
 */
export interface SavedQuizSession {
  /** Unique session identifier based on quiz configuration */
  sessionKey: string;
  /** The quiz mode used */
  quizMode: QuizMode;
  /** Chapter slug (for single chapter/errors/subtopics modes) */
  chapterSlug: string | null;
  /** Selected chapter slugs (for multi-chapter mode) */
  chapterSlugs: string[] | null;
  /** Selected subtopics (for subtopics mode) */
  subtopics: string[] | null;
  /** Display title for the quiz */
  quizTitle: string;
  /** All questions in the session */
  questions: QuizQuestion[];
  /** Current question index */
  currentIndex: number;
  /** Answers given so far */
  userAnswers: UserAnswer[];
  /** Timestamp when session was last saved */
  savedAt: number;
  /** Timestamp when session was first created */
  createdAt: number;
}
