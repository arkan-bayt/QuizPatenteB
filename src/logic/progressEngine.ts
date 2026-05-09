// ============================================================
// LOGIC - Progress Engine (localStorage + Cloud sync)
// Cloud (Supabase) is the Source of Truth
// localStorage is only a cache for offline access
// SYNC STRATEGY: Download first → Merge → Upload merged
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
let _syncVersion = 0; // Incremented after each successful sync

// Get current sync version (for UI to detect changes)
export function getSyncVersion(): number { return _syncVersion; }

async function cloudLoad(username: string): Promise<{
  stats: UserStats | null;
  chapterProgress: Record<number, ChapterProgress> | null;
  wrongAnswerIds: number[] | null;
  theme: string | null;
} | null> {
  try {
    const res = await authenticatedFetch(`/api/progress?username=${encodeURIComponent(username)}`);
    if (!res.ok) {
      console.warn('[Sync] cloudLoad failed:', res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    if (data.error) {
      console.warn('[Sync] cloudLoad error:', data.error);
      return null;
    }
    return {
      stats: (data.stats && Object.keys(data.stats).length > 0) ? data.stats as UserStats : null,
      chapterProgress: (data.chapterProgress && Object.keys(data.chapterProgress).length > 0) ? data.chapterProgress as Record<number, ChapterProgress> : null,
      wrongAnswerIds: data.wrongAnswerIds && data.wrongAnswerIds.length > 0 ? data.wrongAnswerIds : null,
      theme: data.theme || null,
    };
  } catch (err) {
    console.warn('[Sync] cloudLoad exception:', err);
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
      const res = await authenticatedFetch('/api/progress', {
        method: 'POST',
        body: JSON.stringify({
          username,
          stats,
          chapterProgress: cp,
          wrongAnswerIds: wrong,
          theme,
        }),
      });
      if (!res.ok) {
        console.warn('[Sync] scheduleCloudSync upload failed:', res.status);
      }
    } catch (err) {
      console.warn('[Sync] scheduleCloudSync exception:', err);
    }
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
  }).then(res => {
    if (!res.ok) console.warn('[Sync] forceSyncToCloud failed:', res.status);
    return res.ok;
  }).catch((err) => {
    console.warn('[Sync] forceSyncToCloud exception:', err);
    return false;
  });
}

// ---- MERGE LOGIC ----
// Merge two sets of chapter progress: take the union of answered/correct/wrong IDs
function mergeChapterProgress(
  local: Record<number, ChapterProgress>,
  cloud: Record<number, ChapterProgress>
): Record<number, ChapterProgress> {
  const merged: Record<number, ChapterProgress> = {};

  // Start with all local data
  for (const [chId, cp] of Object.entries(local)) {
    merged[Number(chId)] = { ...cp, answeredIds: [...cp.answeredIds], correctIds: [...cp.correctIds], wrongIds: [...cp.wrongIds] };
  }

  // Merge cloud data in
  for (const [chId, cp] of Object.entries(cloud)) {
    const chNum = Number(chId);
    if (!merged[chNum]) {
      merged[chNum] = { ...cp, answeredIds: [...cp.answeredIds], correctIds: [...cp.correctIds], wrongIds: [...cp.wrongIds] };
    } else {
      const existing = merged[chNum];
      // Merge answeredIds (union)
      for (const id of cp.answeredIds) {
        if (!existing.answeredIds.includes(id)) existing.answeredIds.push(id);
      }
      // Merge correctIds (union)
      for (const id of cp.correctIds) {
        if (!existing.correctIds.includes(id)) existing.correctIds.push(id);
      }
      // Merge wrongIds (union)
      for (const id of cp.wrongIds) {
        if (!existing.wrongIds.includes(id)) existing.wrongIds.push(id);
      }
    }
  }

  return merged;
}

// Merge stats: take the higher values
function mergeStats(local: UserStats, cloud: UserStats): UserStats {
  return {
    totalAnswered: Math.max(local.totalAnswered, cloud.totalAnswered),
    totalCorrect: Math.max(local.totalCorrect, cloud.totalCorrect),
    totalWrong: Math.max(local.totalWrong, cloud.totalWrong),
    streak: Math.max(local.streak, cloud.streak),
    bestStreak: Math.max(local.bestStreak, cloud.bestStreak),
    lastActive: local.lastActive > cloud.lastActive ? local.lastActive : cloud.lastActive,
    examsPassed: Math.max(local.examsPassed, cloud.examsPassed),
    examsFailed: Math.max(local.examsFailed, cloud.examsFailed),
  };
}

// Merge wrong answer IDs (union)
function mergeWrongAnswers(local: number[], cloud: number[]): number[] {
  const merged = [...local];
  for (const id of cloud) {
    if (!merged.includes(id)) merged.push(id);
  }
  return merged;
}

// ---- Load cloud progress and REPLACE local data (call on login) ----
export async function loadCloudProgress(username: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const cloud = await cloudLoad(username);
    if (!cloud) {
      console.warn('[Sync] loadCloudProgress: no cloud data found');
      return false;
    }

    let loaded = false;

    // Cloud stats override local stats (cloud is source of truth on login)
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

    _syncVersion++;
    return loaded;
  } catch (err) {
    console.warn('[Sync] loadCloudProgress exception:', err);
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

// FIXED SYNC STRATEGY: Download first → Merge → Save locally → Upload merged
async function doBidirectionalSync(username: string): Promise<void> {
  try {
    // Step 1: Download cloud progress FIRST
    const cloud = await cloudLoad(username);

    // Step 2: Read local progress
    const localStats = getUserStats(username);
    const localCp = getChapterProgress(username);
    const localWrong = getWrongAnswerIds(username);
    const localTheme = getThemePreference(username);

    // Step 3: Merge cloud + local (if cloud data exists)
    if (cloud) {
      // Merge stats (take higher values)
      if (cloud.stats) {
        const mergedStats = mergeStats(localStats, cloud.stats);
        saveUserStats(username, mergedStats);
      }

      // Merge chapter progress (union of IDs)
      if (cloud.chapterProgress) {
        const mergedCp = mergeChapterProgress(localCp, cloud.chapterProgress);
        try { localStorage.setItem(key(username), JSON.stringify(mergedCp)); } catch { /* */ }
      }

      // Merge wrong answers (union)
      if (cloud.wrongAnswerIds) {
        const mergedWrong = mergeWrongAnswers(localWrong, cloud.wrongAnswerIds);
        try { localStorage.setItem(wrongKey(username), JSON.stringify(mergedWrong)); } catch { /* */ }
      }

      // Theme: cloud wins if different
      if (cloud.theme && cloud.theme !== localTheme) {
        try { localStorage.setItem('qp_theme', cloud.theme); } catch { /* */ }
      }
    }

    // Step 4: Upload MERGED data to cloud
    const mergedStats = getUserStats(username);
    const mergedCp = getChapterProgress(username);
    const mergedWrong = getWrongAnswerIds(username);
    const mergedTheme = getThemePreference(username);

    const uploadRes = await authenticatedFetch('/api/progress', {
      method: 'POST',
      body: JSON.stringify({
        username,
        stats: mergedStats,
        chapterProgress: mergedCp,
        wrongAnswerIds: mergedWrong,
        theme: mergedTheme,
      }),
    });

    if (!uploadRes.ok) {
      console.warn('[Sync] Upload failed:', uploadRes.status);
    }

    // Step 5: Notify UI to re-render with new data
    _syncVersion++;
    if (_syncCallback) _syncCallback();
  } catch (err) {
    console.warn('[Sync] doBidirectionalSync exception:', err);
  }
}

export function stopAutoSync(): void {
  if (_autoSyncInterval) {
    clearInterval(_autoSyncInterval);
    _autoSyncInterval = null;
  }
  _syncCallback = null;
}

// ---- Manual sync (download cloud → merge → upload merged) ----
export async function manualSync(username: string): Promise<boolean> {
  try {
    await doBidirectionalSync(username);
    return true;
  } catch {
    return false;
  }
}

// Re-export quiz resume from separate module
export { saveQuizResume, loadQuizResume, clearQuizResume, hasQuizResume, loadQuizResumeLegacy, clearQuizResumeLegacy, RESUME_THRESHOLD, type QuizResumeData } from './quizResume';
