// ============================================================
// LOGIC - Multi-user Auth via API (SECURED)
// No hardcoded credentials - all auth goes through server API
// ============================================================
import { AppUser } from '@/data/supabaseClient';

// Login via API only — no fallback, no hardcoded credentials
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
    return [];
  }
}

// Add user via API
export async function addUser(username: string, password: string, role: 'admin' | 'user' = 'user', adminUsername?: string): Promise<{ ok: boolean; msg: string }> {
  if (!username.trim() || !password.trim()) return { ok: false, msg: 'Compila tutti i campi' };
  if (username.length < 3) return { ok: false, msg: 'Username minimo 3 caratteri' };
  if (password.length < 6) return { ok: false, msg: 'Password minimo 6 caratteri' };
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

// Change password via API
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ ok: boolean; msg: string }> {
  try {
    const token = getSessionToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'change_password', current_password: currentPassword, new_password: newPassword }),
    });
    const data = await res.json();
    return { ok: data.ok, msg: data.msg || 'Errore' };
  } catch {
    return { ok: false, msg: 'Errore di connessione' };
  }
}

// Check subscription status
export async function checkSubscription(): Promise<{ ok: boolean; subscription_tier: string; is_premium: boolean; free_daily_limit: number }> {
  try {
    const token = getSessionToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers,
      body: JSON.stringify({ action: 'check_subscription' }),
    });
    const data = await res.json();
    if (data.ok) return data;
    return { ok: false, subscription_tier: 'free', is_premium: false, free_daily_limit: 50 };
  } catch {
    return { ok: false, subscription_tier: 'free', is_premium: false, free_daily_limit: 50 };
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
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null;
  const realToken = localStorage.getItem('qp_session_token');
  if (realToken) return realToken;
  return null;
}
