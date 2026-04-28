// ============================================================
// LOGIC - Progress Engine (localStorage + Cloud sync)
// ============================================================
import { ChapterProgress, UserStats } from '@/data/supabaseClient';

// ---- Local Storage Keys ----
function key(username: string): string { return `qp_progress_${username}`; }
function wrongKey(username: string): string { return `qp_wrong_${username}`; }
function statsKey(username: string): string { return `qp_stats_${username}`; }

// ---- Cloud Sync State ----
let _syncEnabled: boolean | null = null; // null = not checked yet
let _syncTimer: ReturnType<typeof setTimeout> | null = null;
const SYNC_DELAY = 2000; // Debounce 2s

async function checkSyncAvailable(): Promise<boolean> {
  if (_syncEnabled !== null) return _syncEnabled;
  try {
    const res = await fetch('/api/progress?username=__test__');
    _syncEnabled = res.ok;
    return _syncEnabled;
  } catch {
    _syncEnabled = false;
    return false;
  }
}

async function cloudLoad(username: string): Promise<{
  stats: UserStats | null;
  chapterProgress: Record<number, ChapterProgress> | null;
  wrongAnswerIds: number[] | null;
} | null> {
  try {
    const res = await fetch(`/api/progress?username=${encodeURIComponent(username)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      stats: (data.stats && Object.keys(data.stats).length > 0) ? data.stats as UserStats : null,
      chapterProgress: (data.chapterProgress && Object.keys(data.chapterProgress).length > 0) ? data.chapterProgress as Record<number, ChapterProgress> : null,
      wrongAnswerIds: data.wrongAnswerIds && data.wrongAnswerIds.length > 0 ? data.wrongAnswerIds : null,
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
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          stats,
          chapterProgress: cp,
          wrongAnswerIds: wrong,
        }),
      });
    } catch { /* silent */ }
  }, SYNC_DELAY);
}

// ---- Load cloud progress and merge into local (call on login) ----
export async function loadCloudProgress(username: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const cloud = await cloudLoad(username);
    if (!cloud) return;

    // Merge stats - take the one with more answers
    if (cloud.stats) {
      const localStats = getUserStats(username);
      if (cloud.stats.totalAnswered > localStats.totalAnswered) {
        saveUserStats(username, cloud.stats);
      }
    }

    // Merge chapter progress - merge answered IDs
    if (cloud.chapterProgress) {
      const local = getChapterProgress(username);
      for (const [chIdStr, cloudCp] of Object.entries(cloud.chapterProgress)) {
        const chId = Number(chIdStr);
        const localCp = local[chId] || { answeredIds: [], correctIds: [], wrongIds: [] };
        // Merge: take union of answeredIds, merge correct/wrong
        for (const aId of cloudCp.answeredIds) {
          if (!localCp.answeredIds.includes(aId)) {
            localCp.answeredIds.push(aId);
          }
        }
        for (const cId of cloudCp.correctIds) {
          if (!localCp.correctIds.includes(cId)) {
            localCp.correctIds.push(cId);
          }
        }
        for (const wId of cloudCp.wrongIds) {
          if (!localCp.wrongIds.includes(wId)) {
            localCp.wrongIds.push(wId);
          }
        }
        local[chId] = localCp;
      }
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(key(username), JSON.stringify(local)); } catch { /* */ }
      }
    }

    // Merge wrong answers - take union
    if (cloud.wrongAnswerIds) {
      const localWrong = getWrongAnswerIds(username);
      let merged = false;
      for (const wId of cloud.wrongAnswerIds) {
        if (!localWrong.includes(wId)) {
          localWrong.push(wId);
          merged = true;
        }
      }
      if (merged && typeof window !== 'undefined') {
        try { localStorage.setItem(wrongKey(username), JSON.stringify(localWrong)); } catch { /* */ }
      }
    }
  } catch { /* silent */ }
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

// ---- Resume quiz state (local only, no need to sync) ----
export function saveQuizResume(username: string, data: { chapterIds: number[]; questionIds: number[]; idx: number; correct: number; wrong: number; mode: string }): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`qp_resume_${username}`, JSON.stringify({ ...data, ts: Date.now() })); } catch { /* */ }
}

export function loadQuizResume(username: string): { chapterIds: number[]; questionIds: number[]; idx: number; correct: number; wrong: number; mode: string } | null {
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
