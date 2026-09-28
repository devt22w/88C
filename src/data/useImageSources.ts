import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { imageSources } from './imageSources';
import type { SlotSources } from '../types';

interface ImageSlotRow {
  slot: string;
  /** null means "use for every language" */
  locale: string | null;
  url: string | null;
}

/**
 * SECTION 11, database phase.
 *
 * Reads `public.image_slots` and turns it into the same shape the static map
 * has always had: `{ slot: url }`, plus `{ 'slot.locale': url }` for artwork
 * that differs per language.
 *
 * Nothing about the layout depends on the result. Rows arrive after first
 * paint, and because every slot's box already owns its width, height or ratio,
 * an image dropping in swaps a placeholder for a photograph without moving a
 * single pixel.
 */
export function useImageSources(): SlotSources {
  const [remote, setRemote] = useState<SlotSources>({});

  useEffect(() => {
    // capture the client so the narrowing survives into the async closure
    const client = supabase;
    if (!client) return;

    let cancelled = false;

    const load = async () => {
      const { data, error } = await client
        .from('image_slots')
        .select('slot, locale, url')
        .not('url', 'is', null);

      if (cancelled) return;

      if (error) {
        // a failed fetch must never take the page down — placeholders stay
        console.warn('[image_slots] could not load image slots:', error.message);
        return;
      }

      const next: Record<string, string> = {};
      for (const row of (data ?? []) as ImageSlotRow[]) {
        if (!row.url) continue;
        next[row.locale ? `${row.slot}.${row.locale}` : row.slot] = row.url;
      }

      setRemote(next as SlotSources);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  // local overrides first, database on top: a row in Supabase wins, so the
  // static map stays useful for anything you want pinned in the codebase
  return useMemo(() => ({ ...imageSources, ...remote }), [remote]);
}
