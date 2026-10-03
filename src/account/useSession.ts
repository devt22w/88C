import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useRoute } from '../router';

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

/**
 * Signs out and lands on the home page. The page the visitor signed out from
 * is overwritten in history rather than stacked on, and every members-only
 * page re-checks the session on its own, so pressing back afterwards loads the
 * page again — still signed out — and is sent to LOGIN instead of being shown.
 */
export function useSignOut() {
  const { navigate } = useRoute();
  return useCallback(async () => {
    await supabase?.auth.signOut();
    navigate('/', { replace: true });
  }, [navigate]);
}

/**
 * Pages that need a signed-in member. The cart and checkout are here because
 * putting something in the cart already needs an account: a signed-out visitor
 * holding a cart can only be someone who signed out, or a cart left over on a
 * shared device. The order result page is not — PayMongo sends the shopper back
 * there, and the token in its link is what proves the order is theirs.
 */
const MEMBERS_ONLY = ['/myshop', '/myshop/order', '/myshop/info', '/order/basket', '/order/checkout'];

export function isMembersOnly(path: string): boolean {
  return MEMBERS_ONLY.includes(path.replace(/\/$/, ''));
}

/** LOGIN, remembering where to come back to */
export function loginPath(next = window.location.pathname + window.location.search): string {
  return `/member/login?next=${encodeURIComponent(next)}`;
}

/**
 * Where LOGIN / JOIN should send the member once signed in: the `next` the
 * redirect carried, if it is a path on this site, otherwise MY PAGE. Anything
 * that could leave the site (`//evil.com`, `https://…`) is ignored.
 */
export function nextPath(): string {
  const next = new URLSearchParams(window.location.search).get('next');
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/myshop';
  return next;
}

/**
 * The rule in front of ADD TO CART and BUY NOW: with a session the action goes
 * ahead (`true`); without one the visitor is sent to LOGIN, which brings them
 * back to this page afterwards. While the first session answer is still
 * outstanding nothing happens — a click in that instant is neither let through
 * nor bounced.
 */
export function useRequireSignIn() {
  const { ready, session } = useSession();
  const { navigate } = useRoute();
  return useCallback((): boolean => {
    if (session) return true;
    if (ready) navigate(loginPath());
    return false;
  }, [ready, session, navigate]);
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
