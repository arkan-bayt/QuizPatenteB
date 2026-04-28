import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase credentials not configured. ' +
      'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env or Vercel environment variables.'
    );
    return null;
  }

  try {
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
    return _supabase;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

// Use a proxy so import works but client is only created when actually called
// Returns null if Supabase is not configured
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
      // Return no-op functions for unconfigured Supabase
      if (prop === 'from') {
        return (table: string) => ({
          select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }), single: async () => ({ data: null, error: null }) }),
          insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
          upsert: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) }),
        });
      }
      return undefined;
    }
    const value = (client as Record<string | symbol, unknown>)[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
