// ============================================================
// LOGIC LAYER - Resume / Progress
// ============================================================

export interface SavedProgress {
  chapterIds: number[];
  questionIds: number[];
  currentIndex: number;
  correctCount: number;
  totalAnswered: number;
  timestamp: number;
}

const STORAGE_KEY = 'quiz_patente_v2_progress';

export function saveProgress(progress: SavedProgress): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* */ }
}

export function loadProgress(): SavedProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as SavedProgress;
    if (Date.now() - parsed.timestamp > 48 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch { return null; }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
