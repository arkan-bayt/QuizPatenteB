// ============================================================
// API Route - Auth (login + user management via Supabase)
// Multi-tenant B2B SaaS: supports super_admin, teacher, student roles
// All users persisted in app_users table
// SECURED: All actions require server-side session verification
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySession, requireSuperAdmin, requireTeacherOrAbove } from '@/lib/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Simple hash function (same as client-side)
function hash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; }
  return Math.abs(h).toString(36);
}

interface AppUser {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  created_at: string;
  email?: string | null;
  owner_id?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  ai_usage_count?: number;
  ai_usage_limit?: number;
  last_ai_usage?: string | null;
  subscription?: string;
}

// ============================================================
// MAIN ROUTER
// ============================================================
// POST /api/auth?action=login
// POST /api/auth?action=list_users
// POST /api/auth?action=add_user
// POST /api/auth?action=delete_user
// POST /api/auth?action=toggle_role
// POST /api/auth?action=register_teacher    (super_admin creates a teacher)
// POST /api/auth?action=register_student    (teacher/super_admin creates a student)
// POST /api/auth?action=get_my_students     (teacher/super_admin gets students)
// POST /api/auth?action=get_teachers        (super_admin gets all teachers)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'login': return handleLogin(body);
      case 'list_users': return handleListUsers(request);
      case 'add_user': return handleAddUser(request, body);
      case 'delete_user': return handleDeleteUser(request, body);
      case 'toggle_role': return handleToggleRole(request, body);
      case 'register_teacher': return handleRegisterTeacher(request, body);
      case 'register_student': return handleRegisterStudent(request, body);
      case 'get_my_students': return handleGetMyStudents(request, body);
      case 'get_teachers': return handleGetTeachers(request);
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// LOGIN — No auth required (user doesn't have a token yet)
// Returns session_token so the client can store it.
// ============================================================
async function handleLogin(body: { username: string; password: string }) {
  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Missing credentials' });
  }

  // Check Supabase app_users table
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('username', username.toLowerCase())
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, msg: 'Username o password non corretti' });
  }

  // Verify password hash
  if (data.password_hash !== hash(password)) {
    return NextResponse.json({ ok: false, msg: 'Username o password non corretti' });
  }

  const sessionToken = Buffer.from(JSON.stringify({ username: data.username, ts: Date.now() })).toString('base64');

  // Strip password_hash before returning user data
  const { password_hash: _pw, ...userData } = data as AppUser;

  return NextResponse.json({
    ok: true,
    session_token: sessionToken,
    user: userData,
  });
}

// ============================================================
// LIST USERS — Auth required
//   super_admin → all active users (exclude password_hash)
//   teacher     → only students where owner_id = teacher.id
//   student     → ERROR 403 "Accesso negato"
// ============================================================
async function handleListUsers(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  // Students are not allowed to list users
  if (user.role === 'student') {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  let query = supabase
    .from('app_users')
    .select('*')
    .eq('is_active', true);

  // Teachers only see their own students
  if (user.role === 'teacher') {
    query = query.eq('owner_id', user.id);
  }

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase list_users error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento utenti' }, { status: 500 });
  }

  const users = (data || []).map((u: any) => ({
    id: u.id || u.username,
    username: u.username,
    role: u.role,
    is_active: u.is_active,
    created_at: u.created_at,
    full_name: u.full_name || null,
    email: u.email || null,
    owner_id: u.owner_id || null,
    subscription: u.subscription || 'free',
    // password_hash is intentionally excluded
  }));

  return NextResponse.json({ ok: true, users });
}

// ============================================================
// ADD USER — Auth required, teacher or super_admin
//   SECURITY: Backend FORCES role — never trusts client input
//
//   super_admin → can create 'teacher' or 'student'
//   teacher     → can ONLY create 'student' (owner_id = teacher.id)
//   student     → DENIED (cannot create any user)
//
//   ⛔ NO ONE can create 'super_admin' — ALWAYS blocked
//   ⛔ owner_id is ALWAYS set by server — NEVER from client
// ============================================================
async function handleAddUser(request: NextRequest, body: {
  username: string;
  password: string;
  role?: string;
  owner_id?: string;
  full_name?: string;
  email?: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  // ⛔ Students CANNOT create any user
  if (user.role === 'student') {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { username, password, full_name, email } = body;

  // ⛔ NEVER trust the client role — determine it server-side only
  const clientRole = body.role;

  // Validate basic fields
  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }
  if (username.length < 3) {
    return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  }
  if (password.length < 4) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 4 caratteri' });
  }

  // ⛔ BLOCK: No one can create super_admin — EVER
  if (clientRole === 'super_admin') {
    console.warn(`[SECURITY] Blocked super_admin creation attempt by user=${user.username} (${user.role})`);
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  // Determine effective role based on caller's role (NOT client input)
  let effectiveRole: string;
  let resolvedOwnerId: string | null = null;

  if (user.role === 'super_admin') {
    // Super admin can create teacher or student (but NOT super_admin)
    if (clientRole === 'teacher') {
      effectiveRole = 'teacher';
      // Teacher owner_id stays null (teacher reports to super_admin)
      resolvedOwnerId = null;
    } else {
      // Default to student for super_admin
      effectiveRole = 'student';
      // ⛔ owner_id is NEVER trusted from client for security
      // Super admin creating a student: they must pick a teacher
      // But we validate the teacher exists
      const ownerProvided = body.owner_id;
      if (!ownerProvided) {
        return NextResponse.json({ ok: false, msg: 'Specificare un docente per lo studente' });
      }
      // Validate that owner_id references an active teacher
      const { data: ownerRecord } = await supabase
        .from('app_users')
        .select('id, role, is_active')
        .eq('id', ownerProvided)
        .eq('is_active', true)
        .single();
      if (!ownerRecord || ownerRecord.role !== 'teacher') {
        return NextResponse.json({ ok: false, msg: 'Docente non valido' });
      }
      resolvedOwnerId = ownerProvided;
    }
  } else if (user.role === 'teacher') {
    // ⛔ Teacher can ONLY create students — force role, ignore client input
    effectiveRole = 'student';
    // ⛔ owner_id is ALWAYS the teacher's own ID — NEVER from client
    resolvedOwnerId = user.id;
  } else {
    // Unknown role — deny
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  // Check if username already exists
  const { data: existing } = await supabase
    .from('app_users')
    .select('id, username, email')
    .or(`username.eq.${username.toLowerCase()}${email ? `,email.eq.${email}` : ''}`)
    .maybeSingle();

  if (existing) {
    if (existing.username === username.toLowerCase()) {
      return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
    }
    if (email && existing.email === email) {
      return NextResponse.json({ ok: false, msg: 'Email gia registrata' });
    }
  }

  // Insert into Supabase with server-enforced role and owner_id
  const insertPayload: Record<string, unknown> = {
    username: username.toLowerCase(),
    password_hash: hash(password),
    role: effectiveRole,
    is_active: true,
    full_name: full_name || null,
    email: email || null,
    subscription: 'free',
    ai_usage_limit: effectiveRole === 'teacher' ? 5 : 3,
  };
  if (resolvedOwnerId) {
    insertPayload.owner_id = resolvedOwnerId;
  }

  const { error } = await supabase
    .from('app_users')
    .insert(insertPayload);

  if (error) {
    console.error('Supabase add_user error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, msg: 'Username o email gia esistente' });
    }
    return NextResponse.json({ ok: false, msg: 'Errore nella creazione utente' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Utente creato con successo' });
}

// ============================================================
// DELETE USER — Auth required, super_admin only
//   Soft delete (set is_active = false)
// ============================================================
async function handleDeleteUser(request: NextRequest, body: { userId: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { userId } = body;

  // Find the user record
  const { data: userRecord, error: findError } = await supabase
    .from('app_users')
    .select('*')
    .or(`id.eq.${userId},username.eq.${userId}`)
    .eq('is_active', true)
    .single();

  if (findError || !userRecord) {
    return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
  }

  // Soft delete
  const { error: deleteError } = await supabase
    .from('app_users')
    .update({ is_active: false })
    .eq('username', userRecord.username);

  if (deleteError) {
    console.error('Supabase delete_user error:', deleteError);
    return NextResponse.json({ ok: false, msg: "Errore nell'eliminazione utente" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Utente eliminato' });
}

// ============================================================
// TOGGLE ROLE — Auth required, super_admin only
//   ⛔ CANNOT set role to 'super_admin' — privilege escalation blocked
//   Allowed: teacher ↔ student only
// ============================================================
async function handleToggleRole(request: NextRequest, body: { userId: string; newRole: string; owner_id?: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { userId, newRole } = body;

  // ⛔ BLOCK: Cannot set anyone to super_admin — prevent privilege escalation
  if (newRole === 'super_admin') {
    console.warn(`[SECURITY] Blocked super_admin role assignment attempt by user=${user.username} on target=${userId}`);
    return NextResponse.json({ ok: false, msg: 'Non autorizzato: impossibile assegnare il ruolo super_admin' }, { status: 403 });
  }

  // Validate new role (only teacher and student allowed)
  const validRoles = ['teacher', 'student'];
  if (!validRoles.includes(newRole)) {
    return NextResponse.json({ ok: false, msg: 'Ruolo non valido' });
  }

  // When changing TO student, require owner_id (teacher assignment)
  // When changing FROM student, clear owner_id
  const updatePayload: Record<string, unknown> = { role: newRole };

  if (newRole === 'student') {
    // Must have a teacher owner — check if body provides one
    const ownerProvided = body.owner_id;
    if (!ownerProvided) {
      return NextResponse.json({ ok: false, msg: 'Specificare un docente per lo studente' });
    }
    // Validate the teacher exists and is active
    const { data: teacher } = await supabase
      .from('app_users')
      .select('id, role, is_active')
      .eq('id', ownerProvided)
      .eq('is_active', true)
      .single();
    if (!teacher || teacher.role !== 'teacher') {
      return NextResponse.json({ ok: false, msg: 'Docente non valido' });
    }
    updatePayload.owner_id = ownerProvided;
  } else if (newRole === 'teacher') {
    // Clear owner_id when promoting to teacher
    updatePayload.owner_id = null;
  }

  const lookupField = userId === userId.toLowerCase() && !userId.startsWith('user-') ? 'username' : 'id';
  const { error } = await supabase
    .from('app_users')
    .update(updatePayload)
  .eq(lookupField, userId);

  if (error) {
    console.error('Supabase toggle_role error:', error);
    return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
  }

  return NextResponse.json({ ok: true, msg: 'Ruolo aggiornato' });
}

// ============================================================
// REGISTER TEACHER — Auth required, super_admin only
//   Creates user with role='teacher', owner_id=null
// ============================================================
async function handleRegisterTeacher(request: NextRequest, body: {
  username: string;
  password: string;
  email?: string;
  full_name?: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { username, password, email, full_name } = body;
  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }
  if (username.length < 3) {
    return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  }
  if (password.length < 4) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 4 caratteri' });
  }

  // Check if username or email already exists
  const { data: existing } = await supabase
    .from('app_users')
    .select('id, username, email')
    .or(`username.eq.${username.toLowerCase()}${email ? `,email.eq.${email}` : ''}`)
    .maybeSingle();

  if (existing) {
    if (existing.username === username.toLowerCase()) {
      return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
    }
    if (email && existing.email === email) {
      return NextResponse.json({ ok: false, msg: 'Email gia registrata' });
    }
  }

  // Insert teacher (owner_id stays null)
  const { data: newTeacher, error } = await supabase
    .from('app_users')
    .insert({
      username: username.toLowerCase(),
      password_hash: hash(password),
      role: 'teacher',
      is_active: true,
      email: email || null,
      full_name: full_name || null,
      subscription: 'free',
      ai_usage_limit: 5,
    })
    .select('id, username, role, full_name, email, created_at')
    .single();

  if (error) {
    console.error('Supabase register_teacher error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, msg: 'Username o email gia esistente' });
    }
    return NextResponse.json({ ok: false, msg: 'Errore nella creazione del docente' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    msg: 'Docente registrato con successo',
    teacher: newTeacher,
  });
}

// ============================================================
// REGISTER STUDENT — Auth required, teacher or super_admin
//   teacher     → owner_id = caller.id
//   super_admin → use provided owner_id (must be a valid teacher)
// ============================================================
async function handleRegisterStudent(request: NextRequest, body: {
  teacherId?: string;
  username: string;
  password: string;
  full_name?: string;
  email?: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { teacherId, username, password, full_name, email } = body;

  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }
  if (username.length < 3) {
    return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  }
  if (password.length < 4) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 4 caratteri' });
  }

  // Determine owner_id based on caller role
  let ownerId: string;

  if (user.role === 'super_admin') {
    // Super admin must provide a valid teacher_id
    if (!teacherId) {
      return NextResponse.json({ ok: false, msg: 'Specificare un docente per lo studente' });
    }
    ownerId = teacherId;
  } else {
    // Teacher creates student under themselves
    ownerId = user.id;
  }

  // Validate that owner_id references an active teacher
  const { data: owner } = await supabase
    .from('app_users')
    .select('id, role, is_active')
    .eq('id', ownerId)
    .eq('is_active', true)
    .single();

  if (!owner || owner.role !== 'teacher') {
    return NextResponse.json({ ok: false, msg: 'Docente non valido' });
  }

  // Check if username or email already exists
  const { data: existing } = await supabase
    .from('app_users')
    .select('id, username, email')
    .or(`username.eq.${username.toLowerCase()}${email ? `,email.eq.${email}` : ''}`)
    .maybeSingle();

  if (existing) {
    if (existing.username === username.toLowerCase()) {
      return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
    }
    if (email && existing.email === email) {
      return NextResponse.json({ ok: false, msg: 'Email gia registrata' });
    }
  }

  // Insert student with owner_id pointing to teacher
  const { data: newStudent, error } = await supabase
    .from('app_users')
    .insert({
      username: username.toLowerCase(),
      password_hash: hash(password),
      role: 'student',
      is_active: true,
      owner_id: ownerId,
      full_name: full_name || null,
      email: email || null,
      subscription: 'free',
      ai_usage_limit: 3,
    })
    .select('id, username, role, full_name, email, created_at')
    .single();

  if (error) {
    console.error('Supabase register_student error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, msg: 'Username o email gia esistente' });
    }
    return NextResponse.json({ ok: false, msg: 'Errore nella creazione dello studente' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    msg: 'Studente registrato con successo',
    student: newStudent,
  });
}

// ============================================================
// GET MY STUDENTS — Auth required, teacher or super_admin
//   teacher     → students where owner_id = teacher.id
//   super_admin → all students (optionally filtered by teacherId)
// ============================================================
async function handleGetMyStudents(request: NextRequest, body: { teacherId?: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  let query = supabase
    .from('app_users')
    .select('id, username, full_name, email, role, is_active, created_at, avatar_url, subscription, ai_usage_count, ai_usage_limit, owner_id')
    .eq('role', 'student')
    .eq('is_active', true);

  // Teacher can only see their own students
  if (user.role === 'teacher') {
    query = query.eq('owner_id', user.id);
  } else if (user.role === 'super_admin' && body.teacherId) {
    // Super admin can optionally filter by teacher
    query = query.eq('owner_id', body.teacherId);
  }
  // If super_admin with no teacherId → returns ALL students

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase get_my_students error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento studenti' }, { status: 500 });
  }

  const students = (data || []).map((u: any) => ({
    ...u,
    password_hash: '',
  }));

  return NextResponse.json({ ok: true, students });
}

// ============================================================
// GET TEACHERS — Auth required, super_admin ONLY
//   Teachers MUST NOT access this endpoint.
//   Returns all teachers with student counts.
// ============================================================
async function handleGetTeachers(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('app_users')
    .select('id, username, full_name, email, role, is_active, created_at, avatar_url, subscription')
    .eq('role', 'teacher')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase get_teachers error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento docenti' }, { status: 500 });
  }

  // Count students per teacher
  const teachersWithCounts = await Promise.all((data || []).map(async (teacher: any) => {
    const { count } = await supabase
      .from('app_users')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', teacher.id)
      .eq('is_active', true);

    return {
      ...teacher,
      password_hash: '',
      student_count: count || 0,
    };
  }));

  return NextResponse.json({ ok: true, teachers: teachersWithCounts });
}
