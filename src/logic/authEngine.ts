// ============================================================
// LOGIC - Multi-user Auth via API
// ============================================================
import { AppUser } from '@/data/supabaseClient';

// Hardcoded super admin (fallback when API unavailable)
const SUPER_ADMIN: AppUser = { id: 'super-admin', username: 'arkan', password_hash: '', role: 'super_admin', is_active: true, created_at: '' };

// Login via API
export async function login(username: string, password: string): Promise<{ ok: boolean; msg: string; user?: AppUser; session_token?: string }> {
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password }),
    });
    const data = await res.json();
    if (data.ok && data.user) {
      return { ok: true, msg: 'OK', user: data.user as AppUser, session_token: data.session_token };
    }
    return { ok: false, msg: data.msg || 'Username o password non corretti' };
  } catch {
    // Fallback: check super admin locally
    if (username === 'arkan' && password === 'arkan1') {
      return { ok: true, msg: 'OK', user: SUPER_ADMIN };
    }
    return { ok: false, msg: 'Errore di connessione. Riprova.' };
  }
}

// Get all users via API
export async function getAllUsers(): Promise<AppUser[]> {
  try {
    const token = getSessionToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'list_users' }),
    });
    const data = await res.json();
    if (data.ok && data.users) return data.users as AppUser[];
    return [];
  } catch {
    return [SUPER_ADMIN];
  }
}

// Add user via API
export async function addUser(username: string, password: string, role: 'admin' | 'user' = 'user', adminUsername?: string): Promise<{ ok: boolean; msg: string }> {
  if (!username.trim() || !password.trim()) return { ok: false, msg: 'Compila tutti i campi' };
  if (username.length < 3) return { ok: false, msg: 'Username minimo 3 caratteri' };
  if (password.length < 4) return { ok: false, msg: 'Password minimo 4 caratteri' };
  try {
    const token = getSessionToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'add_user', username, password, role, adminUsername }),
    });
    const data = await res.json();
    return { ok: data.ok, msg: data.msg || 'Errore' };
  } catch {
    return { ok: false, msg: 'Errore di connessione' };
  }
}

// Update user role via API
export async function updateUserRole(userId: string, role: 'admin' | 'user', adminUsername?: string): Promise<{ ok: boolean; msg: string }> {
  try {
    const token = getSessionToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'toggle_role', userId, newRole: role, adminUsername }),
    });
    const data = await res.json();
    return { ok: data.ok, msg: data.msg || 'Errore' };
  } catch {
    return { ok: false, msg: 'Errore' };
  }
}

// Delete user via API
export async function deleteUser(userId: string, adminUsername?: string): Promise<{ ok: boolean; msg: string }> {
  try {
    const token = getSessionToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'delete_user', userId, adminUsername }),
    });
    const data = await res.json();
    return { ok: data.ok, msg: data.msg || 'Errore' };
  } catch {
    return { ok: false, msg: 'Errore' };
  }
}

// Session management (local only)
export function saveSession(user: AppUser, sessionToken?: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('qp_session', JSON.stringify({ ...user, ts: Date.now() }));
  if (sessionToken) {
    localStorage.setItem('qp_session_token', sessionToken);
  } else {
    localStorage.removeItem('qp_session_token');
  }
}

export function loadSession(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('qp_session');
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (Date.now() - d.ts > 7 * 24 * 60 * 60 * 1000) { localStorage.removeItem('qp_session'); return null; }
    return d;
  } catch { return null; }
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('qp_session');
  localStorage.removeItem('qp_session_token');
}

// Get session token for API Authorization header
// Priority: real API session_token > generated from local session
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  // First try the real API session token
  const realToken = localStorage.getItem('qp_session_token');
  if (realToken) return realToken;
  // Fallback: generate from local session
  const raw = localStorage.getItem('qp_session');
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    return Buffer.from(JSON.stringify({ username: session.username, ts: session.ts })).toString('base64');
  } catch {
    return null;
  }
}
