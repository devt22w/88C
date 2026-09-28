/**
 * The one pricing rule, shared by the storefront and the payment server.
 *
 * The browser imports this file to print the cart and checkout totals; the
 * create-checkout Edge Function imports the same file to price the order it
 * sends to PayMongo. One implementation means the number a customer sees is,
 * to the centavo, the number they are charged.
 *
 * Pure TypeScript, no runtime APIs, erasable syntax only — so it runs in Vite,
 * in Deno on Supabase, and in Node for the tests.
 */

/** ₩3,000 shipping, waived from ₩20,000 — the reference storefront's rule */
export const SHIPPING_FEE_KRW = 3000;
export const FREE_SHIPPING_OVER_KRW = 20000;

/** a line can hold 1 to 99 of one product/shade */
export const MAX_QUANTITY = 99;

export interface LineInput {
  priceKrw: number;
  quantity: number;
}

export interface PricedLine extends LineInput {
  /** one unit, in centavos */
  unitCentavos: number;
  /** unit × quantity, in centavos */
  lineCentavos: number;
}

export interface PricedOrder {
  lines: PricedLine[];
  subtotalKrw: number;
  shippingKrw: number;
  subtotalCentavos: number;
  shippingCentavos: number;
  totalCentavos: number;
}

/**
 * Won to centavos, rounded to whole pesos first — exactly how the storefront
 * prints a peso price (₩10,800 × 0.0422 = ₱455.76 → ₱456 → 45600).
 */
export function krwToPhpCentavos(amountKrw: number, phpPerKrw: number): number {
  return Math.round(amountKrw * phpPerKrw) * 100;
}

export function shippingKrw(subtotalKrw: number): number {
  if (subtotalKrw <= 0) return 0;
  return subtotalKrw >= FREE_SHIPPING_OVER_KRW ? 0 : SHIPPING_FEE_KRW;
}

export function isValidQuantity(quantity: unknown): quantity is number {
  return Number.isInteger(quantity) && (quantity as number) >= 1 && (quantity as number) <= MAX_QUANTITY;
}

/**
 * Prices a cart. Each unit is converted and rounded on its own, then
 * multiplied — so a line of three always costs exactly three times one.
 * The shipping threshold is judged in won, as on the reference.
 */
export function priceOrder(lines: LineInput[], phpPerKrw: number): PricedOrder {
  const priced = lines.map((line) => {
    const unitCentavos = krwToPhpCentavos(line.priceKrw, phpPerKrw);
    return { ...line, unitCentavos, lineCentavos: unitCentavos * line.quantity };
  });

  const subtotalKrw = lines.reduce((sum, line) => sum + line.priceKrw * line.quantity, 0);
  const shipKrw = shippingKrw(subtotalKrw);
  const subtotalCentavos = priced.reduce((sum, line) => sum + line.lineCentavos, 0);
  const shippingCentavos = krwToPhpCentavos(shipKrw, phpPerKrw);

  return {
    lines: priced,
    subtotalKrw,
    shippingKrw: shipKrw,
    subtotalCentavos,
    shippingCentavos,
    totalCentavos: subtotalCentavos + shippingCentavos
  };
}
