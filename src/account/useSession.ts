import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/**
 * Who is signed in.
 *
 * One subscription for the whole app: Supabase keeps the session in
 * localStorage and tells us when it changes, so every page that cares — the
 * header, MY PAGE, the admin screen — reads the same answer without polling.
 *
 * `ready` is false only while the very first answer is outstanding. Rendering
 * "LOGIN" during that moment and swapping it a tick later is exactly the flicker
 * a shopper reads as a broken page.
 */
export interface SessionState {
  ready: boolean;
  session: Session | null;
  userId: string | null;
  email: string | null;
}

export function useSession(): SessionState {
  const [ready, setReady] = useState(!supabase);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let live = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!live) return;
      setSession(data.session ?? null);
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setReady(true);
    });

    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    ready,
    session,
    userId: session?.user.id ?? null,
    email: session?.user.email ?? null
  };
}

export function useSignOut() {
  return useCallback(async () => {
    await supabase?.auth.signOut();
  }, []);
}

/**
 * Supabase returns English sentences meant for developers. Map the ones a
 * shopper can actually cause onto our own translated copy, and fall back to a
 * generic line rather than showing "AuthApiError: …" to a customer.
 */
export type AuthErrorKey =
  | 'badCredentials'
  | 'emailTaken'
  | 'weakPassword'
  | 'unavailable'
  | 'generic';

export function classifyAuthError(message: string): AuthErrorKey {
  const text = message.toLowerCase();
  if (text.includes('invalid login') || text.includes('invalid credentials')) return 'badCredentials';
  if (text.includes('already registered') || text.includes('already been registered')) return 'emailTaken';
  if (text.includes('password') && (text.includes('short') || text.includes('at least'))) return 'weakPassword';
  if (text.includes('not confirmed') || text.includes('confirm')) return 'badCredentials';
  if (text.includes('fetch') || text.includes('network')) return 'unavailable';
  return 'generic';
}
