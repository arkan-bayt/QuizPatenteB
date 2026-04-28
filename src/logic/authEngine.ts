// ============================================================
// LOGIC LAYER - Authentication Engine
// ============================================================

import { supabase, DEFAULT_ADMIN } from '@/data/supabaseClient';

// Simple hash function for password comparison (NOT for production)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

// Verify admin credentials
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  // 1. Try Supabase first
  try {
    const { data, error } = await supabase
      .from('admin_credentials')
      .select('*')
      .eq('username', username)
      .single();

    if (!error && data) {
      return data.password_hash === simpleHash(password);
    }
  } catch {
    // Supabase not available, fallback to defaults
  }

  // 2. Fallback to hardcoded defaults
  return username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password;
}

// Check if admin session exists in localStorage
export function hasAdminSession(): boolean {
  if (typeof window === 'undefined') return false;
  const session = localStorage.getItem('quiz_admin_session');
  if (!session) return false;
  try {
    const parsed = JSON.parse(session);
    const now = Date.now();
    // Session expires after 24 hours
    if (now - parsed.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('quiz_admin_session');
      return false;
    }
    return parsed.loggedIn === true;
  } catch {
    return false;
  }
}

// Save admin session
export function saveAdminSession(username: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('quiz_admin_session', JSON.stringify({
    loggedIn: true,
    username: username,
    timestamp: Date.now(),
  }));
}

// Clear admin session
export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('quiz_admin_session');
}

// Change admin password (updates Supabase)
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  // Verify current password first
  const session = localStorage.getItem('quiz_admin_session');
  if (!session) {
    return { success: false, message: 'Sessione non valida' };
  }

  try {
    const parsed = JSON.parse(session);
    const valid = await verifyCredentials(parsed.username, currentPassword);
    if (!valid) {
      return { success: false, message: 'Password attuale non corretta' };
    }

    // Try to update in Supabase
    try {
      await supabase
        .from('admin_credentials')
        .update({ password_hash: simpleHash(newPassword) })
        .eq('username', parsed.username);
    } catch {
      // If Supabase fails, password change only works in memory
    }

    return { success: true, message: 'Password aggiornata con successo' };
  } catch {
    return { success: false, message: 'Errore durante l\'aggiornamento' };
  }
}
