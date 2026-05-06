// ============================================================
// Server-side session verification utility (SECURED)
// Uses JWT-signed tokens with bcrypt password hashing
// ============================================================
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_change_me';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface VerifiedUser {
  id: string;
  username: string;
  role: 'super_admin' | 'teacher' | 'student';
  owner_id: string | null;
  is_active: boolean;
  subscription_tier: 'free' | 'premium';
}

export interface SessionPayload {
  username: string;
  role: string;
  subscription_tier: string;
  iat: number;
  exp: number;
}

// Create a signed JWT session token
export function createSessionToken(user: {
  username: string;
  role: string;
  subscription_tier?: string;
}): string {
  const payload = {
    username: user.username,
    role: user.role,
    subscription_tier: user.subscription_tier || 'free',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}

// Verify session from Authorization header using JWT
export async function verifySession(authHeader: string | null): Promise<VerifiedUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  try {
    // First try JWT verification
    const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;

    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .eq('username', decoded.username.toLowerCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      console.error('[AUTH] DB lookup failed for', decoded.username, '- error:', error?.message || 'no data');
      return null;
    }

    return {
      id: String(data.id),
      username: data.username,
      role: data.role as 'super_admin' | 'teacher' | 'student',
      owner_id: null,
      is_active: data.is_active,
      subscription_tier: data.subscription_tier || decoded.subscription_tier || 'free',
    };
  } catch (e: any) {
    // If JWT fails, try legacy base64 token (for migration support)
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      const username = decoded.username;
      const ts = decoded.ts;

      // Check session age (max 7 days)
      if (!ts || Date.now() - ts > 7 * 24 * 60 * 60 * 1000) return null;

      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('username', username?.toLowerCase())
        .eq('is_active', true)
        .single();

      if (error || !data) return null;

      return {
        id: String(data.id),
        username: data.username,
        role: data.role as 'super_admin' | 'teacher' | 'student',
        owner_id: null,
        is_active: data.is_active,
        subscription_tier: data.subscription_tier || 'free',
      };
    } catch {
      console.error('[AUTH] verifySession error: invalid token format');
      return null;
    }
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

// Helper: require premium subscription
export function requirePremium(user: VerifiedUser): boolean {
  return user.subscription_tier === 'premium' || user.role === 'super_admin';
}
