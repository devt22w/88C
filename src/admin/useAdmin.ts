import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/**
 * Who is signed in, and are they an admin.
 *
 * Being signed in is not enough: `is_admin()` is answered by the database, by
 * the same function the row policies use. A customer who signs in and then
 * types /admin/orders sees the same empty result the policies would give them,
 * and the page says so rather than pretending to be broken.
 */
export interface AdminSession {
  ready: boolean;
  session: Session | null;
  isAdmin: boolean;
  email: string | null;
  refresh: () => void;
}

export function useAdminSession(): AdminSession {
  const [ready, setReady] = useState(!supabase);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    let live = true;

    supabase.auth.getSession().then(({ data }) => {
      if (live) setSession(data.session ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let live = true;

    if (!session) {
      setIsAdmin(false);
      setReady(true);
      return;
    }

    setReady(false);
    supabase
      .rpc('is_admin')
      .then(({ data, error }) => {
        if (!live) return;
        setIsAdmin(!error && data === true);
        setReady(true);
      });

    return () => {
      live = false;
    };
  }, [session, tick]);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  return { ready, session, isAdmin, email: session?.user.email ?? null, refresh };
}

export async function signOut() {
  await supabase?.auth.signOut();
}
