// ============================================================
// DATA LAYER - Quiz Data Loader
// Reads from quizData.json (7139 questions from Ed0ardo/QuizPatenteB)
// ============================================================

export interface QuizQuestion {
  id: number;
  chapter: number;
  chapterName: string;
  chapterSlug: string;
  subtopic: string;
  topic: string;
  question: string;
  answer: boolean;
  image: string;
}

export interface Chapter {
  id: number;
  name: string;
  slug: string;
  topic: string;
  icon: string;
  questionCount: number;
  subtopicCount: number;
}

export interface QuizData {
  chapters: Chapter[];
  questions: QuizQuestion[];
  totalQuestions: number;
}

// This will be populated at module load time on client
let _data: QuizData | null = null;

export async function loadQuizData(): Promise<QuizData> {
  if (_data) return _data;
  const res = await fetch('/quizData.json');
  _data = await res.json();
  return _data!;
}

export function getQuestionsByChapters(questions: QuizQuestion[], chapterIds: number[]): QuizQuestion[] {
  return questions.filter((q) => chapterIds.includes(q.chapter));
}

export function getUniqueTopics(chapters: Chapter[]): string[] {
  const topics = new Set(chapters.map((ch) => ch.topic));
  return Array.from(topics).sort();
}

export function getChaptersByTopic(chapters: Chapter[], topic: string): Chapter[] {
  return chapters.filter((ch) => ch.topic === topic);
}
