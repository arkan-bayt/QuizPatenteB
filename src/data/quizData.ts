// ============================================================
// DATA LAYER - Quiz Data Loader (7139 questions)
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

let _data: QuizData | null = null;

export async function loadQuizData(): Promise<QuizData> {
  if (_data) return _data;
  const res = await fetch('/quizData.json');
  _data = await res.json();
  return _data!;
}

export function getQuestionsByChapters(qs: QuizQuestion[], ids: number[]): QuizQuestion[] {
  return qs.filter((q) => ids.includes(q.chapter));
}

export function getQuestionsBySubtopic(qs: QuizQuestion[], chapterId: number, subtopic: string): QuizQuestion[] {
  return qs.filter((q) => q.chapter === chapterId && q.subtopic === subtopic);
}

export function getUniqueTopics(chapters: Chapter[]): string[] {
  const topicMinId: Record<string, number> = {};
  for (const c of chapters) {
    if (!topicMinId[c.topic] || c.id < topicMinId[c.topic]) topicMinId[c.topic] = c.id;
  }
  return Array.from(new Set(chapters.map((c) => c.topic))).sort((a, b) => topicMinId[a] - topicMinId[b]);
}

export function getChaptersByTopic(chapters: Chapter[], topic: string): Chapter[] {
  return chapters.filter((c) => c.topic === topic).sort((a, b) => a.id - b.id);
}

export function getSubtopicsForChapter(qs: QuizQuestion[], chapterId: number): string[] {
  return Array.from(new Set(qs.filter((q) => q.chapter === chapterId).map((q) => q.subtopic))).sort();
}

export function getRandomQuestions(qs: QuizQuestion[], count: number): QuizQuestion[] {
  const shuffled = [...qs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
