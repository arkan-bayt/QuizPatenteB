-- ============================================================
-- Supabase SQL: Create user_progress table for cloud sync
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Drop old table if exists (for clean re-creation)
DROP TABLE IF EXISTS user_progress;

-- Create progress table (one row per user)
CREATE TABLE user_progress (
  username TEXT PRIMARY KEY,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  chapter_progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  wrong_answer_ids INTEGER[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Allow all operations from anon key (we use simple username auth, not Supabase Auth)
CREATE POLICY "Allow anon full access" ON user_progress
  FOR ALL USING (true) WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_username ON user_progress(username);
