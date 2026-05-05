// ============================================================
// SETUP - Check DB status and provide SQL for missing tables
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession, requireSuperAdmin } from '@/lib/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function POST(request: NextRequest) {
  try {
    const user = await verifySession(request.headers.get('Authorization'));
    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }
    if (!requireSuperAdmin(user)) {
      return NextResponse.json({ error: 'Solo il super admin puo eseguire il setup' }, { status: 403 });
    }

    const results: Record<string, { ok: boolean; error?: string }> = {};

    // Check assignments table
    const { error: e1 } = await supabase.from('assignments').select('id').limit(1);
    results.assignments = { ok: !e1, error: e1?.message };

    // Check assignment_students table
    const { error: e2 } = await supabase.from('assignment_students').select('id').limit(1);
    results.assignment_students = { ok: !e2, error: e2?.message };

    // Check assignment_results table
    const { error: e3 } = await supabase.from('assignment_results').select('id').limit(1);
    results.assignment_results = { ok: !e3, error: e3?.message };

    // Check subscription_tier column exists on app_users
    try {
      const { error: e4 } = await supabase.from('app_users').select('subscription_tier').limit(1);
      results.subscription_tier_column = { ok: !e4 || !e4.message.includes('does not exist'), error: e4?.message };
    } catch {
      results.subscription_tier_column = { ok: false, error: 'Column may not exist' };
    }

    const allReady = results.assignments.ok && results.assignment_students.ok && results.assignment_results.ok;

    return NextResponse.json({
      ok: allReady,
      results,
      sql_needed: !allReady,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  // Return the SQL that needs to be run in Supabase SQL Editor
  const sql = `-- ============================================================
-- TABLE 1: assignments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES public.app_users(id),
  title TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{"chapters":[],"number_of_questions":30,"time_limit_minutes":null,"max_attempts":3,"mode":"exam"}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- TABLE 2: assignment_students
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assignment_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES public.app_users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
  attempts INTEGER NOT NULL DEFAULT 0,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- ============================================================
-- TABLE 3: assignment_results
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assignment_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES public.app_users(id),
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  mistakes_count INTEGER NOT NULL DEFAULT 0,
  time_taken_seconds INTEGER NOT NULL DEFAULT 0,
  answers JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_active ON public.assignments(is_active);
CREATE INDEX IF NOT EXISTS idx_assignment_students_assignment ON public.assignment_students(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_students_student ON public.assignment_students(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_results_assignment ON public.assignment_results(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_results_student ON public.assignment_results(student_id);

-- ============================================================
-- DISABLE RLS (allow anon access for API)
-- ============================================================
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on assignments" ON public.assignments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assignment_students" ON public.assignment_students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on assignment_results" ON public.assignment_results FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- ADD subscription_tier column to app_users (if not exists)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'app_users' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE public.app_users ADD COLUMN subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium'));
    -- Upgrade existing super_admin and teacher accounts to premium
    UPDATE public.app_users SET subscription_tier = 'premium' WHERE role IN ('super_admin', 'teacher');
  END IF;
END $$;

-- ============================================================
-- UPGRADE existing password hashes to bcrypt (one-time migration)
-- ============================================================
-- NOTE: This migration runs automatically on login (auto-upgrade)
-- Existing simple hashes are verified and upgraded to bcrypt
-- when users log in for the first time after this update.

-- Done!`;

  return NextResponse.json({ sql });
}
