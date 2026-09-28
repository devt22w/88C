import { createContext, createElement, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Locale } from '../i18n/types';

/**
 * The parts of the catalogue that change without a deploy: what a shade is
 * called, whether it is in stock, and what shoppers rated the product.
 *
 * All three are optional. With no database — or before 006 has been run — the
 * hook returns empty maps and every page behaves exactly as it did before:
 * swatches with no names, nothing marked sold out, no stars.
 */

export interface Shade {
  code: string;
  position: number;
  name_en: string;
  name_ko: string | null;
  name_id: string | null;
  stock: number;
  is_active: boolean;
}

export interface Availability {
  in_stock: boolean;
  track_stock: boolean;
  stock: number;
  low_stock_at: number;
}

export interface Rating {
  average: number;
  review_count: number;
}

export interface CatalogueMeta {
  shades: Record<string, Shade[]>;
  availability: Record<string, Availability>;
  ratings: Record<string, Rating>;
  ready: boolean;
}

const EMPTY: CatalogueMeta = { shades: {}, availability: {}, ratings: {}, ready: false };

export function shadeName(shade: Shade, locale: Locale): string {
  if (locale === 'ko') return shade.name_ko || shade.name_en;
  if (locale === 'id') return shade.name_id || shade.name_en;
  return shade.name_en;
}

/** true when the shade may be bought: active, and either untracked or in stock */
export function shadeAvailable(shade: Shade, tracked: boolean): boolean {
  return shade.is_active && (!tracked || shade.stock > 0);
}

const MetaContext = createContext<CatalogueMeta>(EMPTY);

/**
 * One fetch for the whole page. Cards, the product page and the cart all ask
 * the same question, so the answer is loaded once here and read from context.
 */
export function CatalogueMetaProvider({ children }: { children: ReactNode }) {
  const meta = useLoadedMeta();
  return createElement(MetaContext.Provider, { value: meta }, children);
}

export function useCatalogueMeta(): CatalogueMeta {
  return useContext(MetaContext);
}

function useLoadedMeta(): CatalogueMeta {
  const [meta, setMeta] = useState<CatalogueMeta>(EMPTY);

  useEffect(() => {
    if (!supabase) return;
    let live = true;

    void (async () => {
      const [shadeResult, availabilityResult, ratingResult] = await Promise.all([
        supabase.from('product_shades').select('*').order('position'),
        supabase.from('product_availability').select('*'),
        supabase.from('product_ratings').select('*')
      ]);
      if (!live) return;

      const shades: Record<string, Shade[]> = {};
      for (const row of (shadeResult.data ?? []) as (Shade & { product_id: string })[]) {
        (shades[row.product_id] ??= []).push(row);
      }

      const availability: Record<string, Availability> = {};
      for (const row of (availabilityResult.data ?? []) as (Availability & { id: string })[]) {
        availability[row.id] = row;
      }

      const ratings: Record<string, Rating> = {};
      for (const row of (ratingResult.data ?? []) as (Rating & { product_id: string })[]) {
        ratings[row.product_id] = { average: Number(row.average), review_count: row.review_count };
      }

      setMeta({ shades, availability, ratings, ready: true });
    })();

    return () => {
      live = false;
    };
  }, []);

  return meta;
}
