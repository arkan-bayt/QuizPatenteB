// ============================================================
// DATA LAYER - Supabase + Types
// Multi-tenant B2B SaaS interfaces for QuizPatenteB
// ============================================================
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jdahzuhkwimridgskcqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYWh6dWhrd2ltcmlkZ3NrY3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODc1MDMsImV4cCI6MjA5Mjg2MzUwM30.XKIZZ_n_nb9evzwpBrLzIaFxu6I0nBi_MBlwW1V93zU';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// USER TYPES
// ============================================================

export type UserRole = 'super_admin' | 'teacher' | 'student' | 'admin' | 'user';
export type SubscriptionType = 'free' | 'pro';

export interface AppUser {
  id: string;
  username: string;
  password_hash: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  // Multi-tenant fields
  email?: string | null;
  owner_id?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  ai_usage_count?: number;
  ai_usage_limit?: number;
  last_ai_usage?: string | null;
  subscription?: SubscriptionType;
}

// ============================================================
// PROGRESS TYPES
// ============================================================

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

// ============================================================
// ASSIGNMENT TYPES
// ============================================================

export interface AssignmentConfig {
  chapters: number[];
  number_of_questions: number;
  time_limit_minutes: number | null;
  max_attempts: number;
  mode: 'exam' | 'practice' | 'chapters';
}

export interface Assignment {
  id: string;
  teacher_id: string;
  title: string;
  description?: string | null;
  config: AssignmentConfig;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields (optional)
  teacher_username?: string;
  teacher_full_name?: string;
  _student_status?: AssignmentStudentStatus;
  _student_attempts?: number;
  _student_assigned_at?: string;
  _best_result?: {
    score: number;
    total_questions: number;
    correct_count: number;
    completed_at: string;
  } | null;
}

export type AssignmentStudentStatus = 'pending' | 'in_progress' | 'completed' | 'expired';

export interface AssignmentStudent {
  id: string;
  assignment_id: string;
  student_id: string;
  status: AssignmentStudentStatus;
  attempts: number;
  assigned_at: string;
  // Joined fields (optional)
  student_username?: string;
  student_full_name?: string;
  student_avatar_url?: string | null;
}

export interface AssignmentResult {
  id: string;
  assignment_id: string;
  student_id: string;
  score: number;
  total_questions: number;
  correct_count: number;
  mistakes_count: number;
  time_taken_seconds: number;
  answers: Record<string, {
    questionId: number;
    userAnswer: boolean;
    correctAnswer: boolean;
    isCorrect: boolean;
  }>;
  completed_at: string;
  created_at: string;
  // Joined fields (optional)
  student_username?: string;
  student_full_name?: string;
}

// ============================================================
// QUESTION PROGRESS TYPES
// ============================================================

export interface QuestionProgress {
  id: string;
  user_id: string;
  question_id: number;
  chapter_id: number;
  is_correct: boolean;
  created_at: string;
}
