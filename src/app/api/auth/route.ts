// ============================================================
// API Route - Auth (login + user management via Supabase)
// Multi-tenant B2B SaaS: supports super_admin, teacher, student roles
// All users persisted in app_users table
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Hardcoded admin (super admin)
const SUPER_ADMIN = { username: 'arkan', password: 'arkan1', role: 'super_admin' };

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

// POST /api/auth?action=login
// POST /api/auth?action=list_users
// POST /api/auth?action=add_user
// POST /api/auth?action=delete_user
// POST /api/auth?action=toggle_role
// POST /api/auth?action=register_teacher    (super_admin creates a teacher)
// POST /api/auth?action=register_student    (teacher creates a student)
// POST /api/auth?action=get_my_students     (teacher gets their students)
// POST /api/auth?action=get_teachers        (super_admin gets all teachers)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'login': return handleLogin(body);
      case 'list_users': return handleListUsers();
      case 'add_user': return handleAddUser(body);
      case 'delete_user': return handleDeleteUser(body);
      case 'toggle_role': return handleToggleRole(body);
      case 'register_teacher': return handleRegisterTeacher(body);
      case 'register_student': return handleRegisterStudent(body);
      case 'get_my_students': return handleGetMyStudents(body);
      case 'get_teachers': return handleGetTeachers();
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ---- LOGIN ----
async function handleLogin(body: { username: string; password: string }) {
  const { username, password } = body;
  if (!username || !password) return NextResponse.json({ ok: false, msg: 'Missing credentials' });

  // Check super admin first
  if (username === SUPER_ADMIN.username && password === SUPER_ADMIN.password) {
    return NextResponse.json({
      ok: true,
      user: {
        id: 'super-admin', username: 'arkan', password_hash: '', role: 'super_admin',
        is_active: true, created_at: '', subscription: 'pro',
        full_name: 'Super Admin', email: null, owner_id: null,
        ai_usage_count: 0, ai_usage_limit: 999, last_ai_usage: null,
      },
    });
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

  return NextResponse.json({ ok: true, user: data as AppUser });
}

// ---- LIST USERS ----
async function handleListUsers() {
  const { data, error } = await supabase
    .from('app_users')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

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
    password_hash: '',
    full_name: u.full_name || null,
    email: u.email || null,
    owner_id: u.owner_id || null,
    subscription: u.subscription || 'free',
  }));

  // Add super admin to list
  users.unshift({
    id: 'super-admin',
    username: 'arkan',
    role: 'super_admin',
    is_active: true,
    created_at: new Date().toISOString(),
    password_hash: '',
    full_name: 'Super Admin',
    email: null,
    owner_id: null,
    subscription: 'pro',
  });

  return NextResponse.json({ ok: true, users });
}

// ---- ADD USER (legacy - super_admin only) ----
async function handleAddUser(body: { username: string; password: string; role: string; adminUsername: string }) {
  const { username, password, role, adminUsername } = body;

  // Only admin can add users
  if (adminUsername !== SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' });
  }
  if (!username || !password) return NextResponse.json({ ok: false, msg: 'Compila tutti i campi' });
  if (username.length < 3) return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  if (password.length < 4) return NextResponse.json({ ok: false, msg: 'Password minimo 4 caratteri' });
  if (username.toLowerCase() === SUPER_ADMIN.username) return NextResponse.json({ ok: false, msg: 'Username gia esistente' });

  // Check if username already exists in Supabase
  const { data: existing } = await supabase
    .from('app_users')
    .select('username')
    .eq('username', username.toLowerCase())
    .single();

  if (existing) {
    return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
  }

  // Map legacy roles to new roles
  const mappedRole = role === 'admin' ? 'super_admin' : role === 'user' ? 'student' : role;

  // Insert into Supabase
  const { error } = await supabase
    .from('app_users')
    .insert({
      username: username.toLowerCase(),
      password_hash: hash(password),
      role: mappedRole || 'student',
      is_active: true,
    });

  if (error) {
    console.error('Supabase add_user error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
    }
    return NextResponse.json({ ok: false, msg: 'Errore nella creazione utente' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Utente creato con successo' });
}

// ---- DELETE USER (super_admin only) ----
async function handleDeleteUser(body: { userId: string; adminUsername: string }) {
  const { userId, adminUsername } = body;
  if (adminUsername !== SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' });
  }
  if (userId === 'super-admin') {
    return NextResponse.json({ ok: false, msg: 'Impossibile eliminare il super admin' });
  }

  const { data: user, error: findError } = await supabase
    .from('app_users')
    .select('*')
    .or(`id.eq.${userId},username.eq.${userId}`)
    .eq('is_active', true)
    .single();

  if (findError || !user) {
    return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
  }

  const { error: deleteError } = await supabase
    .from('app_users')
    .update({ is_active: false })
    .eq('username', user.username);

  if (deleteError) {
    console.error('Supabase delete_user error:', deleteError);
    return NextResponse.json({ ok: false, msg: "Errore nell'eliminazione utente" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Utente eliminato' });
}

// ---- TOGGLE ROLE (super_admin only) ----
async function handleToggleRole(body: { userId: string; newRole: string; adminUsername: string }) {
  const { userId, newRole, adminUsername } = body;
  if (adminUsername !== SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' });
  }

  // Validate new role
  const validRoles = ['super_admin', 'teacher', 'student'];
  if (!validRoles.includes(newRole)) {
    return NextResponse.json({ ok: false, msg: 'Ruolo non valido' });
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

// ---- REGISTER TEACHER (super_admin creates a teacher) ----
async function handleRegisterTeacher(body: {
  adminUsername: string;
  username: string;
  password: string;
  email?: string;
  full_name?: string;
}) {
  const { adminUsername, username, password, email, full_name } = body;

  // Only super_admin can register teachers
  if (adminUsername !== SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' });
  }
  if (!username || !password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }
  if (username.length < 3) {
    return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  }
  if (password.length < 4) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 4 caratteri' });
  }
  if (username.toLowerCase() === SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
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

  // Insert teacher
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

// ---- REGISTER STUDENT (teacher creates a student under them) ----
async function handleRegisterStudent(body: {
  teacherId: string;
  username: string;
  password: string;
  full_name?: string;
  email?: string;
}) {
  const { teacherId, username, password, full_name, email } = body;

  if (!teacherId || !username || !password) {
    return NextResponse.json({ ok: false, msg: 'Compila tutti i campi obbligatori' });
  }
  if (username.length < 3) {
    return NextResponse.json({ ok: false, msg: 'Username minimo 3 caratteri' });
  }
  if (password.length < 4) {
    return NextResponse.json({ ok: false, msg: 'Password minimo 4 caratteri' });
  }

  // Verify teacher exists and is active
  const { data: teacher, error: teacherError } = await supabase
    .from('app_users')
    .select('id, role, is_active')
    .eq('id', teacherId)
    .eq('is_active', true)
    .single();

  if (teacherError || !teacher) {
    return NextResponse.json({ ok: false, msg: 'Docente non trovato' });
  }
  if (teacher.role !== 'teacher' && teacher.role !== 'super_admin') {
    return NextResponse.json({ ok: false, msg: 'Solo i docenti possono creare studenti' });
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
      owner_id: teacherId,
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

// ---- GET MY STUDENTS (teacher gets their students) ----
async function handleGetMyStudents(body: { teacherId: string }) {
  const { teacherId } = body;

  if (!teacherId) {
    return NextResponse.json({ ok: false, msg: 'ID docente mancante' });
  }

  const { data, error } = await supabase
    .from('app_users')
    .select('id, username, full_name, email, role, is_active, created_at, avatar_url, subscription, ai_usage_count, ai_usage_limit')
    .eq('owner_id', teacherId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

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

// ---- GET TEACHERS (super_admin gets all teachers) ----
async function handleGetTeachers() {
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
