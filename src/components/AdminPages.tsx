import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from '../router';
import { supabase } from '../lib/supabase';
import { formatCentavosPhp } from '../i18n/money';
import { signOut, useAdminSession } from '../admin/useAdmin';

/**
 * /admin/orders — the shop's own view of what has been paid.
 *
 * Nothing here is trusted to the browser. The page signs in with Supabase Auth
 * and then asks for rows in the ordinary way; the database returns them only
 * because `is_admin()` is true for this user. Someone who signs in as a
 * customer and types this address sees an empty table and a plain explanation,
 * because that is literally all the policies will give them.
 */

const STATUSES = ['all', 'paid', 'pending', 'review', 'failed', 'cancelled'] as const;
type StatusFilter = (typeof STATUSES)[number];

const FULFILMENTS = ['unfulfilled', 'packing', 'shipped', 'delivered', 'returned'] as const;

interface OrderItem {
  line: number;
  product_id: string;
  name: string;
  shade: string | null;
  shade_name: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface Order {
  id: string;
  status: string;
  currency: string;
  subtotal: number;
  shipping: number;
  total: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal: string;
  locale: string | null;
  payment_method: string | null;
  payment_fee: number | null;
  payment_net: number | null;
  paid_at: string | null;
  created_at: string;
  fulfilment: string;
  courier: string | null;
  tracking_number: string | null;
  admin_note: string | null;
  order_items: OrderItem[];
}

const when = (value: string | null) =>
  value
    ? new Date(value).toLocaleString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

const short = (id: string) => id.slice(0, 8);

// ---------------------------------------------------------------------------
// sign in
// ---------------------------------------------------------------------------
function AdminLogin({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return setError('The database is not configured in .env.');
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) return setError(authError.message);
    onDone();
  };

  return (
    <form className="admin_login" onSubmit={submit}>
      <h1>Shop admin</h1>
      <p className="admin_lead">Sign in with the staff account. Shoppers never use this page.</p>

      <label>
        <span>Email</span>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label>
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      {error ? <p className="admin_error">{error}</p> : null}

      <button type="submit" className="btn_dark" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>

      <Link className="admin_back" to="/">
        ← Back to the shop
      </Link>
    </form>
  );
}

// ---------------------------------------------------------------------------
// one order, expanded
// ---------------------------------------------------------------------------
function OrderDetail({ order, onSaved }: { order: Order; onSaved: (next: Order) => void }) {
  const [fulfilment, setFulfilment] = useState(order.fulfilment);
  const [courier, setCourier] = useState(order.courier ?? '');
  const [tracking, setTracking] = useState(order.tracking_number ?? '');
  const [note, setNote] = useState(order.admin_note ?? '');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    fulfilment !== order.fulfilment ||
    courier !== (order.courier ?? '') ||
    tracking !== (order.tracking_number ?? '') ||
    note !== (order.admin_note ?? '');

  const save = async () => {
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const patch: Record<string, unknown> = {
      fulfilment,
      courier: courier.trim() || null,
      tracking_number: tracking.trim() || null,
      admin_note: note.trim() || null
    };
    // stamp the moment it actually leaves, once
    if (fulfilment === 'shipped' && order.fulfilment !== 'shipped') patch.shipped_at = new Date().toISOString();
    if (fulfilment === 'delivered' && order.fulfilment !== 'delivered') patch.delivered_at = new Date().toISOString();

    const { data, error: updateError } = await supabase
      .from('orders')
      .update(patch)
      .eq('id', order.id)
      .select('*, order_items(*)')
      .single();

    setBusy(false);
    if (updateError) return setError(updateError.message);
    if (data) onSaved(data as Order);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <tr className="admin_detail">
      <td colSpan={8}>
        <div className="admin_detail_grid">
          <div>
            <h4>Items</h4>
            <ul className="admin_items">
              {[...order.order_items]
                .sort((a, b) => a.line - b.line)
                .map((item) => (
                  <li key={item.line}>
                    <span className="admin_item_name">
                      {item.name}
                      {item.shade_name || item.shade ? <em> · {item.shade_name ?? item.shade}</em> : null}
                    </span>
                    <span>× {item.quantity}</span>
                    <span>{formatCentavosPhp(item.line_total)}</span>
                  </li>
                ))}
            </ul>
            <dl className="admin_totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatCentavosPhp(order.subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>{order.shipping ? formatCentavosPhp(order.shipping) : 'Free'}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatCentavosPhp(order.total)}</dd>
              </div>
              <div>
                <dt>PayMongo fee</dt>
                <dd>{order.payment_fee == null ? '—' : `− ${formatCentavosPhp(order.payment_fee)}`}</dd>
              </div>
              <div className="net">
                <dt>Net to you</dt>
                <dd>{order.payment_net == null ? '—' : formatCentavosPhp(order.payment_net)}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4>Ship to</h4>
            <p className="admin_address">
              {order.customer_name}
              <br />
              {order.shipping_address}
              <br />
              {order.shipping_city} {order.shipping_postal}
              <br />
              {order.customer_phone}
              <br />
              <a href={`mailto:${order.customer_email}`}>{order.customer_email}</a>
            </p>
            <p className="admin_meta">
              Order {order.id}
              <br />
              Placed {when(order.created_at)}
              <br />
              Paid {when(order.paid_at)}
              {order.locale ? (
                <>
                  <br />
                  Language {order.locale.toUpperCase()}
                </>
              ) : null}
            </p>
          </div>

          <div>
            <h4>Fulfilment</h4>
            <label>
              <span>Stage</span>
              <select value={fulfilment} onChange={(event) => setFulfilment(event.target.value)}>
                {FULFILMENTS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Courier</span>
              <input value={courier} onChange={(event) => setCourier(event.target.value)} placeholder="J&T, LBC…" />
            </label>
            <label>
              <span>Tracking number</span>
              <input value={tracking} onChange={(event) => setTracking(event.target.value)} />
            </label>
            <label>
              <span>Internal note</span>
              <textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
            </label>

            {error ? <p className="admin_error">{error}</p> : null}

            <button type="button" className="btn_dark" onClick={save} disabled={!dirty || busy}>
              {busy ? 'Saving…' : saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// the list
// ---------------------------------------------------------------------------
function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) {
      setError('The database is not configured in .env.');
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(300);
    setLoading(false);
    if (loadError) return setError(loadError.message);
    setError(null);
    setOrders((data ?? []) as Order[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== 'all' && order.status !== status) return false;
      if (!needle) return true;
      return (
        order.id.toLowerCase().includes(needle) ||
        order.customer_name.toLowerCase().includes(needle) ||
        order.customer_email.toLowerCase().includes(needle) ||
        (order.tracking_number ?? '').toLowerCase().includes(needle)
      );
    });
  }, [orders, status, query]);

  // the money line: paid orders only, because nothing else has reached you
  const paid = visible.filter((order) => order.status === 'paid');
  const gross = paid.reduce((sum, order) => sum + order.total, 0);
  const fees = paid.reduce((sum, order) => sum + (order.payment_fee ?? 0), 0);
  const net = paid.reduce((sum, order) => sum + (order.payment_net ?? 0), 0);
  const waiting = visible.filter((order) => order.status === 'paid' && order.fulfilment === 'unfulfilled').length;

  return (
    <>
      <div className="admin_tiles">
        <div>
          <span>Paid orders</span>
          <strong>{paid.length}</strong>
        </div>
        <div>
          <span>Gross</span>
          <strong>{formatCentavosPhp(gross)}</strong>
        </div>
        <div>
          <span>PayMongo fees</span>
          <strong>− {formatCentavosPhp(fees)}</strong>
        </div>
        <div className="net">
          <span>Net to you</span>
          <strong>{formatCentavosPhp(net)}</strong>
        </div>
        <div className={waiting ? 'warn' : undefined}>
          <span>To pack</span>
          <strong>{waiting}</strong>
        </div>
      </div>

      <div className="admin_filters">
        <div className="admin_status">
          {STATUSES.map((value) => (
            <button
              key={value}
              type="button"
              className={value === status ? 'is-active' : undefined}
              onClick={() => setStatus(value)}
            >
              {value}
              {value !== 'all' ? (
                <em> {orders.filter((order) => order.status === value).length}</em>
              ) : (
                <em> {orders.length}</em>
              )}
            </button>
          ))}
        </div>

        <input
          className="admin_search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Order id, name, email, tracking"
          aria-label="Search orders"
        />

        <button type="button" className="admin_refresh" onClick={() => void load()} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {error ? <p className="admin_error">{error}</p> : null}

      <table className="admin_table">
        <thead>
          <tr>
            <th>Placed</th>
            <th>Order</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Method</th>
            <th className="num">Total</th>
            <th className="num">Net</th>
            <th>Fulfilment</th>
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 && !loading ? (
            <tr>
              <td colSpan={8} className="admin_empty">
                {orders.length === 0
                  ? 'No orders are visible to this account yet. If orders exist, this account is not in app_admins.'
                  : 'No order matches this filter.'}
              </td>
            </tr>
          ) : null}

          {visible.map((order) => (
            <Fragment key={order.id}>
              <tr
                className={`admin_row is-${order.status}${open === order.id ? ' is-open' : ''}`}
                onClick={() => setOpen(open === order.id ? null : order.id)}
              >
                <td>{when(order.created_at)}</td>
                <td className="mono">{short(order.id)}</td>
                <td>
                  {order.customer_name}
                  <em>{order.customer_email}</em>
                </td>
                <td>
                  <span className={`pill pill_${order.status}`}>{order.status}</span>
                </td>
                <td>{order.payment_method ?? '—'}</td>
                <td className="num">{formatCentavosPhp(order.total)}</td>
                <td className="num">{order.payment_net == null ? '—' : formatCentavosPhp(order.payment_net)}</td>
                <td>{order.status === 'paid' ? order.fulfilment : '—'}</td>
              </tr>
              {open === order.id ? (
                <OrderDetail
                  order={order}
                  onSaved={(next) =>
                    setOrders((current) => current.map((row) => (row.id === next.id ? next : row)))
                  }
                />
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ---------------------------------------------------------------------------
// reviews waiting to be published
// ---------------------------------------------------------------------------
interface AdminReview {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  body: string;
  status: string;
  created_at: string;
}

function ReviewsTable() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return setLoading(false);
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('product_reviews')
      .select('id, product_id, rating, title, body, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    setLoading(false);
    if (loadError) return setError(loadError.message);
    setError(null);
    setReviews((data ?? []) as AdminReview[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: 'published' | 'hidden' | 'pending') => {
    if (!supabase) return;
    const patch: Record<string, unknown> = { status };
    if (status === 'published') patch.published_at = new Date().toISOString();
    const { error: updateError } = await supabase.from('product_reviews').update(patch).eq('id', id);
    if (updateError) return setError(updateError.message);
    setReviews((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  const waiting = reviews.filter((review) => review.status === 'pending').length;

  return (
    <>
      <div className="admin_tiles">
        <div className={waiting ? 'warn' : undefined}>
          <span>Waiting</span>
          <strong>{waiting}</strong>
        </div>
        <div>
          <span>Published</span>
          <strong>{reviews.filter((review) => review.status === 'published').length}</strong>
        </div>
        <div>
          <span>Hidden</span>
          <strong>{reviews.filter((review) => review.status === 'hidden').length}</strong>
        </div>
      </div>

      {error ? <p className="admin_error">{error}</p> : null}

      <table className="admin_table">
        <thead>
          <tr>
            <th>Written</th>
            <th>Product</th>
            <th>Rating</th>
            <th>Review</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 && !loading ? (
            <tr>
              <td colSpan={6} className="admin_empty">
                No reviews yet.
              </td>
            </tr>
          ) : null}

          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{when(review.created_at)}</td>
              <td className="mono">{review.product_id}</td>
              <td>{'★'.repeat(review.rating)}</td>
              <td className="admin_review_body">
                {review.title ? <strong>{review.title}</strong> : null}
                {review.body}
              </td>
              <td>
                <span className={`pill pill_${review.status === 'published' ? 'paid' : review.status === 'hidden' ? 'failed' : 'pending'}`}>
                  {review.status}
                </span>
              </td>
              <td className="admin_actions">
                {review.status !== 'published' ? (
                  <button type="button" onClick={() => void setStatus(review.id, 'published')}>
                    Publish
                  </button>
                ) : null}
                {review.status !== 'hidden' ? (
                  <button type="button" onClick={() => void setStatus(review.id, 'hidden')}>
                    Hide
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ---------------------------------------------------------------------------
// CONTACT and DELIVERY enquiries
// ---------------------------------------------------------------------------
interface Enquiry {
  id: string;
  topic: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

function EnquiriesTable() {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return setLoading(false);
    setLoading(true);
    const { data, error: loadError } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setLoading(false);
    if (loadError) return setError(loadError.message);
    setError(null);
    setRows((data ?? []) as Enquiry[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    if (!supabase) return;
    const patch: Record<string, unknown> = { status };
    if (status === 'answered') patch.answered_at = new Date().toISOString();
    const { error: updateError } = await supabase.from('enquiries').update(patch).eq('id', id);
    if (updateError) return setError(updateError.message);
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status } : row)));
  };

  return (
    <>
      <div className="admin_tiles">
        <div className={rows.some((row) => row.status === 'new') ? 'warn' : undefined}>
          <span>New</span>
          <strong>{rows.filter((row) => row.status === 'new').length}</strong>
        </div>
        <div>
          <span>Contact</span>
          <strong>{rows.filter((row) => row.topic === 'contact').length}</strong>
        </div>
        <div>
          <span>Delivery</span>
          <strong>{rows.filter((row) => row.topic === 'delivery').length}</strong>
        </div>
      </div>

      {error ? <p className="admin_error">{error}</p> : null}

      <table className="admin_table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Topic</th>
            <th>From</th>
            <th>Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && !loading ? (
            <tr>
              <td colSpan={6} className="admin_empty">
                Nothing has come in yet.
              </td>
            </tr>
          ) : null}

          {rows.map((row) => (
            <tr key={row.id}>
              <td>{when(row.created_at)}</td>
              <td>{row.topic}</td>
              <td>
                {row.name}
                <em>
                  <a href={`mailto:${row.email}`}>{row.email}</a>
                  {row.phone ? ` · ${row.phone}` : ''}
                </em>
              </td>
              <td className="admin_review_body">
                {row.subject ? <strong>{row.subject}</strong> : null}
                {row.message}
              </td>
              <td>
                <span className={`pill pill_${row.status === 'answered' ? 'paid' : row.status === 'closed' ? 'failed' : 'pending'}`}>
                  {row.status}
                </span>
              </td>
              <td className="admin_actions">
                {row.status !== 'answered' ? (
                  <button type="button" onClick={() => void setStatus(row.id, 'answered')}>
                    Answered
                  </button>
                ) : null}
                {row.status !== 'closed' ? (
                  <button type="button" onClick={() => void setStatus(row.id, 'closed')}>
                    Close
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

// ---------------------------------------------------------------------------
// the page
// ---------------------------------------------------------------------------
type AdminTab = 'orders' | 'reviews' | 'enquiries';

const TABS: { key: AdminTab; label: string }[] = [
  { key: 'orders', label: 'Orders' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'enquiries', label: 'Enquiries' }
];

export function AdminOrdersPage() {
  const { ready, session, isAdmin, email, refresh } = useAdminSession();
  const [tab, setTab] = useState<AdminTab>('orders');

  if (!ready) {
    return (
      <div id="contents">
        <div className="admin_wrap">
          <p className="admin_lead">Checking your account…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div id="contents">
        <div className="admin_wrap">
          <AdminLogin onDone={refresh} />
        </div>
      </div>
    );
  }

  return (
    <div id="contents">
      <div className="admin_wrap wide">
        <header className="admin_head">
          <div className="admin_nav">
            {TABS.map((entry) => (
              <button
                key={entry.key}
                type="button"
                className={tab === entry.key ? 'is-active' : undefined}
                onClick={() => setTab(entry.key)}
              >
                {entry.label}
              </button>
            ))}
          </div>

          <div className="admin_who">
            <span>{email}</span>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                refresh();
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        {isAdmin ? (
          <>
            {tab === 'orders' ? <OrdersTable /> : null}
            {tab === 'reviews' ? <ReviewsTable /> : null}
            {tab === 'enquiries' ? <EnquiriesTable /> : null}
          </>
        ) : (
          <p className="admin_error">
            This account is signed in but is not an admin, so the database returns nothing. Add it to
            <code> public.app_admins</code> in the SQL editor, then reload.
          </p>
        )}
      </div>
    </div>
  );
}
