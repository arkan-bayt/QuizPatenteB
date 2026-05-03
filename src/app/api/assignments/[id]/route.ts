// ============================================================
// API Route - Individual Assignment Operations (SECURED)
// POST /api/assignments/[id]?action=start|submit|status
// All actions require server-side session verification
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession } from '@/lib/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// POST /api/assignments/[id] (SECURED)
// ============================================================
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'start': return handleStartAssignment(user, id, body);
      case 'submit': return handleSubmitResult(user, id, body);
      case 'status': return handleGetStatus(user, id, body);
      case 'result': return handleGetResult(user, id, body);
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: any) {
    console.error('Assignment [id] POST error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// GET /api/assignments/[id] - Get single assignment details (SECURED)
// ============================================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Get assignment details
    const { data: assignment, error } = await supabase
      .from('assignments')
      .select(`
        *,
        teacher:app_users!assignments_teacher_id_fkey(id, username)
      `)
      .eq('id', id)
      .single();

    if (error || !assignment) {
      return NextResponse.json({ error: 'Compito non trovato' }, { status: 404 });
    }

    // Teachers can only access their own assignments
    if (user.role === 'teacher' && assignment.teacher_id !== user.id) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    const response: any = {
      ...assignment,
      teacher_username: assignment.teacher?.username || '',
      teacher: undefined,
    };

    // If student, get their status and best result
    if (user.role === 'student') {
      const { data: studentAssignment } = await supabase
        .from('assignment_students')
        .select('status, attempts, assigned_at')
        .eq('assignment_id', id)
        .eq('student_id', user.id)
        .single();

      if (!studentAssignment) {
        return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
      }

      response._student_status = studentAssignment.status;
      response._student_attempts = studentAssignment.attempts;
      response._student_assigned_at = studentAssignment.assigned_at;

      const { data: bestResult } = await supabase
        .from('assignment_results')
        .select('score, total_questions, correct_count, completed_at')
        .eq('assignment_id', id)
        .eq('student_id', user.id)
        .order('score', { ascending: false })
        .limit(1)
        .maybeSingle();

      response._best_result = bestResult || null;
    }

    return NextResponse.json({ ok: true, assignment: response });
  } catch (e: any) {
    console.error('Assignment [id] GET error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ---- START ASSIGNMENT (SECURED - student only) ----
async function handleStartAssignment(
  verifiedUser: { id: string; role: string },
  assignmentId: string,
  body: { studentId: string }
) {
  if (verifiedUser.role !== 'student') {
    return NextResponse.json({ ok: false, msg: 'Solo gli studenti possono iniziare compiti' }, { status: 403 });
  }

  const studentId = verifiedUser.id; // Always use verified user's ID

  if (!assignmentId) {
    return NextResponse.json({ ok: false, msg: 'Dati mancanti' });
  }

  const { data: assignment, error: aError } = await supabase
    .from('assignments')
    .select('id, config, is_active')
    .eq('id', assignmentId)
    .single();

  if (aError || !assignment) {
    return NextResponse.json({ ok: false, msg: 'Compito non trovato' });
  }

  if (!assignment.is_active) {
    return NextResponse.json({ ok: false, msg: 'Questo compito non e piu attivo' });
  }

  const { data: studentAssignment, error: saError } = await supabase
    .from('assignment_students')
    .select('id, status, attempts')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .single();

  if (saError || !studentAssignment) {
    return NextResponse.json({ ok: false, msg: 'Non sei assegnato a questo compito' });
  }

  const maxAttempts = assignment.config?.max_attempts || 1;

  if (studentAssignment.attempts >= maxAttempts) {
    return NextResponse.json({
      ok: false,
      msg: `Hai raggiunto il massimo di ${maxAttempts} tentativ${maxAttempts === 1 ? 'o' : 'i'}.`,
      canStart: false,
      status: studentAssignment.status,
      attempts: studentAssignment.attempts,
    });
  }

  if (studentAssignment.status === 'in_progress') {
    return NextResponse.json({
      ok: true,
      msg: 'Hai gia iniziato questo compito',
      alreadyStarted: true,
      status: studentAssignment.status,
      attempts: studentAssignment.attempts,
    });
  }

  const { error: updateError } = await supabase
    .from('assignment_students')
    .update({ status: 'in_progress' })
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId);

  if (updateError) {
    console.error('Start assignment error:', updateError);
    return NextResponse.json({ ok: false, msg: "Errore nell'avvio del compito" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    msg: 'Compito iniziato',
    started: true,
    status: 'in_progress',
    attempts: studentAssignment.attempts,
    config: assignment.config,
  });
}

// ---- SUBMIT RESULT (SECURED - student only) ----
async function handleSubmitResult(
  verifiedUser: { id: string; role: string },
  assignmentId: string,
  body: {
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
) {
  if (verifiedUser.role !== 'student') {
    return NextResponse.json({ ok: false, msg: 'Solo gli studenti possono inviare risultati' }, { status: 403 });
  }

  const studentId = verifiedUser.id; // Always use verified user's ID

  const {
    score, total_questions, correct_count,
    mistakes_count, time_taken_seconds, answers,
  } = body;

  if (!assignmentId) {
    return NextResponse.json({ ok: false, msg: 'Dati mancanti' });
  }

  if (total_questions === undefined || correct_count === undefined) {
    return NextResponse.json({ ok: false, msg: 'Dati del risultato incompleti' });
  }

  const { data: assignment, error: aError } = await supabase
    .from('assignments')
    .select('id, config, is_active')
    .eq('id', assignmentId)
    .single();

  if (aError || !assignment) {
    return NextResponse.json({ ok: false, msg: 'Compito non trovato' });
  }

  const { data: studentAssignment, error: saError } = await supabase
    .from('assignment_students')
    .select('id, status, attempts')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .single();

  if (saError || !studentAssignment) {
    return NextResponse.json({ ok: false, msg: 'Non sei assegnato a questo compito' });
  }

  const maxAttempts = assignment.config?.max_attempts || 1;
  const isPassed = score >= 60;

  let newStatus: string;
  if (isPassed || studentAssignment.attempts + 1 >= maxAttempts) {
    newStatus = 'completed';
  } else {
    newStatus = 'pending';
  }

  const { data: result, error: resultError } = await supabase
    .from('assignment_results')
    .insert({
      assignment_id: assignmentId,
      student_id: studentId,
      score,
      total_questions,
      correct_count,
      mistakes_count: mistakes_count || (total_questions - correct_count),
      time_taken_seconds: time_taken_seconds || 0,
      answers: answers || {},
    })
    .select('id, score, completed_at')
    .single();

  if (resultError) {
    console.error('Submit result error:', resultError);
    return NextResponse.json({ ok: false, msg: 'Errore nel salvataggio del risultato' }, { status: 500 });
  }

  const { error: updateError } = await supabase
    .from('assignment_students')
    .update({
      status: newStatus,
      attempts: studentAssignment.attempts + 1,
    })
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId);

  if (updateError) {
    console.error('Update student assignment error:', updateError);
  }

  return NextResponse.json({
    ok: true,
    msg: isPassed ? 'Complimenti! Quiz superato!' : 'Quiz completato. Punteggio insufficiente.',
    result: {
      id: result.id,
      score,
      total_questions,
      correct_count,
      passed: isPassed,
      completed_at: result.completed_at,
    },
    status: newStatus,
    attempts: studentAssignment.attempts + 1,
    canRetry: !isPassed && studentAssignment.attempts + 1 < maxAttempts,
  });
}

// ---- GET STATUS (SECURED) ----
async function handleGetStatus(
  verifiedUser: { id: string; role: string },
  assignmentId: string,
  body: { studentId: string }
) {
  const studentId = verifiedUser.role === 'student' ? verifiedUser.id : (body.studentId || verifiedUser.id);

  if (!assignmentId || !studentId) {
    return NextResponse.json({ ok: false, msg: 'Dati mancanti' });
  }

  // Students can only check their own status
  if (verifiedUser.role === 'student' && studentId !== verifiedUser.id) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  // owner_id not yet in DB — teacher isolation skipped

  const { data: studentAssignment, error } = await supabase
    .from('assignment_students')
    .select('status, attempts, assigned_at')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .single();

  if (error || !studentAssignment) {
    return NextResponse.json({ ok: false, msg: 'Non sei assegnato a questo compito' });
  }

  const { data: assignment } = await supabase
    .from('assignments')
    .select('config, is_active')
    .eq('id', assignmentId)
    .single();

  const maxAttempts = assignment?.config?.max_attempts || 1;
  const canRetry = studentAssignment.status === 'completed'
    ? studentAssignment.attempts < maxAttempts
    : studentAssignment.status !== 'expired';

  const { data: bestResult } = await supabase
    .from('assignment_results')
    .select('score, total_questions, correct_count, completed_at')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .order('score', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    ok: true,
    status: studentAssignment.status,
    attempts: studentAssignment.attempts,
    max_attempts: maxAttempts,
    assigned_at: studentAssignment.assigned_at,
    is_active: assignment?.is_active ?? true,
    canRetry,
    best_result: bestResult || null,
  });
}

// ---- GET RESULT (SECURED) ----
async function handleGetResult(
  verifiedUser: { id: string; role: string },
  assignmentId: string,
  body: {
    studentId: string;
    resultId?: string;
  }
) {
  const studentId = verifiedUser.role === 'student' ? verifiedUser.id : (body.studentId || verifiedUser.id);

  if (!assignmentId || !studentId) {
    return NextResponse.json({ ok: false, msg: 'Dati mancanti' });
  }

  // Students can only view their own results
  if (verifiedUser.role === 'student' && studentId !== verifiedUser.id) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  // owner_id not yet in DB — teacher isolation skipped

  const { data: results, error } = await supabase
    .from('assignment_results')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Get result error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento dei risultati' }, { status: 500 });
  }

  let targetResult;
  if (body.resultId) {
    targetResult = (results || []).find((r) => r.id === body.resultId);
  } else {
    targetResult = (results || [])[0] || null;
  }

  if (!targetResult) {
    return NextResponse.json({ ok: false, msg: 'Nessun risultato trovato' });
  }

  return NextResponse.json({
    ok: true,
    result: targetResult,
    all_results: results || [],
  });
}
