// ==========================================
// UTILITY LAYER - Safe rendering helpers
// ==========================================

/**
 * CRITICAL: Always use this when rendering values in JSX.
 * Prevents React Error #310 (Objects are not valid as a React child).
 */
export function safeStr(val: unknown, fallback: string = ''): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return fallback;
}

export function safeNum(val: unknown, fallback: number = 0): number {
  if (typeof val === 'number' && isFinite(val)) return val;
  return fallback;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'Adesso';
  if (diffMin < 60) return `${diffMin} min fa`;
  if (diffH < 24) return `${diffH} ore fa`;
  if (diffD < 7) return `${diffD} giorni fa`;
  return new Date(timestamp).toLocaleDateString('it-IT');
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Sanitize a session loaded from localStorage */
export function sanitizeSession(raw: unknown): import('./types').SessionState | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const s = raw as Record<string, unknown>;
  if (typeof s.mode !== 'string') return null;
  if (!Array.isArray(s.questions) || s.questions.length === 0) return null;
  if (typeof s.currentIndex !== 'number') return null;
  if (!Array.isArray(s.answers)) return null;
  if (typeof s.title !== 'string') return null;

  // Validate questions array
  const validQuestions = Array.isArray(s.questions)
    ? s.questions.filter((q: unknown) =>
        q && typeof q === 'object' && typeof (q as Record<string, unknown>).q === 'string'
      ).map((q: unknown, i: number) => ({
        id: typeof (q as Record<string, unknown>).id === 'string'
          ? String((q as Record<string, unknown>).id)
          : `q-${i}`,
        q: String((q as Record<string, unknown>).q),
        a: typeof (q as Record<string, unknown>).a === 'boolean'
          ? Boolean((q as Record<string, unknown>).a)
          : false,
        img: typeof (q as Record<string, unknown>).img === 'string'
          ? String((q as Record<string, unknown>).img) || undefined
          : undefined,
      }))
    : [];

  if (validQuestions.length === 0) return null;

  return {
    mode: String(s.mode),
    chapterSlugs: Array.isArray(s.chapterSlugs) ? s.chapterSlugs.filter((x: unknown) => typeof x === 'string') : [],
    topicKey: typeof s.topicKey === 'string' ? s.topicKey : null,
    questions: validQuestions,
    currentIndex: Math.max(0, Math.min(Number(s.currentIndex), validQuestions.length - 1)),
    answers: Array.isArray(s.answers)
      ? s.answers.filter((a: unknown) =>
          a && typeof a === 'object' &&
          typeof (a as Record<string, unknown>).questionId === 'string'
        ).map((a: unknown) => ({
          questionId: String((a as Record<string, unknown>).questionId),
          answer: typeof (a as Record<string, unknown>).answer === 'boolean' ? Boolean((a as Record<string, unknown>).answer) : false,
          correct: typeof (a as Record<string, unknown>).correct === 'boolean' ? Boolean((a as Record<string, unknown>).correct) : false,
          timestamp: typeof (a as Record<string, unknown>).timestamp === 'number' ? Number((a as Record<string, unknown>).timestamp) : Date.now(),
        }))
      : [],
    startedAt: typeof s.startedAt === 'number' ? s.startedAt : Date.now(),
    savedAt: typeof s.savedAt === 'number' ? s.savedAt : Date.now(),
    title: String(s.title),
  };
}
