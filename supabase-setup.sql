-- Supabase SQL: Create admin_credentials table
-- Run this in the Supabase SQL Editor

-- Create table
CREATE TABLE IF NOT EXISTS admin_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Policy: allow public read (anon key can verify credentials)
CREATE POLICY "Allow anonymous read access" ON admin_credentials
  FOR SELECT USING (true);

-- Policy: deny all insert/delete/update from anon
CREATE POLICY "Deny anonymous insert" ON admin_credentials
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Deny anonymous update" ON admin_credentials
  FOR UPDATE USING (false);

CREATE POLICY "Deny anonymous delete" ON admin_credentials
  FOR DELETE USING (false);

-- Insert default admin user (password: 12345)
-- Hash: simple hash function used in authEngine.ts
INSERT INTO admin_credentials (username, password_hash)
VALUES ('arkan', '4l')
ON CONFLICT (username) DO NOTHING;
