import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

/**
 * The client is null until credentials are present in `.env`.
 *
 * That is deliberate: the page must render identically with or without a
 * database. Missing credentials simply mean every image slot falls back to its
 * placeholder, exactly as before this file existed — no crash, no blank page,
 * no layout shift.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        // the admin pages sign in with Supabase Auth, so the session has to
        // survive a reload; a shopper never signs in and stores nothing
        auth: { persistSession: true, autoRefreshToken: true }
      })
    : null;

export const isSupabaseConfigured = supabase !== null;
