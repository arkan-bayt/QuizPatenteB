// ============================================================
// API Route - Auth (login + user management via Supabase)
// Uses user_progress table to store user credentials (no app_users table)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://jdahzuhkwimridgskcqd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkYWh6dWhrd2ltcmlkZ3NrY3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODc1MDMsImV4cCI6MjA5Mjg2MzUwM30.XKIZZ_n_nb9evzwpBrLzIaFxu6I0nBi_MBlwW1V93zU';

function headers() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };
}

// Hardcoded admin (super admin)
const SUPER_ADMIN = { username: 'arkan', password: 'arkan1', role: 'admin' };

// Simple hash function (same as client-side)
function hash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; }
  return Math.abs(h).toString(36);
}

// In-memory user store (fallback when no table)
const memoryUsers: Record<string, { id: string; username: string; password_hash: string; role: string; is_active: boolean; created_at: string }> = {};
let usersLoaded = false;

interface AppUser {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

async function ensureUsersLoaded() {
  if (usersLoaded) return;
  usersLoaded = true;

  // Try to load users from quiz_sessions or user_progress - but these don't have user data
  // We'll use in-memory storage + super admin for now
  // Admin can add users through the panel (stored in memory)
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

  // Check memory users
  const user = memoryUsers[username.toLowerCase()];
  if (user && user.is_active && user.password_hash === hash(password)) {
    return NextResponse.json({ ok: true, user });
  }

  return NextResponse.json({ ok: false, msg: 'Username o password non corretti' });
}

async function handleListUsers() {
  const users = Object.values(memoryUsers).map(u => ({
    id: u.id,
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
  if (username === SUPER_ADMIN.username) return NextResponse.json({ ok: false, msg: 'Username gia esistente' });
  if (memoryUsers[username.toLowerCase()]) return NextResponse.json({ ok: false, msg: 'Username gia esistente' });

  memoryUsers[username.toLowerCase()] = {
    id: `user-${Date.now()}`,
    username: username.toLowerCase(),
    password_hash: hash(password),
    role: role || 'user',
    is_active: true,
    created_at: new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, msg: 'Utente creato con successo' });
}

async function handleDeleteUser(body: { userId: string; adminUsername: string }) {
  const { userId, adminUsername } = body;
  if (adminUsername !== SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' });
  }

  const entry = Object.entries(memoryUsers).find(([, u]) => u.id === userId);
  if (!entry) return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
  if (entry[1].username === SUPER_ADMIN.username) return NextResponse.json({ ok: false, msg: 'Impossibile eliminare il super admin' });

  delete memoryUsers[entry[0]];
  return NextResponse.json({ ok: true, msg: 'Utente eliminato' });
}

async function handleToggleRole(body: { userId: string; newRole: string; adminUsername: string }) {
  const { userId, newRole, adminUsername } = body;
  if (adminUsername !== SUPER_ADMIN.username) {
    return NextResponse.json({ ok: false, msg: 'Non autorizzato' });
  }

  for (const u of Object.values(memoryUsers)) {
    if (u.id === userId) {
      u.role = newRole;
      return NextResponse.json({ ok: true, msg: 'Ruolo aggiornato' });
    }
  }
  return NextResponse.json({ ok: false, msg: 'Utente non trovato' });
}
