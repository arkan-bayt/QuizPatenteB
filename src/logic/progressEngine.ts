// ============================================================
// LOGIC - Progress Engine (localStorage + Cloud sync)
// Cloud (Supabase) is the Source of Truth
// localStorage is only a cache for offline access
// ============================================================
import { ChapterProgress, UserStats } from '@/data/supabaseClient';
import { authenticatedFetch } from '@/lib/api';

// ---- Local Storage Keys ----
function key(username: string): string { return `qp_progress_${username}`; }
function wrongKey(username: string): string { return `qp_wrong_${username}`; }
function statsKey(username: string): string { return `qp_stats_${username}`; }

// ---- Cloud Sync State ----
let _syncTimer: ReturnType<typeof setTimeout> | null = null;
const SYNC_DELAY = 2000; // Debounce 2s

async function cloudLoad(username: string): Promise<{
  stats: UserStats | null;
  chapterProgress: Record<number, ChapterProgress> | null;
  wrongAnswerIds: number[] | null;
  theme: string | null;
} | null> {
  try {
    const res = await authenticatedFetch(`/api/progress?username=${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      stats: (data.stats && Object.keys(data.stats).length > 0) ? data.stats as UserStats : null,
      chapterProgress: (data.chapterProgress && Object.keys(data.chapterProgress).length > 0) ? data.chapterProgress as Record<number, ChapterProgress> : null,
      wrongAnswerIds: data.wrongAnswerIds && data.wrongAnswerIds.length > 0 ? data.wrongAnswerIds : null,
      theme: data.theme || null,
    };
  } catch {
    return null;
  }
}

function scheduleCloudSync(username: string) {
  if (_syncTimer) clearTimeout(_syncTimer);
  _syncTimer = setTimeout(async () => {
    const stats = getUserStats(username);
    const cp = getChapterProgress(username);
    const wrong = getWrongAnswerIds(username);
    const theme = getThemePreference(username);
    try {
      await authenticatedFetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({
          username,
          stats,
          chapterProgress: cp,
          wrongAnswerIds: wrong,
          theme,
        }),
      });
    } catch { /* silent */ }
  }, SYNC_DELAY);
}

// Force immediate sync to cloud (call before leaving page)
export function forceSyncToCloud(username: string): Promise<boolean> {
  if (_syncTimer) clearTimeout(_syncTimer);
  const stats = getUserStats(username);
  const cp = getChapterProgress(username);
  const wrong = getWrongAnswerIds(username);
  const theme = getThemePreference(username);
  return authenticatedFetch('/api/progress', {
    method: 'POST',
    body: JSON.stringify({
      username,
      stats,
      chapterProgress: cp,
      wrongAnswerIds: wrong,
      theme,
    }),
  }).then(res => res.ok).catch(() => false);
}

// ---- Load cloud progress and REPLACE local data (call on login) ----
export async function loadCloudProgress(username: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const cloud = await cloudLoad(username);
    if (!cloud) return false;

    let loaded = false;

    // Cloud stats override local stats (cloud is source of truth)
    if (cloud.stats) {
      saveUserStats(username, cloud.stats);
      loaded = true;
    }

    // Cloud chapter progress overrides local
    if (cloud.chapterProgress) {
      try { localStorage.setItem(key(username), JSON.stringify(cloud.chapterProgress)); } catch { /* */ }
      loaded = true;
    }

    // Cloud wrong answers override local
    if (cloud.wrongAnswerIds) {
      try { localStorage.setItem(wrongKey(username), JSON.stringify(cloud.wrongAnswerIds)); } catch { /* */ }
      loaded = true;
    }

    // Cloud theme preference overrides local
    if (cloud.theme) {
      try { localStorage.setItem('qp_theme', cloud.theme); } catch { /* */ }
      loaded = true;
    }

    return loaded;
  } catch {
    return false;
  }
}

// ---- Chapter Progress ----
export function getChapterProgress(username: string): Record<number, ChapterProgress> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(key(username)) || '{}'); } catch { return {}; }
}

export function saveChapterProgress(username: string, chapterId: number, progress: ChapterProgress): void {
  if (typeof window === 'undefined') return;
  const all = getChapterProgress(username);
  all[chapterId] = progress;
  try { localStorage.setItem(key(username), JSON.stringify(all)); } catch { /* */ }
}

export function updateChapterProgress(username: string, chapterId: number, questionId: number, isCorrect: boolean): ChapterProgress {
  const all = getChapterProgress(username);
  let cp = all[chapterId] || { answeredIds: [], correctIds: [], wrongIds: [] };
  if (!cp.answeredIds.includes(questionId)) {
    cp.answeredIds.push(questionId);
    if (isCorrect) cp.correctIds.push(questionId); else cp.wrongIds.push(questionId);
  }
  saveChapterProgress(username, chapterId, cp);
  scheduleCloudSync(username);
  return cp;
}

// ---- Wrong Answers ----
export function getWrongAnswerIds(username: string): number[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(wrongKey(username)) || '[]'); } catch { return []; }
}

export function addWrongAnswer(username: string, questionId: number, _chapterId: number): void {
  const ids = getWrongAnswerIds(username);
  if (!ids.includes(questionId)) {
    ids.push(questionId);
    try { localStorage.setItem(wrongKey(username), JSON.stringify(ids)); } catch { /* */ }
    scheduleCloudSync(username);
  }
}

export function removeWrongAnswer(username: string, questionId: number): void {
  const ids = getWrongAnswerIds(username).filter((id) => id !== questionId);
  try { localStorage.setItem(wrongKey(username), JSON.stringify(ids)); } catch { /* */ }
  scheduleCloudSync(username);
}

// ---- Stats ----
const emptyStats: UserStats = { totalAnswered: 0, totalCorrect: 0, totalWrong: 0, streak: 0, bestStreak: 0, lastActive: '', examsPassed: 0, examsFailed: 0 };

export function getUserStats(username: string): UserStats {
  if (typeof window === 'undefined') return { ...emptyStats };
  try {
    const raw = localStorage.getItem(statsKey(username));
    if (!raw) return { ...emptyStats };
    return JSON.parse(raw);
  } catch { return { ...emptyStats }; }
}

export function saveUserStats(username: string, stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(statsKey(username), JSON.stringify(stats)); } catch { /* */ }
}

export function recordAnswer(username: string, isCorrect: boolean): void {
  const s = getUserStats(username);
  const today = new Date().toISOString().split('T')[0];
  s.totalAnswered++;
  if (isCorrect) {
    s.totalCorrect++;
    s.streak = (s.lastActive === today || s.lastActive === getYesterday()) ? s.streak + 1 : 1;
    if (s.streak > s.bestStreak) s.bestStreak = s.streak;
  } else {
    s.totalWrong++;
    s.streak = 0;
  }
  s.lastActive = today;
  saveUserStats(username, s);
  scheduleCloudSync(username);
}

export function recordExamResult(username: string, passed: boolean): void {
  const s = getUserStats(username);
  if (passed) s.examsPassed++; else s.examsFailed++;
  saveUserStats(username, s);
  scheduleCloudSync(username);
}

function getYesterday(): string {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// ---- Theme Preference (synced to cloud) ----
export function getThemePreference(username: string): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem('qp_theme'); } catch { return null; }
}

export function saveThemePreference(username: string, theme: 'dark' | 'light'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('qp_theme', theme);
  // Sync to cloud immediately (include in next progress sync)
  scheduleCloudSync(username);
}

// ---- Auto Sync (periodic) ----
let _autoSyncInterval: ReturnType<typeof setInterval> | null = null;
const AUTO_SYNC_INTERVAL = 30000; // 30 seconds
let _syncCallback: (() => void) | null = null;

export function startAutoSync(username: string, onSync?: () => void): void {
  stopAutoSync();
  _syncCallback = onSync || null;
  // Immediately do first sync
  doBidirectionalSync(username);
  _autoSyncInterval = setInterval(() => {
    doBidirectionalSync(username);
  }, AUTO_SYNC_INTERVAL);
}

async function doBidirectionalSync(username: string): Promise<void> {
  try {
    // Step 1: Upload local progress to cloud
    const stats = getUserStats(username);
    const cp = getChapterProgress(username);
    const wrong = getWrongAnswerIds(username);
    const theme = getThemePreference(username);
    await authenticatedFetch('/api/progress', {
      method: 'POST',
      body: JSON.stringify({
        username,
        stats,
        chapterProgress: cp,
        wrongAnswerIds: wrong,
        theme,
      }),
    });

    // Step 2: Download cloud progress (merge into localStorage)
    const cloud = await cloudLoad(username);
    if (cloud) {
      if (cloud.stats) saveUserStats(username, cloud.stats);
      if (cloud.chapterProgress) {
        try { localStorage.setItem(key(username), JSON.stringify(cloud.chapterProgress)); } catch { /* */ }
      }
      if (cloud.wrongAnswerIds) {
        try { localStorage.setItem(wrongKey(username), JSON.stringify(cloud.wrongAnswerIds)); } catch { /* */ }
      }
      if (cloud.theme) {
        try { localStorage.setItem('qp_theme', cloud.theme); } catch { /* */ }
      }
      // Notify UI to re-render with new data
      if (_syncCallback) _syncCallback();
    }
  } catch { /* silent */ }
}

export function stopAutoSync(): void {
  if (_autoSyncInterval) {
    clearInterval(_autoSyncInterval);
    _autoSyncInterval = null;
  }
  _syncCallback = null;
}

// Re-export quiz resume from separate module
export { saveQuizResume, loadQuizResume, clearQuizResume, hasQuizResume, loadQuizResumeLegacy, clearQuizResumeLegacy, RESUME_THRESHOLD, type QuizResumeData } from './quizResume';
