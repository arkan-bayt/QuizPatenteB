// ============================================================
// QUIZ RESUME - Save/Load quiz progress (localStorage only)
// Supports: chapter, subtopic, exam modes
// Key format: qp_resume_{username}_{mode}_{chapterId|'exam'_{subtopicKey}}
// ============================================================

export interface QuizResumeData {
  chapterIds: number[];
  questionIds: number[];
  idx: number;
  correct: number;
  wrong: number;
  mode: string;
  chapterId?: number;
  subtopic?: string;
  subtopics?: string[];
  answers?: Record<number, boolean>;
  ts: number;
}

/** Minimum number of questions to enable resume */
export const RESUME_THRESHOLD = 30;

/** Max age for saved progress: 7 days */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Build a unique localStorage key for a given quiz context */
function resumeKey(username: string, mode: string, chapterId?: number, subtopic?: string): string {
  const modePart = mode; // 'chapter' | 'subtopic' | 'exam' | 'wrong'
  const chapterPart = chapterId !== undefined ? `_ch${chapterId}` : '';
  const subtopicPart = subtopic ? `_st_${subtopic.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}` : '';
  return `qp_resume_${username}_${modePart}${chapterPart}${subtopicPart}`;
}

/** Save quiz progress to localStorage */
export function saveQuizResume(username: string, data: QuizResumeData): void {
  if (typeof window === 'undefined') return;
  try {
    const k = resumeKey(username, data.mode, data.chapterId, data.subtopic);
    localStorage.setItem(k, JSON.stringify({ ...data, ts: Date.now() }));
  } catch { /* */ }
}

/** Load quiz progress from localStorage */
export function loadQuizResume(username: string, mode: string, chapterId?: number, subtopic?: string): QuizResumeData | null {
  if (typeof window === 'undefined') return null;
  try {
    const k = resumeKey(username, mode, chapterId, subtopic);
    const raw = localStorage.getItem(k);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (Date.now() - (d.ts || 0) > MAX_AGE_MS) {
      localStorage.removeItem(k);
      return null;
    }
    return d;
  } catch { return null; }
}

/** Clear quiz progress for a specific quiz context */
export function clearQuizResume(username: string, mode: string, chapterId?: number, subtopic?: string): void {
  if (typeof window === 'undefined') return;
  try {
    const k = resumeKey(username, mode, chapterId, subtopic);
    localStorage.removeItem(k);
  } catch { /* */ }
}

/**
 * Check if there is a valid saved resume for a given mode/chapter/subtopic.
 * Returns the resume data if found and valid, or null.
 * Only returns data if the quiz had enough questions (>= RESUME_THRESHOLD) and user has answered at least 1.
 */
export function hasQuizResume(
  username: string,
  mode: string,
  totalQuestions: number,
  chapterId?: number,
  subtopic?: string
): QuizResumeData | null {
  if (totalQuestions < RESUME_THRESHOLD) return null;
  const resume = loadQuizResume(username, mode, chapterId, subtopic);
  if (!resume) return null;
  if (resume.mode !== mode) return null;
  if (resume.idx <= 0 && resume.correct === 0 && resume.wrong === 0) return null;
  if ((mode === 'chapter' || mode === 'subtopic') && chapterId !== undefined) {
    if (resume.chapterId !== chapterId) return null;
  }
  if (mode === 'subtopic' && subtopic !== undefined) {
    if (resume.subtopic !== subtopic) return null;
  }
  return resume;
}

/** Clear ALL resume data for a user (cleanup) */
export function clearAllQuizResumes(username: string): void {
  if (typeof window === 'undefined') return;
  try {
    const prefix = `qp_resume_${username}_`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keysToRemove.push(k);
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch { /* */ }
}

// ---- Legacy support (old single-key format) ----
export function loadQuizResumeLegacy(username: string): QuizResumeData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`qp_resume_${username}`);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (Date.now() - (d.ts || 0) > MAX_AGE_MS) {
      localStorage.removeItem(`qp_resume_${username}`);
      return null;
    }
    return d;
  } catch { return null; }
}

export function clearQuizResumeLegacy(username: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`qp_resume_${username}`);
}
