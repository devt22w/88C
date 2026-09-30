import { useCallback, useEffect, useState } from 'react';
import { BellIcon } from './Icons';
import { useRoute } from '../router';
import { supabase } from '../lib/supabase';
import { useSession } from '../account/useSession';
import { useT } from '../i18n/LocaleProvider';

/**
 * The bell beside the cart: what the shop tells a member about their orders.
 *
 * Nothing is written from here. Rows appear because a database trigger fired
 * when an order was paid or moved on to the next fulfilment stage, so the list
 * is the truth about the order rather than a message the browser composed.
 *
 * Only the text is built here, from `kind`, which is why a member reading the
 * site in Korean sees Korean even though the row was written by Postgres.
 */

interface Notification {
  id: string;
  kind: string;
  order_id: string | null;
  product_id: string | null;
  detail: { courier?: string | null; tracking?: string | null } | null;
  read_at: string | null;
  created_at: string;
}

const POLL_MS = 60_000;

export function NotificationBell() {
  const t = useT();
  const copy = t.notifications;
  const { session, userId } = useSession();
  const { navigate } = useRoute();

  const [rows, setRows] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    if (!supabase || !userId) return;
    const { data, error } = await supabase
      .from('notifications')
      .select('id, kind, order_id, product_id, detail, read_at, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    // the table arrives with migration 007; before that the bell simply stays empty
    if (error) return;
    setRows((data ?? []) as Notification[]);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setRows([]);
      setOpen(false);
      return;
    }
    void load();
    const timer = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [userId, load]);

  if (!session) return null;

  const unread = rows.filter((row) => !row.read_at).length;

  const markAll = async () => {
    if (!supabase || unread === 0) return;
    const now = new Date().toISOString();
    setRows((current) => current.map((row) => (row.read_at ? row : { ...row, read_at: now })));
    await supabase.from('notifications').update({ read_at: now }).is('read_at', null);
  };

  const textFor = (row: Notification) => {
    const template = copy.kinds[row.kind as keyof typeof copy.kinds] ?? row.kind;
    const tracking = row.detail?.tracking
      ? `${row.detail.courier ? row.detail.courier + ' ' : ''}${row.detail.tracking}`
      : '';
    return template
      .replace('{order}', row.order_id ? row.order_id.slice(0, 8) : '')
      .replace('{tracking}', tracking)
      .trim();
  };

  return (
    <div className="bell_wrap">
      <button
        type="button"
        className="bell_btn"
        aria-label={copy.title}
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) void load();
        }}
      >
        <BellIcon />
        {unread > 0 ? <span className="bell_count">{unread}</span> : null}
      </button>

      {open ? (
        <>
          {/* clicking anywhere else closes it, the way a menu should behave */}
          <span className="bell_scrim" onClick={() => setOpen(false)} />

          <div className="bell_panel">
            <div className="bell_head">
              <h3>{copy.title}</h3>
              {unread > 0 ? (
                <button type="button" onClick={() => void markAll()}>
                  {copy.markAll}
                </button>
              ) : null}
            </div>

            {rows.length === 0 ? <p className="bell_empty">{copy.empty}</p> : null}

            <ul>
              {rows.map((row) => (
                <li key={row.id} className={row.read_at ? undefined : 'is-unread'}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate(row.order_id ? '/myshop' : `/product/${row.product_id ?? ''}`);
                    }}
                  >
                    <span className="bell_text">{textFor(row)}</span>
                    <span className="bell_date">
                      {new Date(row.created_at).toLocaleDateString()}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
