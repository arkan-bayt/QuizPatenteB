// ============================================================
// LOGIC - Assignment Engine
// Client-side logic layer for assignment management
// Calls the /api/assignments endpoints
// ============================================================
import type { Assignment, AssignmentResult } from '@/data/supabaseClient';
import { authenticatedFetch } from '@/lib/api';

// ============================================================
// TYPES
// ============================================================

export interface AssignmentConfig {
  chapters: number[];
  number_of_questions: number;
  time_limit_minutes: number | null;
  max_attempts: number;
  mode: 'exam' | 'practice' | 'chapters';
}

export interface CreateAssignmentParams {
  teacherId: string;
  title: string;
  description?: string;
  config: AssignmentConfig;
  studentIds: string[];
}

export interface AssignmentResultDetail {
  student_id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  status: string;
  attempts: number;
  assigned_at: string;
  best_score: number;
  best_total: number;
  best_correct: number;
  best_time: number;
  best_completed_at: string | null;
  result_count: number;
  results: Array<{
    id: string;
    score: number;
    total_questions: number;
    correct_count: number;
    mistakes_count: number;
    time_taken_seconds: number;
    completed_at: string;
  }>;
}

export interface AssignmentResultsResponse {
  ok: boolean;
  msg?: string;
  assignment?: {
    id: string;
    title: string;
    config: AssignmentConfig;
  };
  students?: AssignmentResultDetail[];
  summary?: {
    total_students: number;
    completed: number;
    pending: number;
    in_progress: number;
    avg_score: number;
    pass_rate: number;
  };
}

export interface StartAssignmentResponse {
  ok: boolean;
  msg: string;
  started?: boolean;
  alreadyStarted?: boolean;
  canStart?: boolean;
  status?: string;
  attempts?: number;
  config?: AssignmentConfig;
}

export interface SubmitResultParams {
  studentId: string;
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
}

export interface SubmitResultResponse {
  ok: boolean;
  msg: string;
  result?: {
    id: string;
    score: number;
    total_questions: number;
    correct_count: number;
    passed: boolean;
    completed_at: string;
  };
  status?: string;
  attempts?: number;
  canRetry?: boolean;
}

export interface AssignmentStatusResponse {
  ok: boolean;
  msg?: string;
  status: string;
  attempts: number;
  max_attempts: number;
  assigned_at: string;
  is_active: boolean;
  canRetry: boolean;
  best_result: {
    score: number;
    total_questions: number;
    correct_count: number;
    completed_at: string;
  } | null;
}

// ============================================================
// ASSIGNMENT CRUD
// ============================================================

/**
 * Create a new assignment (teacher only)
 */
export async function createAssignment(
  params: CreateAssignmentParams
): Promise<{ ok: boolean; msg: string; assignment?: any }> {
  try {
    const res = await authenticatedFetch('/api/assignments', {
      method: 'POST',
      body: JSON.stringify({ action: 'create', ...params }),
    });
    const data = await res.json();
    return { ok: data.ok, msg: data.msg || 'Errore', assignment: data.assignment };
  } catch {
    return { ok: false, msg: 'Errore di connessione' };
  }
}

/**
 * Get assignments list
 * - Teacher: sees their own assignments
 * - Student: sees assignments assigned to them
 * - Super admin: sees all assignments
 */
export async function getTeacherAssignments(teacherId: string): Promise<Assignment[]> {
  try {
    const res = await authenticatedFetch(`/api/assignments?userId=${teacherId}&role=teacher`);
    const data = await res.json();
    if (data.ok && data.assignments) return data.assignments as Assignment[];
    return [];
  } catch {
    return [];
  }
}

/**
 * Get all assignments (super admin view)
 */
export async function getAllAssignments(): Promise<Assignment[]> {
  try {
    const res = await authenticatedFetch(`/api/assignments?userId=super-admin&role=super_admin`);
    const data = await res.json();
    if (data.ok && data.assignments) return data.assignments as Assignment[];
    return [];
  } catch {
    return [];
  }
}

/**
 * Get student's assigned assignments with status and best results
 */
export async function getStudentAssignments(studentId: string): Promise<Assignment[]> {
  try {
    const res = await authenticatedFetch(`/api/assignments?userId=${studentId}&role=student`);
    const data = await res.json();
    if (data.ok && data.assignments) return data.assignments as Assignment[];
    return [];
  } catch {
    return [];
  }
}

/**
 * Get a single assignment's details
 */
export async function getAssignmentDetail(
  assignmentId: string,
  userId: string,
  role: string
): Promise<{ ok: boolean; assignment?: Assignment }> {
  try {
    const res = await authenticatedFetch(`/api/assignments/${assignmentId}?userId=${userId}&role=${role}`);
    const data = await res.json();
    if (data.ok) return { ok: true, assignment: data.assignment as Assignment };
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

// ============================================================
// ASSIGNMENT INTERACTION (Student)
// ============================================================

/**
 * Start an assignment (student marks as in_progress)
 */
export async function startAssignment(
  assignmentId: string,
  studentId: string
): Promise<StartAssignmentResponse> {
  try {
    const res = await authenticatedFetch(`/api/assignments/${assignmentId}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'start', studentId }),
    });
    const data = await res.json();
    return data as StartAssignmentResponse;
  } catch {
    return { ok: false, msg: 'Errore di connessione' };
  }
}

/**
 * Submit assignment result (student submits quiz)
 */
export async function submitAssignmentResult(
  assignmentId: string,
  params: SubmitResultParams
): Promise<SubmitResultResponse> {
  try {
    const res = await authenticatedFetch(`/api/assignments/${assignmentId}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'submit', ...params }),
    });
    const data = await res.json();
    return data as SubmitResultResponse;
  } catch {
    return { ok: false, msg: 'Errore di connessione' };
  }
}

/**
 * Get student's current status for an assignment
 */
export async function getAssignmentStatus(
  assignmentId: string,
  studentId: string
): Promise<AssignmentStatusResponse> {
  try {
    const res = await authenticatedFetch(`/api/assignments/${assignmentId}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'status', studentId }),
    });
    const data = await res.json();
    return data as AssignmentStatusResponse;
  } catch {
    return {
      ok: false,
      msg: 'Errore di connessione',
      status: 'pending',
      attempts: 0,
      max_attempts: 1,
      assigned_at: '',
      is_active: true,
      canRetry: false,
      best_result: null,
    };
  }
}

/**
 * Get student's results for a specific assignment
 */
export async function getStudentResult(
  assignmentId: string,
  studentId: string,
  resultId?: string
): Promise<{ ok: boolean; result?: any; all_results?: AssignmentResult[] }> {
  try {
    const res = await authenticatedFetch(`/api/assignments/${assignmentId}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'result', studentId, resultId }),
    });
    const data = await res.json();
    return data;
  } catch {
    return { ok: false };
  }
}

// ============================================================
// ASSIGNMENT RESULTS (Teacher)
// ============================================================

/**
 * Get all results for an assignment (teacher view)
 * Returns student statuses, scores, and class statistics
 */
export async function getAssignmentResults(
  assignmentId: string,
  teacherId?: string
): Promise<AssignmentResultsResponse> {
  try {
    const res = await authenticatedFetch('/api/assignments', {
      method: 'POST',
      body: JSON.stringify({ action: 'results', assignmentId, teacherId }),
    });
    const data = await res.json();
    return data as AssignmentResultsResponse;
  } catch {
    return { ok: false, msg: 'Errore di connessione' };
  }
}

// ============================================================
// ASSIGNMENT MANAGEMENT (Teacher)
// ============================================================

/**
 * Update an existing assignment
 */
export async function updateAssignment(
  assignmentId: string,
  teacherId: string,
  updates: {
    title?: string;
    description?: string;
    config?: AssignmentConfig;
    is_active?: boolean;
    addStudentIds?: string[];
    removeStudentIds?: string[];
  }
): Promise<{ ok: boolean; msg: string }> {
  try {
    const res = await authenticatedFetch('/api/assignments', {
      method: 'POST',
      body: JSON.stringify({ action: 'update', assignmentId, teacherId, ...updates }),
    });
    const data = await res.json();
    return { ok: data.ok, msg: data.msg || 'Errore' };
  } catch {
    return { ok: false, msg: 'Errore di connessione' };
  }
}

/**
 * Delete an assignment (cascade deletes students and results)
 */
export async function deleteAssignment(
  assignmentId: string,
  teacherId: string
): Promise<{ ok: boolean; msg: string }> {
  try {
    const res = await authenticatedFetch('/api/assignments', {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', assignmentId, teacherId }),
    });
    const data = await res.json();
    return { ok: data.ok, msg: data.msg || 'Errore' };
  } catch {
    return { ok: false, msg: 'Errore di connessione' };
  }
}
