// ============================================================
// SETUP - Run SQL migration using direct PostgreSQL connection
// Accepts database password from super_admin
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

    const body = await request.json();
    const { action } = body;

    if (action === 'run_migration') {
      return handleRunMigration(body);
    }

    // Default: check if setup is needed
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

async function handleRunMigration(body: { db_password: string }) {
  const { db_password } = body;

  if (!db_password || db_password.length < 4) {
    return NextResponse.json({ ok: false, msg: 'Password database non valida' });
  }

  try {
    const { Client } = require('pg');

    const SQL = `
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

CREATE INDEX IF NOT EXISTS idx_app_users_class_id ON app_users(class_id);
`;

    const client = new Client({
      host: 'db.jdahzuhkwimridgskcqd.supabase.co',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: db_password,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
    });

    await client.connect();
    await client.query(SQL);
    await client.end();

    return NextResponse.json({ ok: true, msg: 'Setup completato con successo! Ricarica la pagina.' });
  } catch (e: any) {
    console.error('Migration error:', e.message);
    return NextResponse.json({
      ok: false,
      msg: e.message?.includes('password') || e.message?.includes('auth')
        ? 'Password database non corretta. Trovala in Supabase Dashboard > Settings > Database > Database password.'
        : 'Errore: ' + e.message?.substring(0, 100)
    });
  }
}
