// ============================================================
// LOGIC LAYER - Resume / Progress Engine
// ============================================================

// Resume Engine - no QuizQuestion import needed here

export interface SavedProgress {
  chapterIds: number[];
  questionIds: number[];
  currentIndex: number;
  correctCount: number;
  totalAnswered: number;
  timestamp: number;
}

const STORAGE_KEY = 'quiz_patente_progress';

// Save progress to localStorage
export function saveProgress(progress: SavedProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const data = JSON.stringify(progress);
    localStorage.setItem(STORAGE_KEY, data);
  } catch {
    // localStorage might be full or unavailable
  }
}

// Load progress from localStorage
export function loadProgress(): SavedProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data) as SavedProgress;
    // Check if progress is less than 24 hours old
    const now = Date.now();
    if (now - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

// Clear saved progress
export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Check if there is resumable progress
export function hasResumableProgress(): boolean {
  return loadProgress() !== null;
}
