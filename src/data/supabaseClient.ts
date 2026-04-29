// ============================================================
// DATA LAYER - Supabase + Types
// ============================================================
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jdahzuhkwimridgskcqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYWh6dWhrd2ltcmlkZ3NrY3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODc1MDMsImV4cCI6MjA5Mjg2MzUwM30.XKIZZ_n_nb9evzwpBrLzIaFxu6I0nBi_MBlwW1V93zU';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface AppUser {
  id: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'user';
  is_active: boolean;
  created_at: string;
}

export interface ChapterProgress {
  answeredIds: number[];
  correctIds: number[];
  wrongIds: number[];
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  totalWrong: number;
  streak: number;
  bestStreak: number;
  lastActive: string;
  examsPassed: number;
  examsFailed: number;
}
