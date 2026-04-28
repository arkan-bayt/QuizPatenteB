-- ============================================
-- Supabase SQL: Create users table
-- ============================================
-- Run this SQL in Supabase Dashboard > SQL Editor
-- URL: https://supabase.com/dashboard → your project → SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads/writes (for our API routes with anon key)
-- This is fine because password hashing + token verification happens in our backend
CREATE POLICY "Allow all operations on users" ON users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ============================================
-- user_progress table: stores user quiz progress
-- ============================================
CREATE TABLE IF NOT EXISTS user_progress (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  progress JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (our backend verifies tokens)
CREATE POLICY "Allow all operations on user_progress" ON user_progress
  FOR ALL
  USING (true)
  WITH CHECK (true);
