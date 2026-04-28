// ==========================================
// DATA LAYER - Type Definitions
// ==========================================

/** Raw question from quizData.json */
export interface RawQuestion {
  q: string;
  a: boolean;
  img?: string;
}

/** Question with unique ID added at runtime */
export interface QuizQuestion {
  id: string;
  q: string;
  a: boolean;
  img?: string;
}

/** QuizData structure from JSON file */
export type QuizData = Record<string, Record<string, RawQuestion[]>>;

/** Chapter info */
export interface ChapterInfo {
  id: string;
  slug: string;
  name: string;
  icon: string;
  questionCount: number;
}

/** User answer record */
export interface UserAnswer {
  questionId: string;
  answer: boolean;
  correct: boolean;
  timestamp: number;
}

/** Session state for resume */
export interface SessionState {
  mode: 'chapter' | 'multi' | 'topic' | 'errors';
  chapterSlugs: string[];
  topicKey: string | null; // "chapterSlug:topicSlug"
  questions: QuizQuestion[];
  currentIndex: number;
  answers: UserAnswer[];
  startedAt: number;
  savedAt: number;
  title: string;
}

/** Chapter progress tracking */
export interface ChapterProgress {
  totalAttempted: number;
  correctCount: number;
  wrongCount: number;
  errorIds: string[];
  lastAccessed: number;
}

/** App views */
export type AppView = 'login' | 'home' | 'select' | 'quiz' | 'admin';

/** Admin credentials from config */
export interface AdminConfig {
  username: string;
  password: string;
}
