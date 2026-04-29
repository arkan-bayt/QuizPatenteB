// ============================================================
// API Route - Cloud Progress Sync via Supabase
// Uses user_progress table with columns:
//   user_id (TEXT PK), progress (JSONB), updated_at (TIMESTAMPTZ)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// GET /api/progress?username=xxx - Load progress from Supabase
export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username');
  if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', username)
      .single();

    if (error) {
      // Row doesn't exist yet - return empty
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          stats: {},
          chapterProgress: {},
          wrongAnswerIds: [],
        });
      }
      console.error('Supabase GET error:', error);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    // Extract from progress JSONB
    const progress = data?.progress || {};
    return NextResponse.json({
      stats: progress.stats || {},
      chapterProgress: progress.chapterProgress || {},
      wrongAnswerIds: progress.wrongAnswerIds || [],
      updatedAt: data?.updated_at ? new Date(data.updated_at).getTime() : 0,
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

    // Build progress object matching the table structure
    const progress = {
      stats: stats || {},
      chapterProgress: chapterProgress || {},
      wrongAnswerIds: wrongAnswerIds || [],
      updatedAt: Date.now(),
    };

    // Upsert using user_id as the key
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: username,
        progress,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('Progress POST error:', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
