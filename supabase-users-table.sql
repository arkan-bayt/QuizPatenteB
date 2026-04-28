-- ============================================================
-- Supabase SQL: Create app_users table for user management
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Create users table
CREATE TABLE IF NOT EXISTS app_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous to read (for login verification)
CREATE POLICY "Allow anon read" ON app_users FOR SELECT USING (true);

-- Deny anon inserts/updates/deletes (handled by service role only)
CREATE POLICY "Deny anon insert" ON app_users FOR INSERT WITH CHECK (false);
CREATE POLICY "Denon anon update" ON app_users FOR UPDATE USING (false);
CREATE POLICY "Deny anon delete" ON app_users FOR DELETE USING (false);

-- Insert default admin
INSERT INTO app_users (username, password_hash, role)
VALUES ('arkan', '4l', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Note: password 'arkan1' hashes to '4l' with our simple hash
-- Additional users can be added through the Admin Panel in the app
