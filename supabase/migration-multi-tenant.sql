-- ============================================================
-- Multi-Tenant B2B SaaS Migration
-- QuizPatenteB - Driving License Quiz Platform
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. UPDATE app_users TABLE - Add multi-tenant columns
-- ============================================================

-- Add new columns for multi-tenant support
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES app_users(id);
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS ai_usage_count INTEGER DEFAULT 0;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS ai_usage_limit INTEGER DEFAULT 3;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS last_ai_usage DATE;
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS subscription TEXT DEFAULT 'free' CHECK (subscription IN ('free', 'pro'));

-- Update role enum to support multi-tenant roles
ALTER TABLE app_users DROP CONSTRAINT IF EXISTS app_users_role_check;
ALTER TABLE app_users ADD CONSTRAINT app_users_role_check CHECK (role IN ('super_admin', 'teacher', 'student'));

-- Migrate existing admin to super_admin role
UPDATE app_users SET role = 'super_admin' WHERE role = 'admin';
-- Migrate existing user to student role
UPDATE app_users SET role = 'student' WHERE role = 'user';

-- ============================================================
-- 2. CREATE assignments TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  -- config structure:
  -- { chapters: [1,2,3], number_of_questions: 30, time_limit_minutes: null, max_attempts: 1, mode: 'exam'|'practice'|'chapters' }
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for teacher queries
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);

-- ============================================================
-- 3. CREATE assignment_students TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS assignment_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
  attempts INTEGER DEFAULT 0,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_assignment_students_assignment ON assignment_students(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_students_student ON assignment_students(student_id);

-- ============================================================
-- 4. CREATE assignment_results TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS assignment_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  mistakes_count INTEGER DEFAULT 0,
  time_taken_seconds INTEGER DEFAULT 0,
  answers JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_assignment_results_assignment ON assignment_results(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_results_student ON assignment_results(student_id);

-- ============================================================
-- 5. CREATE question_progress TABLE
-- Individual question-level tracking for detailed analytics
-- ============================================================

CREATE TABLE IF NOT EXISTS question_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  chapter_id INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_question_progress_user ON question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_question_progress_chapter ON question_progress(user_id, chapter_id);

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6a. app_users RLS Policies
-- ============================================================

-- Drop old policies
DROP POLICY IF EXISTS "Allow anon read" ON app_users;
DROP POLICY IF EXISTS "Deny anon insert" ON app_users;
DROP POLICY IF EXISTS "Denon anon update" ON app_users;
DROP POLICY IF EXISTS "Deny anon delete" ON app_users;
DROP POLICY IF EXISTS "Users can read their own data" ON app_users;
DROP POLICY IF EXISTS "Teachers can read their students" ON app_users;
DROP POLICY IF EXISTS "Teachers can create students" ON app_users;
DROP POLICY IF EXISTS "Super admin full access" ON app_users;

-- Users can read their own data (for profile, login verification)
CREATE OR REPLACE POLICY "Users can read their own data" ON app_users
  FOR SELECT USING (auth.uid() = id);

-- Super admin can read all users
CREATE OR REPLACE POLICY "Super admin read all" ON app_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin')
  );

-- Teachers can read their own students
CREATE OR REPLACE POLICY "Teachers can read their students" ON app_users
  FOR SELECT USING (
    owner_id = auth.uid()::uuid
  );

-- Super admin can create any user (teachers, students)
CREATE OR REPLACE POLICY "Super admin create users" ON app_users
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin')
  );

-- Teachers can create students under them
CREATE OR REPLACE POLICY "Teachers can create students" ON app_users
  FOR INSERT WITH CHECK (
    owner_id = auth.uid()::uuid
    AND role = 'student'
  );

-- Super admin can update any user
CREATE OR REPLACE POLICY "Super admin update users" ON app_users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin')
  );

-- Teachers can update their own students
CREATE OR REPLACE POLICY "Teachers update their students" ON app_users
  FOR UPDATE USING (
    owner_id = auth.uid()::uuid
  ) WITH CHECK (
    owner_id = auth.uid()::uuid
  );

-- Super admin can delete any user
CREATE OR REPLACE POLICY "Super admin delete users" ON app_users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin')
  );

-- ============================================================
-- 6b. assignments RLS Policies
-- ============================================================

-- Teachers can manage their own assignments (full CRUD)
CREATE OR REPLACE POLICY "Teachers manage own assignments" ON assignments
  FOR ALL USING (teacher_id = auth.uid()::uuid);

-- Students can read assignments assigned to them
CREATE OR REPLACE POLICY "Students read their assignments" ON assignments
  FOR SELECT USING (
    id IN (SELECT assignment_id FROM assignment_students WHERE student_id = auth.uid()::uuid)
  );

-- Super admin can see all assignments
CREATE OR REPLACE POLICY "Super admin all assignments" ON assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin')
  );

-- ============================================================
-- 6c. assignment_students RLS Policies
-- ============================================================

-- Teachers can manage students for their own assignments
CREATE OR REPLACE POLICY "Teachers manage their assignment students" ON assignment_students
  FOR ALL USING (
    assignment_id IN (SELECT id FROM assignments WHERE teacher_id = auth.uid()::uuid)
  );

-- Students can read their own assignments
CREATE OR REPLACE POLICY "Students read their own assignments" ON assignment_students
  FOR SELECT USING (student_id = auth.uid()::uuid);

-- Students can update their own status (in_progress, completed)
CREATE OR REPLACE POLICY "Students update their own status" ON assignment_students
  FOR UPDATE USING (student_id = auth.uid()::uuid);

-- ============================================================
-- 6d. assignment_results RLS Policies
-- ============================================================

-- Teachers can read results for their assignments
CREATE OR REPLACE POLICY "Teachers read student results" ON assignment_results
  FOR SELECT USING (
    assignment_id IN (SELECT id FROM assignments WHERE teacher_id = auth.uid()::uuid)
  );

-- Students can read their own results
CREATE OR REPLACE POLICY "Students read own results" ON assignment_results
  FOR SELECT USING (student_id = auth.uid()::uuid);

-- Students can insert their own results
CREATE OR REPLACE POLICY "Students insert own results" ON assignment_results
  FOR INSERT WITH CHECK (student_id = auth.uid()::uuid);

-- Super admin can see all results
CREATE OR REPLACE POLICY "Super admin all results" ON assignment_results
  FOR ALL USING (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin')
  );

-- ============================================================
-- 6e. question_progress RLS Policies
-- ============================================================

-- Users can manage their own question progress
CREATE OR REPLACE POLICY "Users manage own question progress" ON question_progress
  FOR ALL USING (user_id = auth.uid()::uuid);

-- Teachers can read their students' question progress
CREATE OR REPLACE POLICY "Teachers read student question progress" ON question_progress
  FOR SELECT USING (
    user_id IN (SELECT id FROM app_users WHERE owner_id = auth.uid()::uuid)
  );

-- ============================================================
-- 6f. user_progress RLS Policies
-- ============================================================

-- Drop old open policy
DROP POLICY IF EXISTS "Enable anonymous access" ON user_progress;
DROP POLICY IF EXISTS "Allow anon full access" ON user_progress;
DROP POLICY IF EXISTS "Users manage own progress" ON user_progress;
DROP POLICY IF EXISTS "Teachers read student progress" ON user_progress;
DROP POLICY IF EXISTS "Super admin all progress" ON user_progress;

-- Users can manage their own progress
CREATE OR REPLACE POLICY "Users manage own progress" ON user_progress
  FOR ALL USING (username = (SELECT username FROM app_users WHERE id = auth.uid()::uuid LIMIT 1));

-- Teachers can read their students' progress
CREATE OR REPLACE POLICY "Teachers read student progress" ON user_progress
  FOR SELECT USING (
    username IN (SELECT username FROM app_users WHERE owner_id = auth.uid()::uuid)
  );

-- Super admin can manage all progress
CREATE OR REPLACE POLICY "Super admin all progress" ON user_progress
  FOR ALL USING (
    EXISTS (SELECT 1 FROM app_users WHERE id = auth.uid()::uuid AND role = 'super_admin')
  );

-- ============================================================
-- 6g. admin_credentials RLS
-- ============================================================

ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. UPDATED_AT TRIGGER FOR assignments
-- ============================================================

-- Auto-update updated_at on assignment changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_updated_at ON assignments;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- DONE - Multi-tenant migration complete!
-- ============================================================
