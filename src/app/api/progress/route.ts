import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase';

// GET - Load user's chapter progress from Supabase
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token non valido' }, { status: 401 });

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_email', payload.email);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Convert to the format expected by the quiz\ store
    const progress: Record<string, {
      chapterSlug: string;
      totalAttempted: number;
      correctCount: number;
      wrongCount: number;
      errorQuestionIds: string[];
      lastAccessed: number;
    }> = {};

    for (const row of data) {
      progress[row.chapter_slug] = {
        chapterSlug: row.chapter_slug,
        totalAttempted: row.total_attempted || 0,
        correctCount: row.correct_count || 0,
        wrongCount: row.wrong_count || 0,
        errorQuestionIds: row.error_question_ids || [],
        lastAccessed: new Date(row.last_accessed).getTime() || Date.now(),
      };
    }

    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// POST - Save/update user's chapter progress
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token non valido' }, { status: 401 });

    const { chapterSlug, totalAttempted, correctCount, wrongCount, errorQuestionIds } = await request.json();

    if (!chapterSlug) {
      return NextResponse.json({ error: 'chapterSlug richiesto' }, { status: 400 });
    }

    // Upsert the progress record
    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_email: payload.email,
        chapter_slug: chapterSlug,
        total_attempted: totalAttempted || 0,
        correct_count: correctCount || 0,
        wrong_count: wrongCount || 0,
        error_question_ids: errorQuestionIds || [],
        last_accessed: new Date().toISOString(),
      }, {
        onConflict: 'user_email,chapter_slug',
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// PUT - Save all progress at once
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token non valido' }, { status: 401 });

    const { progress } = await request.json();
    if (!progress || typeof progress !== 'object') {
      return NextResponse.json({ error: 'progress richiesto' }, { status: 400 });
    }

    const rows = Object.entries(progress).map(([slug, p]: [string, any]) => ({
      user_email: payload.email,
      chapter_slug: slug,
      total_attempted: p.totalAttempted || 0,
      correct_count: p.correctCount || 0,
      wrong_count: p.wrongCount || 0,
      error_question_ids: p.errorQuestionIds || [],
      last_accessed: new Date().toISOString(),
    }));

    if (rows.length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabase
      .from('user_progress')
      .upsert(rows, { onConflict: 'user_email,chapter_slug' });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}
