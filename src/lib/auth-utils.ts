import { randomBytes, createHmac, timingSafeEqual, scryptSync } from 'crypto';
import { supabase } from './supabase';

// ── Password hashing using scrypt (built-in Node.js) ──

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const key = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${key}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, keyHex] = storedHash.split(':');
    if (!salt || !keyHex) return false;
    const newKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return timingSafeEqual(Buffer.from(newKey, 'hex'), Buffer.from(keyHex, 'hex'));
  } catch {
    return false;
  }
}

// ── Token management using HMAC-SHA256 ──

const TOKEN_SECRET = process.env.AUTH_SECRET || 'patente-b-quiz-secret-change-me-2024';

interface TokenPayload {
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export function createToken(email: string, name: string): string {
  const payload: TokenPayload = {
    email,
    name,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', TOKEN_SECRET).update(payloadStr).digest('base64url');
  return `${payloadStr}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const [payloadStr, signature] = token.split('.');
    if (!payloadStr || !signature) return null;
    const expectedSig = createHmac('sha256', TOKEN_SECRET).update(payloadStr).digest('base64url');
    if (!timingSafeEqual(Buffer.from(signature, 'base64url'), Buffer.from(expectedSig, 'base64url'))) {
      return null;
    }
    const payload: TokenPayload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── Supabase user store ──

export interface StoredUser {
  email: string;
  name: string;
  password_hash: string;
  created_at: string;
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (error || !data) return null;
  return {
    email: data.email,
    name: data.name,
    password_hash: data.password_hash,
    created_at: data.created_at,
  };
}

export async function registerUser(email: string, name: string, password: string): Promise<StoredUser> {
  const lowerEmail = email.toLowerCase().trim();

  // Check if user exists
  const existing = await findUserByEmail(lowerEmail);
  if (existing) {
    throw new Error('QUESTA_EMAIL_GIA_REGISTRATA');
  }

  const passwordHash = hashPassword(password);

  const { data, error } = await supabase
    .from('users')
    .insert({
      email: lowerEmail,
      name,
      password_hash: passwordHash,
    })
    .select()
    .single();

  if (error) {
    throw new Error('Errore durante la registrazione nel database');
  }

  return {
    email: data.email,
    name: data.name,
    password_hash: data.password_hash,
    created_at: data.created_at,
  };
}
