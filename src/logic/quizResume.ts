// ============================================================
// QUIZ RESUME - Save/Load quiz progress (localStorage only)
// ============================================================

export interface QuizResumeData {
  chapterIds: number[];
  questionIds: number[];
  idx: number;
  correct: number;
  wrong: number;
  mode: string;
  chapterId?: number;
  subtopics?: string[];
  answers?: Record<number, boolean>;
}

export function saveQuizResume(username: string, data: QuizResumeData): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`qp_resume_${username}`, JSON.stringify({ ...data, ts: Date.now() })); } catch { /* */ }
}

export function loadQuizResume(username: string): QuizResumeData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`qp_resume_${username}`);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (Date.now() - d.ts > 48 * 60 * 60 * 1000) { localStorage.removeItem(`qp_resume_${username}`); return null; }
    return d;
  } catch { return null; }
}

export function clearQuizResume(username: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`qp_resume_${username}`);
}

export function hasQuizResumeForMode(username: string, mode: string, chapterId?: number): QuizResumeData | null {
  const resume = loadQuizResume(username);
  if (!resume) return null;
  if (resume.mode !== mode) return null;
  if ((mode === 'chapter' || mode === 'subtopic') && chapterId !== undefined) {
    if (resume.chapterId !== chapterId) return null;
  }
  return resume;
}
