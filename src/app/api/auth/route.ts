// ============================================================
// API Route - Auth (login + user management via Supabase)
// Multi-tenant B2B SaaS: supports super_admin, teacher, student roles
// SECURED: bcrypt password hashing, JWT session tokens, no debug endpoints
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { verifySession, createSessionToken, requireSuperAdmin, requireTeacherOrAbove } from '@/lib/auth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface AppUser {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  created_at: string;
  owner_id?: string | null;
  full_name?: string | null;
  subscription_tier?: string;
}

// ============================================================
// MAIN ROUTER
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'login': return handleLogin(body);
      case 'list_users': return handleListUsers(request);
      case 'add_user': return handleAddUser(request, body);
      case 'delete_user': return handleDeleteUser(request, body);
      case 'toggle_active': return handleToggleActive(request, body);
      case 'toggle_role': return handleToggleRole(request, body);
      case 'register_teacher': return handleRegisterTeacher(request, body);
      case 'register_student': return handleRegisterStudent(request, body);
      case 'get_my_students': return handleGetMyStudents(request, body);
      case 'get_teachers': return handleGetTeachers(request);
      case 'change_password': return handleChangePassword(request, body);
      case 'check_subscription': return handleCheckSubscription(request);
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// LOGIN — No auth required (user doesn't have a token yet)
// Returns JWT session_token so the client can store it.
// Supports legacy base64 tokens during migration.
// ============================================================
async function handleLogin(body: { username: string; password: string }) {
  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Missing credentials' });
  }

  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('username', username.toLowerCase())
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, msg: 'Username o password non corretti' });
  }

  // Support both bcrypt hashes and legacy simple hashes during migration
  let passwordValid = false;
  const storedHash = data.password_hash;

  if (storedHash.startsWith('$2')) {
    // bcrypt hash — use bcrypt comparison
    passwordValid = await bcrypt.compare(password, storedHash);
  } else {
    // Legacy simple hash — verify and upgrade to bcrypt
    const legacyHash = legacyHashFn(password);
    passwordValid = storedHash === legacyHash;

    if (passwordValid) {
      // Auto-upgrade: re-hash with bcrypt and save
      const newHash = await bcrypt.hash(password, 12);
      await supabase
        .from('app_users')
        .update({ password_hash: newHash })
        .eq('username', data.username);
    }
  }

  if (!passwordValid) {
    return NextResponse.json({ ok: false, msg: 'Username o password non corretti' });
  }

  // Create JWT session token
  const sessionToken = createSessionToken({
    username: data.username,
    role: data.role,
    subscription_tier: data.subscription_tier || 'free',
  });

  // Strip password_hash before returning user data
  const { password_hash: _pw, ...userData } = data as AppUser;

  return NextResponse.json({
    ok: true,
    session_token: sessionToken,
    user: userData,
  });
}

// Legacy hash function (for backward compatibility during migration)
function legacyHashFn(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; }
  return Math.abs(h).toString(36);
}

// ============================================================
// CHANGE PASSWORD — Auth required
// ============================================================
async function handleChangePassword(request: NextRequest, body: { current_password: string; new_password: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  const { current_password, new_password } = body;
  if (!current_password || !new_password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi' });
  }
  if (new_password.length < 6) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 6 caratteri' });
  }

  // Verify current password
  const { data } = await supabase
    .from('app_users')
    .select('password_hash')
    .eq('username', user.username)
    .single();

  if (!data) {
    return NextResponse.json({ ok: false, msg: 'Errore' }, { status: 500 });
  }

  let currentValid = false;
  if (data.password_hash.startsWith('$2')) {
    currentValid = await bcrypt.compare(current_password, data.password_hash);
  } else {
    currentValid = data.password_hash === legacyHashFn(current_password);
  }

  if (!currentValid) {
    return NextResponse.json({ ok: false, msg: 'Password attuale non corretta' });
  }

  // Update to bcrypt hash
  const newHash = await bcrypt.hash(new_password, 12);
  const { error } = await supabase
    .from('app_users')
    .update({ password_hash: newHash })
    .eq('username', user.username);

  if (error) {
    return NextResponse.json({ ok: false, msg: 'Errore aggiornamento password' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Password aggiornata con successo' });
}

// ============================================================
// CHECK SUBSCRIPTION — Auth required
// Returns subscription status
// ============================================================
async function handleCheckSubscription(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    subscription_tier: user.subscription_tier,
    is_premium: user.subscription_tier === 'premium' || user.role === 'super_admin',
    free_daily_limit: parseInt(process.env.NEXT_PUBLIC_FREE_DAILY_QUESTIONS || '50'),
  });
}

// ============================================================
// LIST USERS — Auth required
// ============================================================
async function handleListUsers(request: NextRequest) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  if (user.role === 'student') {
    return NextResponse.json({ error: 'Accesso negato' }, { status: 403 });
  }

  let query = supabase
    .from('app_users')
    .select('*')
    .eq('is_active', true);

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
    subscription_tier: u.subscription_tier || 'free',
  }));

  return NextResponse.json({ ok: true, users });
}

// ============================================================
// ADD USER — Auth required, teacher or super_admin
// ============================================================
async function handleAddUser(request: NextRequest, body: {
  username: string;
  password: string;
  role?: string;
  full_name?: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  if (user.role === 'student') {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { username, password, full_name } = body;
  const clientRole = body.role;

  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }
  if (username.length < 3) {
    return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 6 caratteri' });
  }

  if (clientRole === 'super_admin') {
    console.warn(`[SECURITY] Blocked super_admin creation attempt by user=${user.username} (${user.role})`);
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  let effectiveRole: string;
  if (user.role === 'super_admin') {
    effectiveRole = clientRole === 'teacher' ? 'teacher' : 'student';
  } else if (user.role === 'teacher') {
    effectiveRole = 'student';
  } else {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { data: existing } = await supabase
    .from('app_users')
    .select('id, username')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
  }

  // Use bcrypt for new passwords
  const hashedPassword = await bcrypt.hash(password, 12);

  const insertPayload: Record<string, unknown> = {
    username: username.toLowerCase(),
    password_hash: hashedPassword,
    role: effectiveRole,
    is_active: true,
    subscription_tier: 'free',
  };

  const { error } = await supabase
    .from('app_users')
    .insert(insertPayload);

  if (error) {
    console.error('Supabase add_user error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
    }
    return NextResponse.json({ ok: false, msg: 'Errore nella creazione utente' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Utente creato con successo' });
}

// ============================================================
// DELETE USER — Auth required, super_admin only
// ============================================================
async function handleDeleteUser(request: NextRequest, body: { user_id?: string; userId?: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const userId = body.user_id || body.userId;
  if (!userId) {
    return NextResponse.json({ ok: false, msg: 'ID utente mancante' });
  }

  const lookupField = (String(userId) === String(userId).toLowerCase() && !String(userId).match(/^\d+$/)) ? 'username' : 'id';

  const { data: userRecord, error: findError } = await supabase
    .from('app_users')
    .select('*')
    .eq(lookupField, userId)
    .eq('is_active', true)
    .single();

  if (findError || !userRecord) {
    return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
  }

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
// TOGGLE ACTIVE — Auth required, super_admin only
// ============================================================
async function handleToggleActive(request: NextRequest, body: { user_id?: string; userId?: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const targetId = body.user_id || body.userId;
  if (!targetId) {
    return NextResponse.json({ ok: false, msg: 'ID utente mancante' });
  }

  const lookupField = (String(targetId) === String(targetId).toLowerCase() && !String(targetId).match(/^\d+$/)) ? 'username' : 'id';

  const { data: targetUser, error: findError } = await supabase
    .from('app_users')
    .select('id, username, is_active')
    .eq(lookupField, targetId)
    .single();

  if (findError || !targetUser) {
    return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
  }

  const newActiveState = !targetUser.is_active;

  const { error: updateError } = await supabase
    .from('app_users')
    .update({ is_active: newActiveState })
    .eq('username', targetUser.username);

  if (updateError) {
    console.error('Supabase toggle_active error:', updateError);
    return NextResponse.json({ ok: false, msg: 'Errore aggiornamento stato' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    msg: newActiveState ? 'Utente riattivato' : 'Utente disattivato',
  });
}

// ============================================================
// TOGGLE ROLE — Auth required, super_admin only
// ============================================================
async function handleToggleRole(request: NextRequest, body: { user_id?: string; userId?: string; new_role?: string; newRole?: string }) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const userId = body.user_id || body.userId;
  const newRole = body.new_role || body.newRole;

  if (newRole === 'super_admin') {
    console.warn(`[SECURITY] Blocked super_admin role assignment attempt by user=${user.username} on target=${userId}`);
    return NextResponse.json({ ok: false, msg: 'Non autorizzato: impossibile assegnare il ruolo super_admin' }, { status: 403 });
  }

  const validRoles = ['teacher', 'student'];
  if (!newRole || !validRoles.includes(newRole)) {
    return NextResponse.json({ ok: false, msg: 'Ruolo non valido' });
  }

  if (!userId) {
    return NextResponse.json({ ok: false, msg: 'ID utente mancante' });
  }

  const lookupField = userId === userId.toLowerCase() && !userId.startsWith('user-') ? 'username' : 'id';
  const { error } = await supabase
    .from('app_users')
    .update({ role: newRole })
    .eq(lookupField, userId);

  if (error) {
    console.error('Supabase toggle_role error:', error);
    return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
  }

  return NextResponse.json({ ok: true, msg: 'Ruolo aggiornato' });
}

// ============================================================
// REGISTER TEACHER — Auth required, super_admin only
// ============================================================
async function handleRegisterTeacher(request: NextRequest, body: {
  username: string;
  password: string;
  full_name?: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireSuperAdmin(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }
  if (username.length < 3) {
    return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 6 caratteri' });
  }

  const { data: existing } = await supabase
    .from('app_users')
    .select('id, username')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data: newTeacher, error } = await supabase
    .from('app_users')
    .insert({
      username: username.toLowerCase(),
      password_hash: hashedPassword,
      role: 'teacher',
      is_active: true,
      subscription_tier: 'premium',
    })
    .select('id, username, role, created_at')
    .single();

  if (error) {
    console.error('Supabase register_teacher error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
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
// ============================================================
async function handleRegisterStudent(request: NextRequest, body: {
  username: string;
  password: string;
  full_name?: string;
}) {
  const user = await verifySession(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (!requireTeacherOrAbove(user)) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' }, { status: 403 });
  }

  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }
  if (username.length < 3) {
    return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  }
  if (password.length < 6) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 6 caratteri' });
  }

  const { data: existing } = await supabase
    .from('app_users')
    .select('id, username')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data: newStudent, error } = await supabase
    .from('app_users')
    .insert({
      username: username.toLowerCase(),
      password_hash: hashedPassword,
      role: 'student',
      is_active: true,
      subscription_tier: 'free',
    })
    .select('id, username, role, created_at')
    .single();

  if (error) {
    console.error('Supabase register_student error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
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
    .select('id, username, role, is_active, created_at, class_id, subscription_tier')
    .eq('role', 'student')
    .eq('is_active', true);

  const { data, error } = await query.order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase get_my_students error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento studenti' }, { status: 500 });
  }

  const students = (data || []).map((u: any) => ({
    ...u,
    password_hash: '',
    class_id: u.class_id || null,
    subscription_tier: u.subscription_tier || 'free',
  }));

  return NextResponse.json({ ok: true, students });
}

// ============================================================
// GET TEACHERS — Auth required, super_admin ONLY
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
    .select('id, username, role, is_active, created_at')
    .eq('role', 'teacher')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Supabase get_teachers error:', error);
    return NextResponse.json({ ok: false, msg: 'Errore nel caricamento docenti' }, { status: 500 });
  }

  const teachersWithCounts = await Promise.all((data || []).map(async (teacher: any) => {
    const { count } = await supabase
      .from('app_users')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student')
      .eq('is_active', true);

    return {
      ...teacher,
      password_hash: '',
      student_count: count || 0,
    };
  }));

  return NextResponse.json({ ok: true, teachers: teachersWithCounts });
}
