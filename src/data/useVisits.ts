import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Locale } from '../i18n/types';

/**
 * Two different questions about the same act of looking at a product.
 *
 * RECENT VISIT is personal and instant: the last products *this browser*
 * opened, kept in localStorage, so the panel is right even offline and no
 * account is involved.
 *
 * MOST VISITED ALL THE TIME is everyone's, counted in the database. A view is
 * written to `product_views`, which the public may insert into and nobody may
 * read; only the totals come back, through the `product_view_counts` view.
 */

const RECENT_KEY = 'mqny.recent';
const VISITOR_KEY = 'mqny.visitor';
const RECENT_LIMIT = 12;
/** one browser, one product, counted once an hour — a reload is not a visit */
const REVISIT_MS = 60 * 60 * 1000;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private mode, or storage full: the panel is a convenience, not the shop
  }
}

/** a random id for counting distinct visitors — not an account, never joined to one */
function visitorId(): string | null {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    return null;
  }
}

export interface RecentEntry {
  id: string;
  at: number;
}

export function readRecent(): RecentEntry[] {
  return read<RecentEntry[]>(RECENT_KEY, []).filter((entry) => entry && typeof entry.id === 'string');
}

/**
 * Call once when a product page opens. Writes the local history immediately and
 * records the shared count in the background; a failed insert costs nothing.
 */
export function recordVisit(productId: string, locale: Locale) {
  const history = readRecent().filter((entry) => entry.id !== productId);
  const now = Date.now();
  const previous = readRecent().find((entry) => entry.id === productId);
  write(RECENT_KEY, [{ id: productId, at: now }, ...history].slice(0, RECENT_LIMIT));

  if (previous && now - previous.at < REVISIT_MS) return;
  if (!supabase) return;

  void supabase
    .from('product_views')
    .insert({ product_id: productId, visitor_id: visitorId(), locale })
    .then(({ error }) => {
      if (error) console.debug('[visits] not counted', error.message);
    });
}

export function useRecentProducts(active: boolean): RecentEntry[] {
  const [entries, setEntries] = useState<RecentEntry[]>([]);

  // re-read every time the panel opens, so it reflects the visit just made
  useEffect(() => {
    if (active) setEntries(readRecent());
  }, [active]);

  return entries;
}

export interface ViewCount {
  product_id: string;
  views: number;
  visitors: number;
}

export function useMostVisited(active: boolean, limit = 8) {
  const [rows, setRows] = useState<ViewCount[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return setFailed(true);
    const { data, error } = await supabase
      .from('product_view_counts')
      .select('product_id, views, visitors')
      .order('views', { ascending: false })
      .limit(limit);
    if (error) return setFailed(true);
    setFailed(false);
    setRows((data ?? []) as ViewCount[]);
  }, [limit]);

  useEffect(() => {
    if (active && rows === null && !failed) void load();
  }, [active, rows, failed, load]);

  return { rows: rows ?? [], loading: active && rows === null && !failed, failed };
}
