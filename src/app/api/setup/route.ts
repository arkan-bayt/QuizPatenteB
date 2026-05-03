// ============================================================
// SETUP - Check if database migration is needed
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { verifySession, requireSuperAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifySession(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }
    if (!requireSuperAdmin(user)) {
      return NextResponse.json({ error: 'Solo il super admin puo eseguire il setup' }, { status: 403 });
    }

    const { createClient } = require('@supabase/supabase-js');
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const results: Record<string, { ok: boolean; error?: string }> = {};

    // Check school_classes table
    const { error: checkError1 } = await supabase.from('school_classes').select('id').limit(1);
    results.school_classes = { ok: !checkError1, error: checkError1?.message };

    // Check class_id column
    const { error: checkError2 } = await supabase.from('app_users').select('id, class_id').limit(1);
    results.app_users_class_id = { ok: !checkError2, error: checkError2?.message };

    const allReady = results.school_classes.ok && results.app_users_class_id.ok;

    return NextResponse.json({
      ok: allReady,
      results,
      sql_needed: !allReady,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
