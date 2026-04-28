// ============================================================
// DATA LAYER - Supabase Client
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jdahzuhkwimridgskcqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYWh6dWhrd2ltcmlkZ3NrY3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3OTAwNjYsImV4cCI6MjA2MTM2NjA2Nn0.nFKnNh-ryJj_EodF_zqFEqDMzk-JYqeKjSowHY7JHYw';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const DEFAULT_ADMIN = {
  username: 'arkan',
  password: '12345',
};
