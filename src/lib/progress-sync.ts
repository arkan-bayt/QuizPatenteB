/**
 * progress-sync.ts
 * Handles all Supabase progress synchronization.
 * localStorage is used ONLY as a cache/offline fallback.
 * Supabase is the Source of Truth.
 */

const CACHE_KEY = 'patente-b-progress-cache';
const PENDING_KEY = 'patente-b-pending-sync';

export interface ProgressData {
  chapterSlug: string;
  totalAttempted: number;
  correctCount: number;
  wrongCount: number;
  errorQuestionIds: string[];
  lastAccessed: number;
  lastQuestionId?: string;
}

export type ProgressMap = Record<string, ProgressData>;

/**
 * Load progress from Supabase server
 * Falls back to localStorage cache if offline
 */
export async function loadProgressFromServer(): Promise<ProgressMap | null> {
  try {
    const res = await fetch('/api/progress');
    if (!res.ok) return null;
    // Check content type to avoid parsing HTML redirects
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    const { progress } = await res.json();
    if (progress && Object.keys(progress).length > 0) {
      // Cache locally for offline access
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(progress));
      } catch { /* storage full */ }
      return progress;
    }
    return null;
  } catch {
    // Offline or network error - load from cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch { /* corrupted cache */ }
    return null;
  }
}

/**
 * Save progress to Supabase server
 * If offline, queues for later retry
 * Returns true if saved successfully
 */
export async function saveProgressToServer(progress: ProgressMap): Promise<boolean> {
  if (Object.keys(progress).length === 0) return true;

  try {
    const res = await fetch('/api/progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress }),
    });

    if (res.ok) {
      // Success - clear pending queue and update cache
      try {
        localStorage.removeItem(PENDING_KEY);
        localStorage.setItem(CACHE_KEY, JSON.stringify(progress));
      } catch { /* storage full */ }
      return true;
    }
    // Server error - queue for retry
    queuePendingSync(progress);
    return false;
  } catch {
    // Offline or network error - queue and cache
    queuePendingSync(progress);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(progress));
    } catch { /* storage full */ }
    return false;
  }
}

/**
 * Queue unsaved progress for later retry when back online
 */
function queuePendingSync(progress: ProgressMap): void {
  try {
    const pending = localStorage.getItem(PENDING_KEY);
    const existing: ProgressMap = pending ? JSON.parse(pending) : {};
    // Merge: for each chapter, keep the one with newer lastAccessed
    const merged = { ...existing };
    for (const [slug, p] of Object.entries(progress)) {
      const existingP = merged[slug];
      if (!existingP || p.lastAccessed > existingP.lastAccessed) {
        merged[slug] = p;
      }
    }
    localStorage.setItem(PENDING_KEY, JSON.stringify(merged));
  } catch { /* storage full or corrupted */ }
}

/**
 * Retry any pending syncs (call when coming back online)
 * Returns true if no pending syncs remain
 */
export async function retryPendingSync(): Promise<boolean> {
  try {
    const pending = localStorage.getItem(PENDING_KEY);
    if (!pending) return true;

    const progress: ProgressMap = JSON.parse(pending);
    if (Object.keys(progress).length === 0) {
      localStorage.removeItem(PENDING_KEY);
      return true;
    }

    const success = await saveProgressToServer(progress);
    return success;
  } catch {
    return false;
  }
}

/**
 * Clear local cache (e.g. on logout)
 */
export function clearProgressCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(PENDING_KEY);
  } catch { /* ignore */ }
}

/**
 * Debounced version of saveProgressToServer
 * Waits for the specified delay before sending
 */
export function createDebouncedSync(delayMs: number = 2000): {
  sync: (progress: ProgressMap) => void;
  flush: () => Promise<boolean>;
} {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let latestProgress: ProgressMap = {};

  return {
    sync(progress: ProgressMap) {
      latestProgress = progress;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        await saveProgressToServer(latestProgress);
      }, delayMs);
    },
    async flush(): Promise<boolean> {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      return await saveProgressToServer(latestProgress);
    },
  };
}

/**
 * Listen for online events and retry pending syncs
 */
export function setupOnlineListener(): () => void {
  const handler = () => {
    if (navigator.onLine) {
      retryPendingSync();
    }
  };
  window.addEventListener('online', handler);
  return () => window.removeEventListener('online', handler);
}
