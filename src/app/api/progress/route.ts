// ============================================================
// API Route - Cloud Progress Sync via Supabase
// Uses user_progress table with columns:
//   user_id (TEXT PK), progress (JSONB), updated_at (TIMESTAMPTZ)
//
// Multi-tenant additions:
//   - save_question_progress: save individual question progress to DB
//   - get_question_progress: load question progress from DB
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// GET /api/progress?username=xxx - Load progress from Supabase
// ============================================================
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
          theme: null,
          updatedAt: 0,
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
      theme: progress.theme || null,
      updatedAt: data?.updated_at ? new Date(data.updated_at).getTime() : 0,
    });
  } catch (e: any) {
    console.error('Progress GET error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// POST /api/progress - Save progress to Supabase
// Actions:
//   - (default): save aggregate progress (username, stats, chapterProgress, wrongAnswerIds)
//   - save_question_progress: save individual question progress
//   - get_question_progress: load individual question progress
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'save_question_progress') {
      return handleSaveQuestionProgress(body);
    }

    if (action === 'get_question_progress') {
      return handleGetQuestionProgress(body);
    }

    // Default: save aggregate progress (existing behavior)
    return handleSaveAggregateProgress(body);
  } catch (e: any) {
    console.error('Progress POST error:', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// ---- SAVE AGGREGATE PROGRESS (existing behavior) ----
async function handleSaveAggregateProgress(body: {
  username: string;
  stats: any;
  chapterProgress: any;
  wrongAnswerIds: number[];
  theme?: string | null;
}) {
  const { username, stats, chapterProgress, wrongAnswerIds } = body;
  if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

  const progress = {
    stats: stats || {},
    chapterProgress: chapterProgress || {},
    wrongAnswerIds: wrongAnswerIds || [],
    theme: body.theme || null,
    updatedAt: Date.now(),
  };

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
}

// ---- SAVE QUESTION PROGRESS ----
// Save individual question answer to question_progress table
// Body: { action: 'save_question_progress', userId, questionId, chapterId, isCorrect }
// Supports batch: { action: 'save_question_progress', userId, entries: [{ questionId, chapterId, isCorrect }] }
async function handleSaveQuestionProgress(body: {
  userId: string;
  questionId?: number;
  chapterId?: number;
  isCorrect?: boolean;
  entries?: Array<{ questionId: number; chapterId: number; isCorrect: boolean }>;
}) {
  const { userId, questionId, chapterId, isCorrect, entries } = body;

  if (!userId) {
    return NextResponse.json({ ok: false, msg: 'ID utente mancante' }, { status: 400 });
  }

  // Support both single and batch saves
  const itemsToSave: Array<{ user_id: string; question_id: number; chapter_id: number; is_correct: boolean }> = [];

  if (entries && entries.length > 0) {
    // Batch mode
    for (const entry of entries) {
      if (entry.questionId !== undefined && entry.chapterId !== undefined && entry.isCorrect !== undefined) {
        itemsToSave.push({
          user_id: userId,
          question_id: entry.questionId,
          chapter_id: entry.chapterId,
          is_correct: entry.isCorrect,
        });
      }
    }
  } else if (questionId !== undefined && chapterId !== undefined && isCorrect !== undefined) {
    // Single mode
    itemsToSave.push({
      user_id: userId,
      question_id: questionId,
      chapter_id: chapterId,
      is_correct: isCorrect,
    });
  }

  if (itemsToSave.length === 0) {
    return NextResponse.json({ ok: false, msg: 'Nessun dato da salvare' }, { status: 400 });
  }

  // Upsert question progress (update is_correct if already exists)
  const { error } = await supabase
    .from('question_progress')
    .upsert(itemsToSave, {
      onConflict: 'user_id,question_id',
    });

  if (error) {
    console.error('Save question progress error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel salvataggio del progresso' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    msg: `Progresso salvato (${itemsToSave.length} domande)`,
    saved: itemsToSave.length,
  });
}

// ---- GET QUESTION PROGRESS ----
// Load individual question progress from question_progress table
// Body: { action: 'get_question_progress', userId, chapterId? }
async function handleGetQuestionProgress(body: {
  userId: string;
  chapterId?: number;
}) {
  const { userId, chapterId } = body;

  if (!userId) {
    return NextResponse.json({ ok: false, msg: 'ID utente mancante' }, { status: 400 });
  }

  let query = supabase
    .from('question_progress')
    .select('question_id, chapter_id, is_correct, created_at')
    .eq('user_id', userId);

  if (chapterId !== undefined) {
    query = query.eq('chapter_id', chapterId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Get question progress error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento del progresso' }, { status: 500 });
  }

  // Build structured data
  const progress = (data || []).map((row: any) => ({
    questionId: row.question_id,
    chapterId: row.chapter_id,
    isCorrect: row.is_correct,
    createdAt: row.created_at,
  }));

  // Compute chapter summaries
  const chapterSummaries: Record<number, {
    total: number;
    correct: number;
    wrong: number;
    accuracy: number;
  }> = {};

  for (const p of progress) {
    if (!chapterSummaries[p.chapterId]) {
      chapterSummaries[p.chapterId] = { total: 0, correct: 0, wrong: 0, accuracy: 0 };
    }
    const s = chapterSummaries[p.chapterId];
    s.total++;
    if (p.isCorrect) s.correct++; else s.wrong++;
  }

  // Calculate accuracy
  for (const ch of Object.keys(chapterSummaries)) {
    const s = chapterSummaries[Number(ch)];
    s.accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }

  // Overall stats
  const total = progress.length;
  const correct = progress.filter((p) => p.isCorrect).length;
  const wrong = total - correct;

  return NextResponse.json({
    ok: true,
    progress,
    total,
    correct,
    wrong,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    chapterSummaries,
  });
}
