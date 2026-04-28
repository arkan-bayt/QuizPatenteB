import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth-utils';
import { supabase } from '@/lib/supabase';

// GET - Load user's progress from Supabase (single jsonb column)
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Sessione scaduta, effettua di nuovo il login' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('progress, updated_at')
      .eq('user_id', payload.userId)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const progress = data?.progress || {};
    return NextResponse.json({ progress, updatedAt: data?.updated_at || null });
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// PUT - Save all progress at once (single jsonb column)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Sessione scaduta, effettua di nuovo il login' }, { status: 401 });
    }

    const { progress } = await request.json();
    if (!progress || typeof progress !== 'object') {
      return NextResponse.json({ error: 'progress richiesto' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: payload.userId,
        progress,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// POST - Save/update single chapter (partial merge into jsonb)
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Sessione scaduta, effettua di nuovo il login' }, { status: 401 });
    }

    const { chapterSlug, chapterProgress: chapterData } = await request.json();

    if (!chapterSlug || !chapterData) {
      return NextResponse.json({ error: 'chapterSlug e chapterProgress richiesti' }, { status: 400 });
    }

    // Fetch current progress, merge chapter, and save
    const { data: existing } = await supabase
      .from('user_progress')
      .select('progress')
      .eq('user_id', payload.userId)
      .maybeSingle();

    const currentProgress: Record<string, any> = existing?.progress || {};
    currentProgress[chapterSlug] = chapterData;

    const { error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: payload.userId,
        progress: currentProgress,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}
