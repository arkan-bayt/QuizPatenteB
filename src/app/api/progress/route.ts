// ============================================================
// API Route - Cloud Progress Sync via Supabase
// Stores all progress as JSONB in user_progress table
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jdahzuhkwimridgskcqd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYWh6dWhrd2ltcmlkZ3NrY3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODc1MDMsImV4cCI6MjA5Mjg2MzUwM30.XKIZZ_n_nb9evzwpBrLzIaFxu6I0nBi_MBlwW1V93zU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// GET /api/progress?username=xxx - Load progress from Supabase
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('progress')
      .eq('user_id', username)
      .single();

    if (error) {
      // Row doesn't exist yet - return empty
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          source: 'supabase',
          stats: {},
          chapterProgress: {},
          wrongAnswerIds: [],
          updatedAt: 0,
        });
      }
      console.error('Supabase GET error:', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    const progress = data?.progress || {};
    return NextResponse.json({
      source: 'supabase',
      stats: progress.stats || {},
      chapterProgress: progress.chapterProgress || {},
      wrongAnswerIds: progress.wrongAnswerIds || [],
      updatedAt: progress.updatedAt || 0,
    });
  } catch (e: any) {
    console.error('Progress GET error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/progress - Save progress to Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, stats, chapterProgress, wrongAnswerIds } = body;
    if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

    const progressData = {
      stats: stats || {},
      chapterProgress: chapterProgress || {},
      wrongAnswerIds: wrongAnswerIds || [],
      updatedAt: Date.now(),
    };

    // Upsert: insert or update
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: username,
        progress: progressData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, source: 'supabase' });
  } catch (e: any) {
    console.error('Progress POST error:', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
