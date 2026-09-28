import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { DEFAULT_LOCALE, LOCALES, LOCALE_TAGS } from './types';
import type { Locale, Messages } from './types';
import { en } from './messages/en';
import { id } from './messages/id';
import { ko } from './messages/ko';
import {
  RATES_FROM_KRW,
  convertFromKrw,
  formatConverted,
  formatMoney,
  formatNumber,
  formatPercent
} from './money';
import type { Rates } from './money';
import { supabase } from '../lib/supabase';

/** fx_rates rows are keyed by currency; the storefront works in locales */
const LOCALE_BY_CURRENCY: Record<string, Locale> = { PHP: 'en', IDR: 'id', KRW: 'ko' };

const CATALOGUES: Record<Locale, Messages> = { en, id, ko };

const STORAGE_KEY = 'mqny.locale';
const QUERY_KEY = 'lang';

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Resolution order on first paint: ?lang= in the URL (so a link can carry a
 * language), then the visitor's last choice, then the default. The browser's
 * own language is deliberately not consulted — English is the base and the
 * switcher is one click away.
 */
function readInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  const fromQuery = new URLSearchParams(window.location.search).get(QUERY_KEY);
  if (isLocale(fromQuery)) return fromQuery;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // private mode or blocked storage — fall through to the default
  }

  return DEFAULT_LOCALE;
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Messages;
  /** ₩18,000 → ₱760 → Rp 210.600, converted and formatted for this locale */
  money: (amountKrw: number) => string;
  /** one unit converted and rounded, then multiplied — how the checkout prices a line */
  moneyTimes: (amountKrw: number, quantity: number) => string;
  number: (value: number) => string;
  percent: (value: number) => string;
  /** the rates in force: public.fx_rates when reachable, the fallback otherwise */
  rates: Rates;
  /** pesos per won — the rate PayMongo checkouts are priced at */
  phpPerKrw: number;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // the choice still applies for this session
    }

    // keep the URL shareable without adding a history entry per click
    const url = new URL(window.location.href);
    url.searchParams.set(QUERY_KEY, next);
    window.history.replaceState({}, '', url);
  }, []);

  const t = CATALOGUES[locale];

  // One source for exchange rates: the same table the checkout charges with.
  // Until it answers (or if it cannot), the fallback keeps prices on screen.
  const [rates, setRates] = useState<Rates>(RATES_FROM_KRW);
  useEffect(() => {
    if (!supabase) return;
    let cancelled = false;
    void supabase
      .from('fx_rates')
      .select('currency, rate_from_krw')
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const next: Rates = { ...RATES_FROM_KRW };
        for (const row of data as { currency: string; rate_from_krw: number | string }[]) {
          const target = LOCALE_BY_CURRENCY[row.currency];
          const rate = Number(row.rate_from_krw);
          if (target && rate > 0) next[target] = rate;
        }
        setRates(next);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // arriving on a shared ?lang= link counts as choosing that language, so the
  // choice survives the visitor's next click into a URL without the parameter
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // storage blocked — the locale still applies for this session
    }
  }, [locale]);

  // document-level strings: these are read by screen readers and by crawlers,
  // so they have to switch with the page
  useEffect(() => {
    document.documentElement.lang = LOCALE_TAGS[locale];
    document.title = t.meta.title;

    let description = document.querySelector('meta[name="description"]');
    if (!description) {
      description = document.createElement('meta');
      description.setAttribute('name', 'description');
      document.head.appendChild(description);
    }
    description.setAttribute('content', t.meta.description);
  }, [locale, t]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      money: (amountKrw: number) => formatMoney(amountKrw, locale, rates),
      moneyTimes: (amountKrw: number, quantity: number) =>
        formatConverted(convertFromKrw(amountKrw, locale, rates) * quantity, locale),
      number: (value_: number) => formatNumber(value_, locale),
      percent: (value_: number) => formatPercent(value_, locale),
      rates,
      phpPerKrw: rates.en
    }),
    [locale, setLocale, t, rates]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used inside <LocaleProvider>');
  return context;
}

/** shorthand for the common case: `const t = useT()` */
export function useT(): Messages {
  return useLocale().t;
}
