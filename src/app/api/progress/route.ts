// ============================================================
// API Route - Cloud Progress Sync via Supabase
// SECURED: All actions require server-side session verification
// Users can only access their own progress
// Teachers can load progress for their students
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession, requireTeacherOrAbove } from '@/lib/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// GET /api/progress?username=xxx - Load progress (SECURED)
// ============================================================
export async function GET(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  // Use the verified user's username (ignore query param for security)
  const username = user.username.toLowerCase();

  // Students can only load their own progress
  // Teachers can only load progress for their own students (owner_id check)
  // Super_admin can load any user's progress
  const requestedUsername = request.nextUrl.searchParams.get('username')?.toLowerCase();
  if (user.role === 'student' && requestedUsername && requestedUsername !== username) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  // Teacher requesting another user's progress: verify student ownership
  if (user.role === 'teacher' && requestedUsername && requestedUsername !== username) {
    const { data: targetUser } = await supabase
      .from('app_users')
      .select('id, owner_id')
      .eq('username', requestedUsername)
      .single();
    if (!targetUser || targetUser.owner_id !== user.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }
  }

  const targetUsername = requestedUsername || username;

  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', targetUsername)
      .single();

    if (error) {
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
// POST /api/progress - Save progress (SECURED)
// ============================================================
export async function POST(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'save_question_progress') {
      return handleSaveQuestionProgress(user, body);
    }

    if (action === 'get_question_progress') {
      return handleGetQuestionProgress(user, body);
    }

    return handleSaveAggregateProgress(user, body);
  } catch (e: any) {
    console.error('Progress POST error:', e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// ---- SAVE AGGREGATE PROGRESS (SECURED) ----
async function handleSaveAggregateProgress(
  verifiedUser: { id: string; role: string; username: string },
  body: {
    username: string;
    stats: any;
    chapterProgress: any;
    wrongAnswerIds: number[];
    theme?: string | null;
  }
) {
  // Users can only save their own progress
  // Teachers can save progress for their own students (owner_id check)
  // Super_admin can save any progress
  const targetUsername = body.username?.toLowerCase() || verifiedUser.username.toLowerCase();

  if (targetUsername !== verifiedUser.username.toLowerCase()) {
    // Trying to save for a different user - require teacher or super_admin
    if (verifiedUser.role !== 'teacher' && verifiedUser.role !== 'super_admin') {
      return NextResponse.json({ ok: false, error: 'Non autorizzato' }, { status: 403 });
    }
    // Teacher: verify the target user is their student
    if (verifiedUser.role === 'teacher') {
      const { data: targetUser } = await supabase
        .from('app_users')
        .select('id, owner_id')
        .eq('username', targetUsername)
        .single();
      if (!targetUser || targetUser.owner_id !== verifiedUser.id) {
        return NextResponse.json({ ok: false, error: 'Non autorizzato' }, { status: 403 });
      }
    }
  }

  if (!targetUsername) return NextResponse.json({ error: 'Missing username' }, { status: 400 });

  const progress = {
    stats: body.stats || {},
    chapterProgress: body.chapterProgress || {},
    wrongAnswerIds: body.wrongAnswerIds || [],
    theme: body.theme || null,
    updatedAt: Date.now(),
  };

  const { error } = await supabase
    .from('user_progress')
    .upsert({
      user_id: targetUsername,
      progress,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Supabase POST error:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

// ---- SAVE QUESTION PROGRESS (SECURED) ----
async function handleSaveQuestionProgress(
  verifiedUser: { id: string; role: string; username: string },
  body: {
    userId: string;
    questionId?: number;
    chapterId?: number;
    isCorrect?: boolean;
    entries?: Array<{ questionId: number; chapterId: number; isCorrect: boolean }>;
  }
) {
  const { userId, questionId, chapterId, isCorrect, entries } = body;

  if (!userId) {
    return NextResponse.json({ ok: false, msg: 'ID utente mancante' }, { status: 400 });
  }

  // Students can only save their own progress
  // Teachers can save progress for their own students (owner_id check)
  if (userId !== verifiedUser.id && userId !== verifiedUser.username) {
    if (verifiedUser.role === 'student') {
      return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
    }
    if (verifiedUser.role === 'teacher') {
      // Look up the target user by id or username
      const { data: targetUser } = await supabase
        .from('app_users')
        .select('id, owner_id')
        .or(`id.eq.${userId},username.eq.${userId}`)
        .maybeSingle();
      if (!targetUser || targetUser.owner_id !== verifiedUser.id) {
        return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
      }
    }
    // super_admin can save for any user
  }

  const itemsToSave: Array<{ user_id: string; question_id: number; chapter_id: number; is_correct: boolean }> = [];

  if (entries && entries.length > 0) {
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

// ---- GET QUESTION PROGRESS (SECURED) ----
async function handleGetQuestionProgress(
  verifiedUser: { id: string; role: string; username: string },
  body: {
    userId: string;
    chapterId?: number;
  }
) {
  const { userId, chapterId } = body;

  if (!userId) {
    return NextResponse.json({ ok: false, msg: 'ID utente mancante' }, { status: 400 });
  }

  // Students can only view their own progress
  // Teachers can view their own students' progress (owner_id check)
  if (userId !== verifiedUser.id && userId !== verifiedUser.username) {
    if (verifiedUser.role === 'student') {
      return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
    }
    if (verifiedUser.role === 'teacher') {
      const { data: targetUser } = await supabase
        .from('app_users')
        .select('id, owner_id')
        .or(`id.eq.${userId},username.eq.${userId}`)
        .maybeSingle();
      if (!targetUser || targetUser.owner_id !== verifiedUser.id) {
        return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
      }
    }
    // super_admin can view any user's progress
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

  const progress = (data || []).map((row: any) => ({
    questionId: row.question_id,
    chapterId: row.chapter_id,
    isCorrect: row.is_correct,
    createdAt: row.created_at,
  }));

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

  for (const ch of Object.keys(chapterSummaries)) {
    const s = chapterSummaries[Number(ch)];
    s.accuracy = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
  }

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
