// ============================================================
// API Route - Auth (login + user management via Supabase)
// All users persisted in app_users table
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Hardcoded admin (super admin)
const SUPER_ADMIN = { username: 'arkan', password: 'arkan1', role: 'admin' };

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
}

// POST /api/auth?action=login
// POST /api/auth?action=list_users
// POST /api/auth?action=add_user
// POST /api/auth?action=delete_user
// POST /api/auth?action=toggle_role
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
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

async function handleLogin(body: { username: string; password: string }) {
  const { username, password } = body;
  if (!username || !password) return NextResponse.json({ ok: false, msg: 'Missing credentials' });

  // Check super admin first
  if (username === SUPER_ADMIN.username && password === SUPER_ADMIN.password) {
    return NextResponse.json({
      ok: true,
      user: { id: 'super-admin', username: 'arkan', password_hash: '', role: 'admin', is_active: true, created_at: '' },
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
  }));

  // Add super admin to list
  users.unshift({
    id: 'super-admin',
    username: 'arkan',
    role: 'admin',
    is_active: true,
    created_at: new Date().toISOString(),
    password_hash: '',
  });

  return NextResponse.json({ ok: true, users });
}

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

  // Insert into Supabase
  const { error } = await supabase
    .from('app_users')
    .insert({
      username: username.toLowerCase(),
      password_hash: hash(password),
      role: role || 'user',
      is_active: true,
    });

  if (error) {
    console.error('Supabase add_user error:', error);
    // Check for unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
    }
    return NextResponse.json({ ok: false, msg: 'Errore nella creazione utente' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Utente creato con successo' });
}

async function handleDeleteUser(body: { userId: string; adminUsername: string }) {
  const { userId, adminUsername } = body;
  if (adminUsername !== SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' });
  }
  if (userId === 'super-admin') {
    return NextResponse.json({ ok: false, msg: 'Impossibile eliminare il super admin' });
  }

  // Soft delete: set is_active = false
  // userId could be the 'id' column or the 'username'
  const { data: user, error: findError } = await supabase
    .from('app_users')
    .select('*')
    .or(`id.eq.${userId},username.eq.${userId}`)
    .eq('is_active', true)
    .single();

  if (findError || !user) {
    return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
  }

  // Perform soft delete via username (primary key)
  const { error: deleteError } = await supabase
    .from('app_users')
    .update({ is_active: false })
    .eq('username', user.username);

  if (deleteError) {
    console.error('Supabase delete_user error:', deleteError);
    return NextResponse.json({ ok: false, msg: 'Errore nell\'eliminazione utente' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, msg: 'Utente eliminato' });
}

async function handleToggleRole(body: { userId: string; newRole: string; adminUsername: string }) {
  const { userId, newRole, adminUsername } = body;
  if (adminUsername !== SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' });
  }

  // userId could be the 'id' column or the 'username'
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
