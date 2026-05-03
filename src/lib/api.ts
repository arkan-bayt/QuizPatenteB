// ============================================================
// Authenticated Fetch Helper
// All client-side API calls should use this instead of raw fetch
// Automatically attaches the session token from localStorage
// ============================================================
import { getSessionToken } from '@/logic/authEngine';

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getSessionToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export async function authPost(url: string, body: any): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function authGet(url: string): Promise<Response> {
  return authenticatedFetch(url);
}
