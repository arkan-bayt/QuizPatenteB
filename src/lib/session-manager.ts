/**
 * session-manager.ts
 * Manages quiz session persistence in localStorage.
 * Allows users to resume a quiz from where they left off.
 */

import { SavedQuizSession, QuizMode } from './types';

const SESSIONS_PREFIX = 'quiz-patente-sessions-';
const SESSIONS_INDEX_KEY = 'quiz-patente-sessions-index';

/**
 * Generate a unique session key based on quiz configuration.
 * This ensures different quiz types get separate sessions.
 */
export function generateSessionKey(params: {
  quizMode: QuizMode;
  chapterSlug?: string | null;
  chapterSlugs?: string[] | null;
  subtopics?: string[] | null;
}): string {
  const { quizMode, chapterSlug, chapterSlugs, subtopics } = params;

  switch (quizMode) {
    case 'chapter':
      return `chapter-${chapterSlug || 'unknown'}`;
    case 'errors':
      return `errors-${chapterSlug || 'unknown'}`;
    case 'subtopics':
      return `subtopics-${chapterSlug}-${(subtopics || []).sort().join(',')}`;
    case 'multi-chapter':
      return `multi-${(chapterSlugs || []).sort().join(',')}`;
    case 'full-exam':
      return 'full-exam';
    case 'exam':
      // Exams are not resumable (timed)
      return 'exam';
    default:
      return `unknown-${Date.now()}`;
  }
}

/**
 * Get all saved session keys (index)
 */
function getSessionIndex(): string[] {
  try {
    const raw = localStorage.getItem(SESSIONS_INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Update the session index
 */
function updateSessionIndex(keys: string[]): void {
  try {
    localStorage.setItem(SESSIONS_INDEX_KEY, JSON.stringify(keys));
  } catch {
    // storage full
  }
}

/**
 * Save a quiz session to localStorage.
 * Only saves if the user has answered at least 1 question (skip brand new sessions).
 */
export function saveQuizSession(session: SavedQuizSession): void {
  // Don't save if no progress has been made
  if (session.userAnswers.length === 0) return;

  // Don't save exam sessions (they are timed and shouldn't be resumed)
  if (session.quizMode === 'exam') return;

  // Don't save if quiz is finished (all questions answered)
  if (session.currentIndex >= session.questions.length && session.questions.length > 0) return;

  try {
    // Limit stored sessions to prevent storage overflow
    const index = getSessionIndex();

    // Remove old key if it exists
    const existingIdx = index.indexOf(session.sessionKey);
    if (existingIdx !== -1) {
      index.splice(existingIdx, 1);
    }

    // Add the new/updated key at the beginning
    index.unshift(session.sessionKey);

    // Keep max 10 sessions
    while (index.length > 10) {
      const oldKey = index.pop();
      if (oldKey) {
        try { localStorage.removeItem(SESSIONS_PREFIX + oldKey); } catch { /* ignore */ }
      }
    }

    // Save index
    updateSessionIndex(index);

    // Save session data
    const sessionData: SavedQuizSession = {
      ...session,
      savedAt: Date.now(),
    };
    localStorage.setItem(SESSIONS_PREFIX + session.sessionKey, JSON.stringify(sessionData));
  } catch {
    // localStorage full - try to clean up old sessions
    cleanupOldSessions();
  }
}

/**
 * Load a saved quiz session from localStorage.
 */
export function loadQuizSession(sessionKey: string): SavedQuizSession | null {
  try {
    const raw = localStorage.getItem(SESSIONS_PREFIX + sessionKey);
    if (!raw) return null;
    return JSON.parse(raw) as SavedQuizSession;
  } catch {
    return null;
  }
}

/**
 * Check if a saved session exists for the given parameters.
 */
export function hasSavedSession(params: {
  quizMode: QuizMode;
  chapterSlug?: string | null;
  chapterSlugs?: string[] | null;
  subtopics?: string[] | null;
}): SavedQuizSession | null {
  const key = generateSessionKey(params);
  return loadQuizSession(key);
}

/**
 * Delete a specific saved session.
 */
export function deleteQuizSession(sessionKey: string): void {
  try {
    localStorage.removeItem(SESSIONS_PREFIX + sessionKey);
    const index = getSessionIndex().filter(k => k !== sessionKey);
    updateSessionIndex(index);
  } catch { /* ignore */ }
}

/**
 * Delete the saved session matching the given parameters.
 */
export function deleteSessionByParams(params: {
  quizMode: QuizMode;
  chapterSlug?: string | null;
  chapterSlugs?: string[] | null;
  subtopics?: string[] | null;
}): void {
  const key = generateSessionKey(params);
  deleteQuizSession(key);
}

/**
 * Get all saved sessions (for display purposes).
 * Returns sessions sorted by last saved time.
 */
export function getAllSavedSessions(): SavedQuizSession[] {
  const index = getSessionIndex();
  const sessions: SavedQuizSession[] = [];

  for (const key of index) {
    const session = loadQuizSession(key);
    if (session) {
      sessions.push(session);
    }
  }

  return sessions;
}

/**
 * Get the most recent saved session (if any).
 */
export function getMostRecentSession(): SavedQuizSession | null {
  const sessions = getAllSavedSessions();
  return sessions.length > 0 ? sessions[0] : null;
}

/**
 * Clean up sessions older than 7 days.
 */
function cleanupOldSessions(): void {
  const index = getSessionIndex();
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const validKeys: string[] = [];

  for (const key of index) {
    const session = loadQuizSession(key);
    if (session && (now - session.savedAt) < sevenDays) {
      validKeys.push(key);
    } else if (session) {
      try { localStorage.removeItem(SESSIONS_PREFIX + key); } catch { /* ignore */ }
    }
  }

  updateSessionIndex(validKeys);
}

/**
 * Clear all saved sessions (e.g., on logout).
 */
export function clearAllSessions(): void {
  const index = getSessionIndex();
  for (const key of index) {
    try { localStorage.removeItem(SESSIONS_PREFIX + key); } catch { /* ignore */ }
  }
  updateSessionIndex([]);
}

/**
 * Format how long ago a session was saved (for display).
 */
export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Adesso';
  if (diffMinutes < 60) return `${diffMinutes} min fa`;
  if (diffHours < 24) return `${diffHours} ore fa`;
  if (diffDays < 7) return `${diffDays} giorni fa`;
  return new Date(timestamp).toLocaleDateString('it-IT');
}
