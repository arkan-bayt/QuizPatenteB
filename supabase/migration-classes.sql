-- ============================================================
-- Classes Migration - QuizPatenteB
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jdahzuhkwimridgskcqd/sql
-- ============================================================

-- 1. CREATE school_classes TABLE
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

-- 2. ADD class_id COLUMN to app_users
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES school_classes(id) ON DELETE SET NULL;

-- 3. ADD class_id COLUMN to assignments (optional - for filtering)
ALTER TABLE assignments ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES school_classes(id) ON DELETE SET NULL;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_school_classes_created_by ON school_classes(created_by);
CREATE INDEX IF NOT EXISTS idx_app_users_class_id ON app_users(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class_id ON assignments(class_id);

-- ============================================================
-- DONE - Classes migration complete!
-- ============================================================
