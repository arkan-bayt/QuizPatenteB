// ============================================================
// API Route - Assignments (list, create, get results)
// SECURED: All actions require server-side session verification
// Teachers create assignments, students view assigned ones
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession, requireTeacherOrAbove, type VerifiedUser } from '@/lib/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// GET /api/assignments - List assignments (SECURED)
// ============================================================
export async function GET(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  // Use verified user info, ignore query params
  const userId = user.id;
  const role = user.role;

  try {
    if (role === 'teacher' || role === 'super_admin') {
      // Teachers see their own assignments, super_admin sees all
      let query = supabase
        .from('assignments')
        .select(`
          *,
          teacher:app_users!assignments_teacher_id_fkey(id, username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (role === 'teacher') {
        query = query.eq('teacher_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('GET assignments error:', error);
        return NextResponse.json({ error: 'Errore nel caricamento compiti', debug: { code: error.code, message: error.message, details: error.details, hint: error.hint } }, { status: 500 });
      }

      // For each assignment, get student count and completion stats
      const assignmentsWithStats = await Promise.all((data || []).map(async (a: any) => {
        const { count: totalStudents } = await supabase
          .from('assignment_students')
          .select('id', { count: 'exact', head: true })
          .eq('assignment_id', a.id);

        const { count: completedStudents } = await supabase
          .from('assignment_students')
          .select('id', { count: 'exact', head: true })
          .eq('assignment_id', a.id)
          .eq('status', 'completed');

        return {
          ...a,
          teacher_username: a.teacher?.username || '',
          teacher_full_name: a.teacher?.full_name || a.teacher?.username || '',
          _student_count: totalStudents || 0,
          _completed_count: completedStudents || 0,
          teacher: undefined,
        };
      }));

      return NextResponse.json({ ok: true, assignments: assignmentsWithStats });
    }

    if (role === 'student') {
      // Students see assignments assigned to them
      const { data: studentAssignments, error: saError } = await supabase
        .from('assignment_students')
        .select(`
          *,
          assignment:assignments!assignment_students_assignment_id_fkey(
            *,
            teacher:app_users!assignments_teacher_id_fkey(id, username, full_name)
          )
        `)
        .eq('student_id', userId)
        .order('assigned_at', { ascending: false });

      if (saError) {
        console.error('GET student assignments error:', saError);
        return NextResponse.json({ error: 'Errore nel caricamento compiti' }, { status: 500 });
      }

      // Get best result for each assignment
      const assignmentsWithResults = await Promise.all((studentAssignments || []).map(async (sa: any) => {
        const assignment = sa.assignment;
        const { data: bestResult } = await supabase
          .from('assignment_results')
          .select('score, total_questions, correct_count, completed_at')
          .eq('assignment_id', sa.assignment_id)
          .eq('student_id', userId)
          .order('score', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...assignment,
          _student_status: sa.status,
          _student_attempts: sa.attempts,
          _student_assigned_at: sa.assigned_at,
          _best_result: bestResult || null,
          teacher_username: assignment?.teacher?.username || '',
          teacher_full_name: assignment?.teacher?.full_name || assignment?.teacher?.username || '',
          teacher: undefined,
          assignment: undefined,
        };
      }));

      return NextResponse.json({ ok: true, assignments: assignmentsWithResults });
    }

    return NextResponse.json({ error: 'Ruolo non valido' }, { status: 400 });
  } catch (e: any) {
    console.error('Assignments GET error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// POST /api/assignments (SECURED)
// ============================================================
export async function POST(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create': return handleCreateAssignment(user, body);
      case 'results': return handleGetResults(user, body);
      case 'update': return handleUpdateAssignment(user, body);
      case 'delete': return handleDeleteAssignment(user, body);
      case 'debug': return handleDebug(user);
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: any) {
    console.error('Assignments POST error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ---- CREATE ASSIGNMENT (SECURED) ----
async function handleCreateAssignment(
  verifiedUser: VerifiedUser,
  body: {
    teacherId: string;
    title: string;
    description?: string;
    config: {
      chapters: number[];
      number_of_questions: number;
      time_limit_minutes?: number | null;
      max_attempts: number;
      mode: 'exam' | 'practice' | 'chapters';
    };
    studentIds: string[];
  }
) {
  if (!requireTeacherOrAbove(verifiedUser)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { title, description, config, studentIds } = body;
  const teacherId = verifiedUser.id; // Always use verified user's ID

  if (!title || !config || !studentIds || studentIds.length === 0) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }

  if (!config.chapters || config.chapters.length === 0) {
    return NextResponse.json({ ok: false, msg: 'Seleziona almeno un capitolo' });
  }
  if (!config.number_of_questions || config.number_of_questions < 1) {
    return NextResponse.json({ ok: false, msg: 'Il numero di domande deve essere almeno 1' });
  }

  // Teacher can assign to any student (owner_id not yet in DB)
  // Future: add owner_id column for teacher isolation

  // Create the assignment
  const { data: assignment, error: createError } = await supabase
    .from('assignments')
    .insert({
      teacher_id: teacherId,
      title: title.trim(),
      description: (description || '').trim() || null,
      config: {
        chapters: config.chapters,
        number_of_questions: config.number_of_questions,
        time_limit_minutes: config.time_limit_minutes || null,
        max_attempts: config.max_attempts || 1,
        mode: config.mode || 'exam',
      },
      is_active: true,
    })
    .select('id, title, config, created_at')
    .single();

  if (createError) {
    console.error('Create assignment error:', createError);
    return NextResponse.json({ ok: false, msg: 'Errore nella creazione del compito', debug: { code: createError.code, message: createError.message, details: createError.details, hint: createError.hint } }, { status: 500 });
  }

  // Create assignment_students entries
  const studentRows = studentIds.map((sid) => ({
    assignment_id: assignment.id,
    student_id: sid,
    status: 'pending' as const,
  }));

  const { error: studentsError } = await supabase
    .from('assignment_students')
    .insert(studentRows);

  if (studentsError) {
    console.error('Create assignment_students error:', studentsError);
    await supabase.from('assignments').delete().eq('id', assignment.id);
    return NextResponse.json({ ok: false, msg: "Errore nell'assegnazione agli studenti", debug: { code: studentsError.code, message: studentsError.message, details: studentsError.details, hint: studentsError.hint } }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    msg: 'Compito creato e assegnato con successo',
    assignment: {
      id: assignment.id,
      title: assignment.title,
      student_count: studentIds.length,
      created_at: assignment.created_at,
    },
  });
}

// ---- GET RESULTS (SECURED) ----
async function handleGetResults(
  verifiedUser: VerifiedUser,
  body: {
    assignmentId: string;
    teacherId?: string;
  }
) {
  const { assignmentId } = body;

  if (!assignmentId) {
    return NextResponse.json({ ok: false, msg: 'ID compito mancante' });
  }

  // Get assignment info
  const { data: assignment, error: aError } = await supabase
    .from('assignments')
    .select('id, title, config, teacher_id')
    .eq('id', assignmentId)
    .single();

  if (aError || !assignment) {
    return NextResponse.json({ ok: false, msg: 'Compito non trovato' });
  }

  // Verify ownership: teacher must own, super_admin sees all
  if (verifiedUser.role === 'teacher' && assignment.teacher_id !== verifiedUser.id) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  // Students can also view results of their own assignments
  if (verifiedUser.role === 'student') {
    const { data: studentAssignment } = await supabase
      .from('assignment_students')
      .select('id')
      .eq('assignment_id', assignmentId)
      .eq('student_id', verifiedUser.id)
      .maybeSingle();
    if (!studentAssignment) {
      return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
    }
  }

  // Get student statuses
  const { data: studentStatuses, error: ssError } = await supabase
    .from('assignment_students')
    .select('id, student_id, status, attempts, assigned_at')
    .eq('assignment_id', assignmentId);

  if (ssError) {
    console.error('Get student statuses error:', ssError);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento risultati' }, { status: 500 });
  }

  const studentIds = (studentStatuses || []).map((s) => s.student_id);

  let studentDetails: Record<string, any> = {};
  if (studentIds.length > 0) {
    const { data: students } = await supabase
      .from('app_users')
      .select('id, username, full_name, avatar_url')
      .in('id', studentIds);
    (students || []).forEach((s: any) => {
      studentDetails[s.id] = s;
    });
  }

  let allResults: Record<string, any[]> = {};
  if (studentIds.length > 0) {
    const { data: results } = await supabase
      .from('assignment_results')
      .select('id, student_id, score, total_questions, correct_count, mistakes_count, time_taken_seconds, completed_at')
      .eq('assignment_id', assignmentId)
      .order('completed_at', { ascending: false });

    (results || []).forEach((r: any) => {
      if (!allResults[r.student_id]) allResults[r.student_id] = [];
      allResults[r.student_id].push(r);
    });
  }

  const students = (studentStatuses || []).map((ss) => {
    const details = studentDetails[ss.student_id] || {};
    const results = allResults[ss.student_id] || [];
    const bestResult = results.length > 0 ? results[0] : null;

    return {
      student_id: ss.student_id,
      username: details.username || '',
      full_name: details.full_name || null,
      avatar_url: details.avatar_url || null,
      status: ss.status,
      attempts: ss.attempts,
      assigned_at: ss.assigned_at,
      best_score: bestResult?.score || 0,
      best_total: bestResult?.total_questions || 0,
      best_correct: bestResult?.correct_count || 0,
      best_time: bestResult?.time_taken_seconds || 0,
      best_completed_at: bestResult?.completed_at || null,
      result_count: results.length,
      results: results.map((r: any) => ({
        id: r.id,
        score: r.score,
        total_questions: r.total_questions,
        correct_count: r.correct_count,
        mistakes_count: r.mistakes_count,
        time_taken_seconds: r.time_taken_seconds,
        completed_at: r.completed_at,
      })),
    };
  });

  const completedStudents = students.filter((s) => s.status === 'completed');
  const avgScore = completedStudents.length > 0
    ? Math.round(completedStudents.reduce((sum, s) => sum + s.best_score, 0) / completedStudents.length)
    : 0;
  const passRate = completedStudents.length > 0
    ? Math.round((completedStudents.filter((s) => s.best_score >= 60).length / completedStudents.length) * 100)
    : 0;

  return NextResponse.json({
    ok: true,
    assignment: {
      id: assignment.id,
      title: assignment.title,
      config: assignment.config,
    },
    students,
    summary: {
      total_students: students.length,
      completed: completedStudents.length,
      pending: students.filter((s) => s.status === 'pending').length,
      in_progress: students.filter((s) => s.status === 'in_progress').length,
      avg_score: avgScore,
      pass_rate: passRate,
    },
  });
}

// ---- UPDATE ASSIGNMENT (SECURED) ----
async function handleUpdateAssignment(
  verifiedUser: VerifiedUser,
  body: {
    assignmentId: string;
    teacherId: string;
    title?: string;
    description?: string;
    config?: any;
    is_active?: boolean;
    addStudentIds?: string[];
    removeStudentIds?: string[];
  }
) {
  if (!requireTeacherOrAbove(verifiedUser)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { assignmentId, title, description, config, is_active, addStudentIds, removeStudentIds } = body;

  if (!assignmentId) {
    return NextResponse.json({ ok: false, msg: 'Dati mancanti' });
  }

  // Verify ownership (teacher must own the assignment, super_admin bypasses)
  const { data: existing, error: findError } = await supabase
    .from('assignments')
    .select('id, teacher_id')
    .eq('id', assignmentId)
    .single();

  if (findError || !existing) {
    return NextResponse.json({ ok: false, msg: 'Compito non trovato' });
  }
  if (verifiedUser.role === 'teacher' && existing.teacher_id !== verifiedUser.id) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  // Update assignment fields
  const updates: any = {};
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description?.trim() || null;
  if (config !== undefined) updates.config = config;
  if (is_active !== undefined) updates.is_active = is_active;

  if (Object.keys(updates).length > 0) {
    const { error: updateError } = await supabase
      .from('assignments')
      .update(updates)
      .eq('id', assignmentId);

    if (updateError) {
      console.error('Update assignment error:', updateError);
      return NextResponse.json({ ok: false, msg: "Errore nell'aggiornamento" }, { status: 500 });
    }
  }

  if (addStudentIds && addStudentIds.length > 0) {
    const newStudentRows = addStudentIds.map((sid) => ({
      assignment_id: assignmentId,
      student_id: sid,
      status: 'pending' as const,
    }));

    const { error: addError } = await supabase
      .from('assignment_students')
      .upsert(newStudentRows, { onConflict: 'assignment_id,student_id' });

    if (addError) {
      console.error('Add students error:', addError);
    }
  }

  if (removeStudentIds && removeStudentIds.length > 0) {
    const { error: removeError } = await supabase
      .from('assignment_students')
      .delete()
      .eq('assignment_id', assignmentId)
      .in('student_id', removeStudentIds);

    if (removeError) {
      console.error('Remove students error:', removeError);
    }
  }

  return NextResponse.json({ ok: true, msg: 'Compito aggiornato' });
}

// ---- DELETE ASSIGNMENT (SECURED) ----
async function handleDeleteAssignment(
  verifiedUser: VerifiedUser,
  body: {
    assignmentId: string;
    teacherId: string;
  }
) {
  if (!requireTeacherOrAbove(verifiedUser)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { assignmentId } = body;

  if (!assignmentId) {
    return NextResponse.json({ ok: false, msg: 'Dati mancanti' });
  }

  // Verify ownership
  const { data: existing, error: findError } = await supabase
    .from('assignments')
    .select('id, teacher_id')
    .eq('id', assignmentId)
    .single();

  if (findError || !existing) {
    return NextResponse.json({ ok: false, msg: 'Compito non trovato' });
  }
  if (verifiedUser.role === 'teacher' && existing.teacher_id !== verifiedUser.id) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { error: deleteError } = await supabase
    .from('assignments')
    .delete()
    .eq('id', assignmentId);

  if (deleteError) {
    console.error('Delete assignment error:', deleteError);
    return NextResponse.json({ ok: false, msg: "Errore nell'eliminazione del compito" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Compito eliminato' });
}

// ---- DEBUG ENDPOINT (temporary - remove after fixing) ----
async function handleDebug(user: VerifiedUser) {
  const results: Record<string, any> = { auth: { id: user.id, username: user.username, role: user.role } };

  // Test 1: Check if assignments table exists
  const { data: testData1, error: testError1 } = await supabase
    .from('assignments')
    .select('id')
    .limit(1);
  results.assignments_table = { data: testData1, error: testError1 ? { code: testError1.code, message: testError1.message, details: testError1.details } : null };

  // Test 2: Check if assignment_students table exists
  const { data: testData2, error: testError2 } = await supabase
    .from('assignment_students')
    .select('id')
    .limit(1);
  results.assignment_students_table = { data: testData2, error: testError2 ? { code: testError2.code, message: testError2.message, details: testError2.details } : null };

  // Test 3: Check if assignment_results table exists
  const { data: testData3, error: testError3 } = await supabase
    .from('assignment_results')
    .select('id')
    .limit(1);
  results.assignment_results_table = { data: testData3, error: testError3 ? { code: testError3.code, message: testError3.message, details: testError3.details } : null };

  // Test 4: Try simple insert into assignments
  const { data: testData4, error: testError4 } = await supabase
    .from('assignments')
    .insert({ teacher_id: user.id, title: '__debug_test__', config: { chapters: [1], number_of_questions: 1, time_limit_minutes: null, max_attempts: 1, mode: 'exam' }, is_active: false })
    .select('id');
  results.insert_test = { data: testData4, error: testError4 ? { code: testError4.code, message: testError4.message, details: testError4.details, hint: testError4.hint } : null };

  // Cleanup: delete the debug assignment if it was created
  if (testData4 && testData4.length > 0) {
    await supabase.from('assignments').delete().eq('id', testData4[0].id);
  }

  // Test 5: Check app_users id type
  const { data: testData5, error: testError5 } = await supabase
    .from('app_users')
    .select('id, username, role')
    .eq('role', 'student')
    .eq('is_active', true)
    .limit(2);
  results.students_sample = { data: testData5, error: testError5 ? { code: testError5.code, message: testError5.message } : null };

  return NextResponse.json({ ok: true, debug: results });
}
