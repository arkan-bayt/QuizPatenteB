export interface QuizQuestion {
  q: string;
  a: boolean;
  img?: string;
  id: string; // generated unique id
}

export interface ChapterInfo {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  questionCount: number;
}

export type QuizMode = 'chapter' | 'errors' | 'multi-chapter' | 'full-exam' | 'subtopics';

export interface SubtopicInfo {
  slug: string;
  name: string;
  questionCount: number;
}

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
}
