import { useCallback, useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { ImageSlot } from './ImageSlot';
import { LockIcon } from './Icons';
import { Link, useRoute } from '../router';
import { contactDetails, csPhone, legalDetails } from '../data/site';
import { PolicyModal } from './PolicyPages';
import type { PolicyKind } from './PolicyPages';
import { useLocale, useT } from '../i18n/LocaleProvider';
import {
  FREE_SHIPPING_OVER_KRW,
  SHIPPING_FEE_KRW
} from '../../supabase/functions/_shared/pricing.ts';
import { supabase } from '../lib/supabase';
import { classifyAuthError, nextPath, useSession, useSignOut } from '../account/useSession';
import { formatCentavosPhp } from '../i18n/money';

/**
 * The utility pages behind LOGIN / JOIN / DELIVERY / CONTACT, plus MY PAGE.
 *
 * All of them sit on the same 400px centred column the reference uses, and
 * reuse the SECTION 9.8 form controls already in the stylesheet: 50px fields
 * with a 1px #dcdcdc border that darkens to #1d1d1d on hover and focus.
 *
 * LOGIN, JOIN and MY PAGE are real: they sign in through Supabase Auth, and the
 * orders a member sees are the rows the database is willing to hand them. The
 * two enquiry forms are still front-end only and say so.
 */

function AccountShell({ children }: { children: ReactNode }) {
  return (
    <div id="contents">
      <div className="account_area">{children}</div>
    </div>
  );
}

export function LoginPage() {
  const t = useT();
  const copy = t.account.login;
  const { navigate } = useRoute();
  const { session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // already signed in — there is nothing to do on this page
  useEffect(() => {
    if (session) navigate(nextPath(), { replace: true });
  }, [session, navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return setError(t.auth.errors.unavailable);
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    setBusy(false);
    if (authError) return setError(t.auth.errors[classifyAuthError(authError.message)]);
    navigate(nextPath(), { replace: true });
  };

  return (
    <AccountShell>
      <div className="account_tabs">
        <span className="tab is-active">{copy.tabMember}</span>
        <Link className="tab" to="/order/delivery">
          {copy.tabGuest}
        </Link>
      </div>

      <p className="secure_row">
        <LockIcon />
        <span>{copy.secure}</span>
      </p>

      <form onSubmit={submit}>
        <input
          className="form-control"
          type="email"
          autoComplete="username"
          placeholder={t.account.join.email}
          aria-label={t.account.join.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="form-control"
          type="password"
          autoComplete="current-password"
          placeholder={copy.password}
          aria-label={copy.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <div className="form_row">
          <label className="remember">
            <input type="checkbox" />
            <span>{copy.remember}</span>
          </label>
          <span className="find_links">
            <span className="hover-line">
              <Link to="/member/find-id">{copy.findId}</Link>
            </span>
            <span className="divider">|</span>
            <span className="hover-line">
              <Link to="/member/find-password">{copy.findPassword}</Link>
            </span>
          </span>
        </div>

        {error ? <p className="form_error">{error}</p> : null}

        <button type="submit" className="btn_dark" disabled={busy}>
          {busy ? t.auth.checking : copy.submit}
        </button>
      </form>

      {/* third-party badges stay as empty slots — upload the official artwork */}
      <div className="sns_row">
        <span className="sns_title">{copy.snsTitle}</span>
        <span className="sns_buttons">
          <ImageSlot slot="icon_sns_naver" alt="Naver" width={48} height={48} label="naver" />
          <ImageSlot slot="icon_sns_facebook" alt="Facebook" width={48} height={48} label="fb" />
          <ImageSlot slot="icon_sns_kakao" alt="Kakao" width={48} height={48} label="kakao" />
        </span>
      </div>

      <div className="join_block">
        <h3>{copy.joinHeading}</h3>
        <div className="join_lines">
          {copy.joinLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <Link className="btn_outline" to={`/member/join${window.location.search}`}>
          {copy.joinButton}
        </Link>
      </div>
    </AccountShell>
  );
}

export function JoinPage() {
  const t = useT();
  const copy = t.account.join;
  const { navigate } = useRoute();
  const { session } = useSession();

  // already signed in — the same as LOGIN: carry on to where they were going
  useEffect(() => {
    if (session) navigate(nextPath(), { replace: true });
  }, [session, navigate]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const agreedToAll = agreeTerms && agreePrivacy;
  // the documents still to be read, in order: ticking one box queues that
  // document, "agree to all" queues every one not yet accepted. A box is only
  // ticked by ACCEPT at the end of its document, never by the click itself.
  const [reading, setReading] = useState<PolicyKind[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const accepted = { terms: agreeTerms, privacy: agreePrivacy };
  const setAccepted = { terms: setAgreeTerms, privacy: setAgreePrivacy };

  // unticking needs no reading, so it happens straight away
  const toggle = (kinds: PolicyKind[], checked: boolean) => {
    if (!checked) return kinds.forEach((kind) => setAccepted[kind](false));
    setReading(kinds.filter((kind) => !accepted[kind]));
  };

  const acceptCurrent = () => {
    setAccepted[reading[0]](true);
    setReading((queue) => queue.slice(1));
  };

  // stable, so the modal's Esc listener is not re-bound on every render
  const stopReading = useCallback(() => setReading([]), []);

  const set = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setNotice(null);
    if (!agreedToAll) return setError(t.auth.errors.agreeRequired);
    if (form.password !== form.confirm) return setError(t.auth.errors.mismatch);
    if (form.password.length < 8) return setError(t.auth.errors.weakPassword);
    if (!supabase) return setError(t.auth.errors.unavailable);

    setBusy(true);
    setError(null);
    const agreedAt = new Date().toISOString();
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          // the trigger on auth.users copies these two into public.profiles
          full_name: form.name.trim(),
          phone: form.phone.trim(),
          // the consent record: which version of each document this member
          // accepted, and when — kept on the account in auth.users
          terms_version: legalDetails.version,
          terms_accepted_at: agreedAt,
          privacy_version: legalDetails.version,
          privacy_accepted_at: agreedAt
        }
      }
    });
    setBusy(false);

    if (authError) return setError(t.auth.errors[classifyAuthError(authError.message)]);
    // a session means the project does not ask for email confirmation
    if (data.session) return navigate(nextPath(), { replace: true });
    setNotice(t.auth.confirmEmail);
  };

  return (
    <AccountShell>
      <h2 className="account_title">{copy.title}</h2>
      <p className="account_lead">{copy.lead}</p>

      <form onSubmit={submit}>
        <input
          className="form-control"
          type="text"
          autoComplete="name"
          placeholder={copy.name}
          aria-label={copy.name}
          value={form.name}
          onChange={set('name')}
          required
        />
        <input
          className="form-control"
          type="email"
          autoComplete="email"
          placeholder={copy.email}
          aria-label={copy.email}
          value={form.email}
          onChange={set('email')}
          required
        />
        <input
          className="form-control"
          type="tel"
          autoComplete="tel"
          placeholder={copy.phone}
          aria-label={copy.phone}
          value={form.phone}
          onChange={set('phone')}
        />
        <input
          className="form-control"
          type="password"
          autoComplete="new-password"
          placeholder={copy.password}
          aria-label={copy.password}
          value={form.password}
          onChange={set('password')}
          required
        />
        <input
          className="form-control"
          type="password"
          autoComplete="new-password"
          placeholder={copy.passwordConfirm}
          aria-label={copy.passwordConfirm}
          value={form.confirm}
          onChange={set('confirm')}
          required
        />

        {/* both documents are required: the button stays disabled until both
            boxes are ticked, and submit() checks again in case it is forced */}
        <fieldset className="agree_box">
          <div className="agree_all">
            <label className="agree">
              <input
                type="checkbox"
                checked={agreedToAll}
                onChange={(event) => toggle(['terms', 'privacy'], event.target.checked)}
              />
              <span>{copy.agreeAll}</span>
            </label>
          </div>
          <div className="agree_row">
            <label className="agree">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(event) => toggle(['terms'], event.target.checked)}
              />
              <span>{copy.agreeTerms}</span>
            </label>
          </div>
          <div className="agree_row">
            <label className="agree">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(event) => toggle(['privacy'], event.target.checked)}
              />
              <span>{copy.agreePrivacy}</span>
            </label>
          </div>
        </fieldset>

        {reading.length > 0 ? (
          <PolicyModal kind={reading[0]} onAccept={acceptCurrent} onClose={stopReading} />
        ) : null}

        {!agreedToAll ? <p className="agree_hint">{copy.agreeHint}</p> : null}
        {error ? <p className="form_error">{error}</p> : null}
        {notice ? <p className="form_notice">{notice}</p> : null}

        <button type="submit" className="btn_dark" disabled={busy || !agreedToAll}>
          {busy ? t.auth.checking : copy.submit}
        </button>
      </form>
    </AccountShell>
  );
}

/**
 * MY PAGE — the member's own details and their order history.
 *
 * The orders listed here are not filtered in the browser: the database returns
 * the rows whose user_id is this member's, and nothing else exists as far as
 * this page is concerned.
 */
interface MyOrder {
  id: string;
  access_token: string;
  status: string;
  total: number;
  created_at: string;
  fulfilment: string;
  tracking_number: string | null;
  courier: string | null;
  order_items: { line: number; name: string; shade: string | null; quantity: number }[];
}

export function MyPage() {
  const t = useT();
  const copy = t.auth.account;
  // signed-out visitors never get this far: App sends them to LOGIN
  const { ready, session, userId, email } = useSession();
  const signOut = useSignOut();

  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal: ''
  });
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!supabase || !userId) return;
    let live = true;

    void (async () => {
      const [profileResult, orderResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase
          .from('orders')
          .select('id, access_token, status, total, created_at, fulfilment, tracking_number, courier, order_items(line, name, shade, quantity)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
      ]);
      if (!live) return;

      if (profileResult.data) {
        setProfile({
          full_name: profileResult.data.full_name ?? '',
          phone: profileResult.data.phone ?? '',
          shipping_address: profileResult.data.shipping_address ?? '',
          shipping_city: profileResult.data.shipping_city ?? '',
          shipping_postal: profileResult.data.shipping_postal ?? ''
        });
      }
      if (orderResult.error) setError(orderResult.error.message);
      else setOrders((orderResult.data ?? []) as MyOrder[]);
      setLoading(false);
    })();

    return () => {
      live = false;
    };
  }, [userId]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || !userId) return;
    setSaving(true);
    setError(null);
    const { error: saveError } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() });
    setSaving(false);
    if (saveError) return setError(saveError.message);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  if (!ready || !session) {
    return (
      <AccountShell>
        <p className="account_lead">{t.auth.checking}</p>
      </AccountShell>
    );
  }

  const field = (key: keyof typeof profile, label: string, type = 'text') => (
    <input
      className="form-control"
      type={type}
      placeholder={label}
      aria-label={label}
      value={profile[key]}
      onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))}
    />
  );

  return (
    <div id="contents">
      <div className="account_area wide">
        <div className="account_head">
          <h2 className="account_title">{copy.title}</h2>
          <p className="account_lead">{t.auth.signedInAs.replace('{email}', email ?? '')}</p>
          <button
            type="button"
            className="btn_text"
            onClick={signOut}
          >
            {t.auth.signOut}
          </button>
        </div>

        <div className="account_columns">
          <section>
            <h3 className="account_sub">{copy.profileTitle}</h3>
            <form onSubmit={save}>
              {field('full_name', copy.name)}
              {field('phone', copy.phone, 'tel')}
              {field('shipping_address', copy.address)}
              {field('shipping_city', copy.city)}
              {field('shipping_postal', copy.postal)}

              {error ? <p className="form_error">{error}</p> : null}

              <button type="submit" className="btn_dark" disabled={saving}>
                {saved ? copy.saved : copy.save}
              </button>
            </form>
          </section>

          <section>
            <h3 className="account_sub">{t.auth.orders.title}</h3>

            {loading ? <p className="account_lead">{t.auth.checking}</p> : null}

            {!loading && orders.length === 0 ? (
              <div className="order_empty">
                <p>{t.auth.orders.empty}</p>
                <Link className="btn_line" to="/category/all">
                  {t.auth.orders.emptyCta}
                </Link>
              </div>
            ) : null}

            <ul className="my_orders">
              {orders.map((order) => (
                <li key={order.id}>
                  <div className="my_order_head">
                    <span className="my_order_date">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className={`pill pill_${order.status}`}>
                      {t.auth.orders.status[order.status as keyof typeof t.auth.orders.status] ??
                        order.status}
                    </span>
                  </div>

                  <p className="my_order_items">
                    {order.order_items
                      .slice()
                      .sort((a, b) => a.line - b.line)
                      .map((item) => `${item.name} × ${item.quantity}`)
                      .join(', ')}
                  </p>

                  <div className="my_order_foot">
                    <span>{formatCentavosPhp(order.total)}</span>
                    {order.status === 'paid' ? (
                      <span className="my_order_stage">
                        {t.auth.orders.fulfilment[
                          order.fulfilment as keyof typeof t.auth.orders.fulfilment
                        ] ?? order.fulfilment}
                        {order.tracking_number
                          ? ` · ${t.auth.orders.tracking} ${order.courier ?? ''} ${order.tracking_number}`
                          : ''}
                      </span>
                    ) : null}
                    <Link to={`/order/result?order=${order.id}&token=${order.access_token}`}>
                      {t.auth.orders.view}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}


/**
 * Any link that exists in the navigation but has no page yet.
 *
 * Without this, an unknown path quietly rendered the home page again, so the
 * URL said /myshop while the screen said index. Saying so is better than
 * pretending the link worked.
 */
export function MissingPage() {
  const t = useT();

  return (
    <AccountShell>
      <h2 className="account_title">{t.missing.title}</h2>
      <p className="account_lead">{t.missing.lead}</p>
      <Link className="btn_outline" to="/">
        {t.missing.back}
      </Link>
    </AccountShell>
  );
}

// ---------------------------------------------------------------------------
// DELIVERY — track an order, or ask about one
// ---------------------------------------------------------------------------
interface TrackedOrder {
  orderId: string;
  status: string;
  total: number;
  createdAt: string;
  paidAt: string | null;
  fulfilment: string;
  courier: string | null;
  trackingNumber: string | null;
  items: { line: number; name: string; shade: string | null; quantity: number }[];
}

export function DeliveryPage() {
  const t = useT();
  const copy = t.support.delivery;
  const { locale, money } = useLocale();

  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [looking, setLooking] = useState(false);
  const [found, setFound] = useState<TrackedOrder | null>(null);
  const [missing, setMissing] = useState(false);

  const track = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return setMissing(true);
    setLooking(true);
    setMissing(false);
    setFound(null);

    // the id and the email have to agree; neither alone opens an order
    const { data, error } = await supabase.functions.invoke('order-status', {
      body: { orderId: orderId.trim(), email: email.trim() }
    });
    setLooking(false);
    if (error || !data?.orderId) return setMissing(true);
    setFound(data as TrackedOrder);
  };

  return (
    <AccountShell>
      <h2 className="account_title">{copy.trackTitle}</h2>
      <p className="account_lead">{copy.trackLead}</p>

      <form onSubmit={track}>
        <input
          className="form-control"
          type="text"
          placeholder={copy.orderId}
          aria-label={copy.orderId}
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          required
        />
        <input
          className="form-control"
          type="email"
          placeholder={copy.email}
          aria-label={copy.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {missing ? <p className="form_error">{copy.notFound}</p> : null}

        <button type="submit" className="btn_dark" disabled={looking}>
          {looking ? copy.searching : copy.track}
        </button>
      </form>

      {found ? (
        <div className="track_card">
          <dl>
            <div>
              <dt>{copy.stage}</dt>
              <dd>
                {t.auth.orders.status[found.status as keyof typeof t.auth.orders.status] ?? found.status}
                {found.status === 'paid'
                  ? ' · ' +
                    (t.auth.orders.fulfilment[
                      found.fulfilment as keyof typeof t.auth.orders.fulfilment
                    ] ?? found.fulfilment)
                  : ''}
              </dd>
            </div>
            <div>
              <dt>{copy.placed}</dt>
              <dd>{new Date(found.createdAt).toLocaleString()}</dd>
            </div>
            {found.paidAt ? (
              <div>
                <dt>{copy.paid}</dt>
                <dd>{new Date(found.paidAt).toLocaleString()}</dd>
              </div>
            ) : null}
            {found.trackingNumber ? (
              <div>
                <dt>{copy.tracking}</dt>
                <dd>
                  {found.courier ? found.courier + ' · ' : ''}
                  {found.trackingNumber}
                </dd>
              </div>
            ) : null}
            <div>
              <dt>{t.cart.total}</dt>
              <dd>{formatCentavosPhp(found.total)}</dd>
            </div>
          </dl>

          <p className="track_items">
            {found.items
              .slice()
              .sort((a, b) => a.line - b.line)
              .map((item) => item.name + ' × ' + item.quantity)
              .join(', ')}
          </p>
        </div>
      ) : null}

      <div className="info_block">
        <h3>{copy.shippingTitle}</h3>
        {copy.shippingLines.map((line) => (
          <p key={line}>
            {/* the rule is defined once in won; it is printed in whichever
                currency this reader is being charged in */}
            {line
              .replace('{fee}', money(SHIPPING_FEE_KRW))
              .replace('{threshold}', money(FREE_SHIPPING_OVER_KRW))}
          </p>
        ))}
      </div>

      <EnquiryForm
        topic="delivery"
        title={copy.enquiryTitle}
        lead={copy.enquiryLead}
        messageLabel={copy.message}
        submitLabel={copy.submit}
        locale={locale}
        withSubject={false}
      />

      <p className="account_note">
        {t.account.delivery.memberNote}{' '}
        <span className="hover-line">
          <Link to="/member/login">{t.account.login.submit}</Link>
        </span>
      </p>
    </AccountShell>
  );
}

// ---------------------------------------------------------------------------
// the shared enquiry form: CONTACT sends one, DELIVERY sends one
// ---------------------------------------------------------------------------
function EnquiryForm({
  topic,
  title,
  lead,
  messageLabel,
  submitLabel,
  locale,
  withSubject
}: {
  topic: 'contact' | 'delivery';
  title?: string;
  lead?: string;
  messageLabel: string;
  submitLabel: string;
  locale: string;
  withSubject: boolean;
}) {
  const t = useT();
  const copy = t.support.contact;
  const { session, email: accountEmail } = useSession();

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // a signed-in member should not retype what the account already knows
  useEffect(() => {
    if (accountEmail) setForm((current) => ({ ...current, email: current.email || accountEmail }));
  }, [accountEmail]);

  const set = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      return setError(t.support.required);
    }
    if (!supabase) return setError(t.support.failed);

    setBusy(true);
    setError(null);
    const { error: insertError } = await supabase.from('enquiries').insert({
      topic,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      subject: form.subject.trim() || null,
      message: form.message.trim(),
      locale
    });
    setBusy(false);
    if (insertError) return setError(t.support.failed);

    setSent(true);
    setForm({
      name: '',
      email: session ? accountEmail ?? '' : '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="enquiry_block">
      {title ? <h3 className="account_sub center">{title}</h3> : null}
      {lead ? <p className="account_lead">{lead}</p> : null}

      <form onSubmit={submit}>
        <input
          className="form-control"
          type="text"
          placeholder={copy.name}
          aria-label={copy.name}
          value={form.name}
          onChange={set('name')}
        />
        <input
          className="form-control"
          type="email"
          placeholder={copy.email}
          aria-label={copy.email}
          value={form.email}
          onChange={set('email')}
        />
        <input
          className="form-control"
          type="tel"
          placeholder={copy.phone}
          aria-label={copy.phone}
          value={form.phone}
          onChange={set('phone')}
        />
        {withSubject ? (
          <input
            className="form-control"
            type="text"
            placeholder={copy.subject}
            aria-label={copy.subject}
            value={form.subject}
            onChange={set('subject')}
          />
        ) : null}
        <textarea
          className="form-control form-textarea"
          placeholder={messageLabel}
          aria-label={messageLabel}
          rows={6}
          value={form.message}
          onChange={set('message')}
        />

        {error ? <p className="form_error">{error}</p> : null}
        {sent ? <p className="form_notice">{t.support.sent}</p> : null}

        <button type="submit" className="btn_dark" disabled={busy}>
          {busy ? t.support.sending : submitLabel}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CONTACT
// ---------------------------------------------------------------------------
export function ContactPage() {
  const t = useT();
  const copy = t.account.contact;
  const info = t.support.contact;
  const { locale } = useLocale();

  return (
    <AccountShell>
      <h2 className="account_title">{copy.title}</h2>
      <p className="account_lead">{copy.lead}</p>

      <EnquiryForm
        topic="contact"
        messageLabel={info.message}
        submitLabel={info.submit}
        locale={locale}
        withSubject
      />

      {/* the operator's own published details, so a shopper never has to wait
          for a reply to reach a person */}
      <div className="info_block">
        <h3>{info.infoTitle}</h3>
        <dl className="contact_list">
          <div>
            <dt>{info.phoneLabel}</dt>
            <dd>
              {contactDetails.phones.map((phone) => (
                <span key={phone.number} style={{ display: 'block' }}>
                  <a href={'tel:' + phone.number.replace(/-/g, '')}>{phone.number}</a> ({phone.note})
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>{info.kakaoLabel}</dt>
            <dd>{contactDetails.kakaoId}</dd>
          </div>
          <div>
            <dt>{info.messengerLabel}</dt>
            <dd>{contactDetails.messenger}</dd>
          </div>
          <div>
            <dt>{info.emailLabel}</dt>
            <dd>
              <a href={'mailto:' + contactDetails.email}>{contactDetails.email}</a>
            </dd>
          </div>
          <div>
            <dt>{info.addressLabel}</dt>
            <dd>{contactDetails.address}</dd>
          </div>
        </dl>
      </div>

      <div className="cs_block">
        <h3>{copy.csTitle}</h3>
        <p className="cs_phone">{csPhone}</p>
        {t.footer.cs.hours.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </AccountShell>
  );
}
