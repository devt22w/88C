import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Extra search words per product, from `products.keywords`.
 *
 * Purely additive: the search box works on names and descriptions alone, and
 * these only widen what finds a product — "워터프루프" or "tahan air" reaching an
 * English name, say. A missing table or a failed request leaves search exactly
 * as it was.
 */
export function useProductKeywords(): Record<string, string[]> {
  const [keywords, setKeywords] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!supabase) return;
    let live = true;

    void supabase
      .from('products')
      .select('id, keywords')
      .then(({ data, error }) => {
        if (!live || error || !data) return;
        const next: Record<string, string[]> = {};
        for (const row of data as { id: string; keywords: string[] | null }[]) {
          if (row.keywords?.length) next[row.id] = row.keywords;
        }
        setKeywords(next);
      });

    return () => {
      live = false;
    };
  }, []);

  return keywords;
}
