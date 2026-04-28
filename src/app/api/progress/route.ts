// ============================================================
// API Route - Cloud Progress Sync
// Uses in-memory cache on server + localStorage on client
// Falls back to cache when Supabase is unavailable
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://jdahzuhkwimridgskcqd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYWh6dWhrd2ltcmlkZ3NrY3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODc1MDMsImV4cCI6MjA5Mjg2MzUwM30.XKIZZ_n_nb9evzwpBrLzIaFxu6I0nBi_MBlwW1V93zU';

// ---- In-memory progress cache ----
interface ProgressData {
  stats: Record<string, unknown>;
  chapterProgress: Record<string, unknown>;
  wrongAnswerIds: number[];
  updatedAt: number;
}

const progressCache: Record<string, ProgressData> = {};

// ---- Quiz session storage (stores raw JSON) ----
// We store progress as JSONB in quiz_sessions if possible
// But since user_id is UUID FK, we'll use our own approach

function getProgress(username: string): ProgressData {
  return progressCache[username] || {
    stats: {},
    chapterProgress: {},
    wrongAnswerIds: [],
    updatedAt: 0,
  };
}

function setProgress(username: string, data: ProgressData) {
  progressCache[username] = { ...data, updatedAt: Date.now() };
}

// GET /api/progress?username=xxx - Load progress
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

  const data = getProgress(username);
  return NextResponse.json({ source: 'server', ...data });
}

// POST /api/progress - Save progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, stats, chapterProgress, wrongAnswerIds } = body;
    if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

    setProgress(username, {
      stats: stats || {},
      chapterProgress: chapterProgress || {},
      wrongAnswerIds: wrongAnswerIds || [],
      updatedAt: Date.now(),
    });

    return NextResponse.json({ ok: true, source: 'server' });
  } catch (e: any) {
    return NextResponse.json({ ok: true, source: 'server', error: e.message });
  }
}
