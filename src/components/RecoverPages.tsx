import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useRoute } from '../router';
import { supabase } from '../lib/supabase';
import { useT } from '../i18n/LocaleProvider';

/**
 * Forgotten password, in two halves.
 *
 * /member/find-password asks Supabase to email a recovery link. The reply is
 * deliberately the same whether or not the address has an account — telling a
 * stranger which emails are registered is a leak, not a courtesy.
 *
 * /member/reset is where that link lands. Supabase turns the token in the URL
 * into a short-lived session before this page renders, so "am I allowed to
 * change this password" is answered by the session, not by anything typed here.
 */

function Shell({ children }: { children: ReactNode }) {
  return (
    <div id="contents">
      <div className="account_area">{children}</div>
    </div>
  );
}

export function FindPasswordPage() {
  const t = useT();
  const copy = t.recover;
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return setError(t.auth.errors.unavailable);
    setBusy(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/member/reset`
    });
    setBusy(false);
    // rate limiting is the one failure worth showing; "no such user" is not
    if (resetError && !/user/i.test(resetError.message)) return setError(resetError.message);
    setSent(true);
  };

  return (
    <Shell>
      <h2 className="account_title">{copy.title}</h2>
      <p className="account_lead">{copy.lead}</p>

      <form onSubmit={submit}>
        <input
          className="form-control"
          type="email"
          autoComplete="email"
          placeholder={copy.email}
          aria-label={copy.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {error ? <p className="form_error">{error}</p> : null}
        {sent ? <p className="form_notice">{copy.sent}</p> : null}

        <button type="submit" className="btn_dark" disabled={busy}>
          {busy ? copy.sending : copy.submit}
        </button>
      </form>

      <p className="account_note">
        <span className="hover-line">
          <Link to="/member/login">{copy.backToLogin}</Link>
        </span>
      </p>
    </Shell>
  );
}

export function FindIdPage() {
  const t = useT();
  const copy = t.recover;

  return (
    <Shell>
      <h2 className="account_title">{copy.findIdTitle}</h2>
      <p className="account_lead">{copy.findIdLead}</p>

      <Link className="btn_outline" to="/member/find-password">
        {copy.title}
      </Link>

      <p className="account_note">
        <span className="hover-line">
          <Link to="/member/login">{copy.backToLogin}</Link>
        </span>
      </p>
    </Shell>
  );
}

export function ResetPasswordPage() {
  const t = useT();
  const copy = t.recover;
  const { navigate } = useRoute();

  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase consumes the token in the URL as the page loads and hands back a
  // recovery session; without one there is nothing to change here
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setReady(true);
      return;
    }
    let live = true;

    const check = async () => {
      const { data } = await client.auth.getSession();
      if (!live) return;
      setAllowed(Boolean(data.session));
      setReady(true);
    };

    const { data: listener } = client.auth.onAuthStateChange((_event, session) => {
      setAllowed(Boolean(session));
      setReady(true);
    });

    void check();
    return () => {
      live = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return setError(t.auth.errors.unavailable);
    if (password !== confirm) return setError(t.auth.errors.mismatch);
    if (password.length < 8) return setError(t.auth.errors.weakPassword);

    setBusy(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) return setError(updateError.message);

    setSaved(true);
    window.setTimeout(() => navigate('/myshop'), 1200);
  };

  if (!ready) {
    return (
      <Shell>
        <p className="account_lead">{t.auth.checking}</p>
      </Shell>
    );
  }

  if (!allowed) {
    return (
      <Shell>
        <h2 className="account_title">{copy.title}</h2>
        <p className="form_error">{copy.expired}</p>
        <Link className="btn_outline" to="/member/find-password">
          {copy.submit}
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <h2 className="account_title">{copy.title}</h2>

      <form onSubmit={submit}>
        <input
          className="form-control"
          type="password"
          autoComplete="new-password"
          placeholder={copy.newPassword}
          aria-label={copy.newPassword}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <input
          className="form-control"
          type="password"
          autoComplete="new-password"
          placeholder={copy.confirmPassword}
          aria-label={copy.confirmPassword}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          required
        />

        {error ? <p className="form_error">{error}</p> : null}
        {saved ? <p className="form_notice">{copy.saved}</p> : null}

        <button type="submit" className="btn_dark" disabled={busy}>
          {busy ? copy.sending : copy.save}
        </button>
      </form>
    </Shell>
  );
}
