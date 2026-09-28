import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { findProduct } from '../data/site';
import type { ProductId } from '../i18n/types';
import { MAX_QUANTITY, isValidQuantity } from '../../supabase/functions/_shared/pricing.ts';

/**
 * The cart: which products, which shade, how many. Nothing about prices lives
 * here — prices are always read from the catalogue (and, at checkout, from the
 * database on the server), so a stale cart can never carry a stale price.
 *
 * Kept in localStorage so a refresh or a return visit keeps it. Storage can be
 * missing (private mode) — then the cart simply lasts for the visit.
 */
export interface CartLine {
  productId: ProductId;
  /** the chosen swatch hex, or null for products without shades */
  shade: string | null;
  quantity: number;
}

const STORAGE_KEY = 'mqny.cart';

function readStoredCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // drop anything that no longer matches the catalogue
    return parsed.filter((line: CartLine) => {
      const product = findProduct(line?.productId);
      if (!product || !isValidQuantity(line.quantity)) return false;
      if (product.colors.length > 0) return typeof line.shade === 'string' && product.colors.includes(line.shade);
      return line.shade === null;
    });
  } catch {
    return [];
  }
}

const sameLine = (line: CartLine, productId: ProductId, shade: string | null) =>
  line.productId === productId && line.shade === shade;

interface CartContextValue {
  lines: CartLine[];
  /** total units, for the header's bracketed count */
  count: number;
  add: (productId: ProductId, shade: string | null, quantity?: number) => void;
  setQuantity: (productId: ProductId, shade: string | null, quantity: number) => void;
  remove: (productId: ProductId, shade: string | null) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStoredCart);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage blocked — the cart still works for this visit
    }
  }, [lines]);

  const add = useCallback((productId: ProductId, shade: string | null, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => sameLine(line, productId, shade));
      if (existing) {
        return current.map((line) =>
          line === existing ? { ...line, quantity: Math.min(line.quantity + quantity, MAX_QUANTITY) } : line
        );
      }
      return [...current, { productId, shade, quantity: Math.min(quantity, MAX_QUANTITY) }];
    });
  }, []);

  const setQuantity = useCallback((productId: ProductId, shade: string | null, quantity: number) => {
    setLines((current) =>
      current.map((line) =>
        sameLine(line, productId, shade)
          ? { ...line, quantity: Math.max(1, Math.min(Math.round(quantity), MAX_QUANTITY)) }
          : line
      )
    );
  }, []);

  const remove = useCallback((productId: ProductId, shade: string | null) => {
    setLines((current) => current.filter((line) => !sameLine(line, productId, shade)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      add,
      setQuantity,
      remove,
      clear
    }),
    [lines, add, setQuantity, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
