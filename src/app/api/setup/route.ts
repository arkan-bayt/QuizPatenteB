// ============================================================
// ONE-TIME SETUP - Creates school_classes table
// Must be called by super_admin only
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
      return NextResponse.json({ error: 'Solo il super admin può eseguire il setup' }, { status: 403 });
    }

    const { createClient } = require('@supabase/supabase-js');
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    const results: Record<string, { ok: boolean; error?: string }> = {};

    // 1. Create school_classes table via insert attempt (check if exists)
    const { error: checkError } = await supabase.from('school_classes').select('id').limit(1);
    if (!checkError) {
      results.school_classes = { ok: true };
    } else {
      results.school_classes = { ok: false, error: checkError.message };
    }

    // Check if class_id column exists on app_users
    const { error: colError } = await supabase.from('app_users').select('id, class_id').limit(1);
    if (!colError) {
      results.app_users_class_id = { ok: true };
    } else {
      results.app_users_class_id = { ok: false, error: colError.message };
    }

    const allReady = results.school_classes.ok && results.app_users_class_id.ok;

    return NextResponse.json({
      ok: allReady,
      results,
      sql_needed: !allReady,
      sql: allReady ? '' : `-- Esegui questo SQL nel Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jdahzuhkwimridgskcqd/sql

CREATE TABLE IF NOT EXISTS school_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  color TEXT DEFAULT '#4F46E5',
  icon TEXT DEFAULT '📚',
  created_by UUID REFERENCES app_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE app_users ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES school_classes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_app_users_class_id ON app_users(class_id);`,
      instructions: allReady ? '' : `1. Vai su https://supabase.com/dashboard/project/jdahzuhkwimridgskcqd/sql
2. Incolla il SQL qui sopra
3. Clicca "Run"
4. Torna qui e ricarica la pagina`,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
