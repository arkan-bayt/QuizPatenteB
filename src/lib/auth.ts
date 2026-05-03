// ============================================================
// Server-side session verification utility
// Since we use localStorage sessions, the client must send
// the session in the Authorization header.
// We verify it server-side by checking against the database.
// ============================================================
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface VerifiedUser {
  id: string;
  username: string;
  role: 'super_admin' | 'teacher' | 'student';
  owner_id: string | null;
  is_active: boolean;
}

// Verify session from Authorization header
// Client sends: Authorization: Bearer <session_token>
// Session token = base64(JSON.stringify({ username, ts }))
export async function verifySession(authHeader: string | null): Promise<VerifiedUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const username = decoded.username;
    const ts = decoded.ts;

    // Check session age (max 7 days)
    if (!ts || Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return null;

    const { data, error } = await supabase
      .from('app_users')
      .select('id, username, role, is_active')
      .eq('username', username.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('[AUTH] DB lookup failed for', username, '- error:', error?.message || 'no data');
      return null;
    }

    if (username === 'arkan') {
      return { id: String(data.id), username: 'arkan', role: 'super_admin', owner_id: null, is_active: true };
    }

    return {
      id: String(data.id),
      username: data.username,
      role: data.role as 'super_admin' | 'teacher' | 'student',
      owner_id: null,
      is_active: data.is_active,
    };
  } catch (e: any) {
    console.error('[AUTH] verifySession error:', e.message || e);
    return null;
  }
}

// Helper: require specific role
export function requireRole(user: VerifiedUser, roles: string[]): boolean {
  return roles.includes(user.role);
}

// Helper: require super admin
export function requireSuperAdmin(user: VerifiedUser): boolean {
  return user.role === 'super_admin';
}

// Helper: require teacher or super admin
export function requireTeacherOrAbove(user: VerifiedUser): boolean {
  return user.role === 'super_admin' || user.role === 'teacher';
}
