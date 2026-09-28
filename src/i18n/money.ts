import type { Locale } from './types';
import { LOCALE_TAGS } from './types';

/**
 * Prices are stored once, as a plain number of Korean won, and converted at
 * render time. Switching language therefore switches both the currency symbol
 * and the amount: ₩18,000 → ₱760 → Rp 210.600.
 */
export const BASE_CURRENCY = 'KRW';

export const CURRENCY_BY_LOCALE: Record<Locale, string> = {
  en: 'PHP',
  id: 'IDR',
  ko: 'KRW'
};

export type Rates = Record<Locale, number>;

/**
 * How many units of the target currency one won buys — the OFFLINE FALLBACK.
 *
 * The live rates come from public.fx_rates (see supabase/005_orders.sql),
 * which the checkout also charges with, so the storefront and PayMongo can
 * never disagree. These values are used only when the database is out of
 * reach, and must match the seeded rows.
 */
export const RATES_FROM_KRW: Rates = {
  en: 0.0422, // KRW → PHP
  id: 11.7, // KRW → IDR
  ko: 1 // KRW → KRW
};

/**
 * Rounding per currency, so converted prices read like prices a shop would
 * actually print rather than like the output of a calculator. Pesos round to
 * whole units — the same rule supabase/functions/_shared/pricing.ts charges.
 */
const ROUND_TO: Record<Locale, number> = {
  en: 1, // whole pesos
  id: 100, // nearest hundred rupiah
  ko: 10 // nearest ten won
};

export function convertFromKrw(amountKrw: number, locale: Locale, rates: Rates = RATES_FROM_KRW): number {
  const converted = amountKrw * rates[locale];
  const step = ROUND_TO[locale];
  return Math.round(converted / step) * step;
}

/** an amount already in the locale's currency: ₱1,368 · Rp 379.200 · ₩32,400 */
export function formatConverted(amount: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(LOCALE_TAGS[locale], {
      style: 'currency',
      currency: CURRENCY_BY_LOCALE[locale],
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(amount);
  } catch {
    // Intl is present everywhere the site runs; this is belt and braces only
    return `${amount}`;
  }
}

/** ₩18,000 · ₱760 · Rp 210.600 — symbol, grouping and placement per locale */
export function formatMoney(amountKrw: number, locale: Locale, rates: Rates = RATES_FROM_KRW): string {
  return formatConverted(convertFromKrw(amountKrw, locale, rates), locale);
}

/** what PayMongo charges, always pesos: 45600 centavos → ₱456.00 */
export function formatCentavosPhp(centavos: number): string {
  try {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(centavos / 100);
  } catch {
    return `PHP ${(centavos / 100).toFixed(2)}`;
  }
}

/** plain grouped number, for anything that is not a price */
export function formatNumber(value: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(LOCALE_TAGS[locale]).format(value);
  } catch {
    return `${value}`;
  }
}

/** 40% — the sign sits after the number in all three locales */
export function formatPercent(value: number, locale: Locale): string {
  return `${formatNumber(value, locale)}%`;
}
