// ============================================================
// LOGIC LAYER - Authentication
// ============================================================

import { supabase, DEFAULT_ADMIN } from '@/data/supabaseClient';

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('username', username)
      .single();
    if (!error && data) return data.password_hash === simpleHash(password);
  } catch { /* fallback */ }
  return username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password;
}

export function hasAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  const session = localStorage.getItem('quiz_admin_session');
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('quiz_admin_session');
      return false;
    }
    return parsed.loggedIn === true;
  } catch { return false; }
}

export function saveAdminSession(username: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('quiz_admin_session', JSON.stringify({ loggedIn: true, username, timestamp: Date.now() }));
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('quiz_admin_session');
}
