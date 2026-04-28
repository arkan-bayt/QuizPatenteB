// ============================================================
// LOGIC - Multi-user Auth + User Management
// ============================================================
import { supabase, AppUser } from '@/data/supabaseClient';

function hash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h = h & h; }
  return Math.abs(h).toString(36);
}

// Get all users from Supabase
export async function getAllUsers(): Promise<AppUser[]> {
  try {
    const { data, error } = await supabase.from('app_users').select('*').order('created_at', { ascending: true });
    if (!error && data) return data as AppUser[];
  } catch { /* */ }
  return [];
}

// Add user (admin only)
export async function addUser(username: string, password: string, role: 'admin' | 'user' = 'user'): Promise<{ ok: boolean; msg: string }> {
  if (!username.trim() || !password.trim()) return { ok: false, msg: 'Compila tutti i campi' };
  if (username.length < 3) return { ok: false, msg: 'Username minimo 3 caratteri' };
  if (password.length < 4) return { ok: false, msg: 'Password minimo 4 caratteri' };
  try {
    const { data: existing } = await supabase.from('app_users').select('id').eq('username', username).single();
    if (existing) return { ok: false, msg: 'Username gia esistente' };
    const { error } = await supabase.from('app_users').insert({ username, password_hash: hash(password), role, is_active: true });
    if (error) return { ok: false, msg: 'Errore: ' + error.message };
    return { ok: true, msg: 'Utente creato con successo' };
  } catch (e: any) { return { ok: false, msg: 'Errore di connessione' }; }
}

// Update user role
export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<{ ok: boolean; msg: string }> {
  try {
    const { error } = await supabase.from('app_users').update({ role }).eq('id', userId);
    if (error) return { ok: false, msg: error.message };
    return { ok: true, msg: 'Ruolo aggiornato' };
  } catch { return { ok: false, msg: 'Errore' }; }
}

// Delete user
export async function deleteUser(userId: string): Promise<{ ok: boolean; msg: string }> {
  try {
    const { error } = await supabase.from('app_users').delete().eq('id', userId);
    if (error) return { ok: false, msg: error.message };
    return { ok: true, msg: 'Utente eliminato' };
  } catch { return { ok: false, msg: 'Errore' }; }
}

// Login
export async function login(username: string, password: string): Promise<{ ok: boolean; msg: string; user?: AppUser }> {
  // Try Supabase
  try {
    const { data, error } = await supabase.from('app_users').select('*').eq('username', username).eq('is_active', true).single();
    if (!error && data) {
      if (data.password_hash === hash(password)) {
        return { ok: true, msg: 'OK', user: data as AppUser };
      }
      return { ok: false, msg: 'Password non corretta' };
    }
  } catch { /* fallback */ }
  // Fallback: super admin
  if (username === 'arkan' && password === 'arkan1') {
    return { ok: true, msg: 'OK', user: { id: 'super-admin', username: 'arkan', password_hash: '', role: 'admin', is_active: true, created_at: '' } };
  }
  return { ok: false, msg: 'Username o password non corretti' };
}

// Session management
export function saveSession(user: AppUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('qp_session', JSON.stringify({ ...user, ts: Date.now() }));
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
}
