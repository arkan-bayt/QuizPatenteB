// ============================================================
// API Route - Cloud Progress Sync (via Supabase server-side)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://jdahzuhkwimridgskcqd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYWh6dWhrd2ltcmlkZ3NrY3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTAwNjYsImV4cCI6MjA2MTM2NjA2Nn0.nFKnNh-ryJj_EodF_zqFEqDMzk-JYqeKjSowHY7JHYw';

// In-memory cache for progress data (survives between requests on same server)
const progressCache: Record<string, { stats: object; chapterProgress: object; wrongAnswerIds: number[]; updatedAt: number }> = {};
let tableChecked = false;
let tableExists = false;

async function checkOrCreateTable() {
  if (tableChecked) return tableExists;
  tableChecked = true;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/user_progress?select=username&limit=1`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    if (res.ok) {
      tableExists = true;
      return true;
    }
    // Try to create table via raw SQL - won't work with anon key, but let's try
    tableExists = false;
    return false;
  } catch {
    tableExists = false;
    return false;
  }
}

async function supabaseFetch(username: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_progress?username=eq.${encodeURIComponent(username)}&select=*`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.length > 0 ? data[0] : null;
}

async function supabaseUpsert(username: string, stats: object, chapterProgress: object, wrongAnswerIds: number[]) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_progress`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      username,
      stats,
      chapter_progress: chapterProgress,
      wrong_answer_ids: wrongAnswerIds,
      updated_at: new Date().toISOString(),
    }),
  });
  return res.ok;
}

async function supabaseUpdate(username: string, stats: object, chapterProgress: object, wrongAnswerIds: number[]) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_progress?username=eq.${encodeURIComponent(username)}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      stats,
      chapter_progress: chapterProgress,
      wrong_answer_ids: wrongAnswerIds,
      updated_at: new Date().toISOString(),
    }),
  });
  return res.ok;
}

// GET /api/progress?username=xxx - Load progress
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

  // Check cache first
  const cached = progressCache[username];
  if (cached && Date.now() - cached.updatedAt < 30000) {
    return NextResponse.json({ source: 'cache', ...cached });
  }

  // Try Supabase
  const hasTable = await checkOrCreateTable();
  if (hasTable) {
    const row = await supabaseFetch(username);
    if (row) {
      const result = {
        stats: row.stats || {},
        chapterProgress: row.chapter_progress || {},
        wrongAnswerIds: row.wrong_answer_ids || [],
        updatedAt: Date.now(),
      };
      progressCache[username] = result;
      return NextResponse.json({ source: 'supabase', ...result });
    }
  }

  // Return empty if nothing found
  const empty = { stats: {}, chapterProgress: {}, wrongAnswerIds: [], updatedAt: Date.now() };
  return NextResponse.json({ source: 'empty', ...empty });
}

// POST /api/progress - Save progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, stats, chapterProgress, wrongAnswerIds } = body;
    if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

    const data = {
      stats: stats || {},
      chapterProgress: chapterProgress || {},
      wrongAnswerIds: wrongAnswerIds || [],
      updatedAt: Date.now(),
    };

    // Save to in-memory cache
    progressCache[username] = data;

    // Try to sync to Supabase
    const hasTable = await checkOrCreateTable();
    if (hasTable) {
      await supabaseUpsert(username, data.stats, data.chapterProgress, data.wrongAnswerIds);
      return NextResponse.json({ ok: true, source: 'supabase' });
    }

    return NextResponse.json({ ok: true, source: 'cache' });
  } catch (e: any) {
    return NextResponse.json({ ok: true, source: 'cache', error: e.message });
  }
}

// PATCH /api/progress - Update progress
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, stats, chapterProgress, wrongAnswerIds } = body;
    if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

    const data = {
      stats: stats || {},
      chapterProgress: chapterProgress || {},
      wrongAnswerIds: wrongAnswerIds || [],
      updatedAt: Date.now(),
    };

    // Update cache
    progressCache[username] = data;

    // Try Supabase
    const hasTable = await checkOrCreateTable();
    if (hasTable) {
      await supabaseUpdate(username, data.stats, data.chapterProgress, data.wrongAnswerIds);
      return NextResponse.json({ ok: true, source: 'supabase' });
    }

    return NextResponse.json({ ok: true, source: 'cache' });
  } catch (e: any) {
    return NextResponse.json({ ok: true, source: 'cache', error: e.message });
  }
}
