import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ImageSlot } from './ImageSlot';
import { Link, useRoute } from '../router';
import { useCart } from '../cart/CartProvider';
import type { CartLine } from '../cart/CartProvider';
import { findProduct, ONLINE_PAYMENT_LIVE } from '../data/site';
import type { ProductStructure } from '../data/site';
import { useLocale } from '../i18n/LocaleProvider';
import { convertFromKrw, formatCentavosPhp, formatConverted } from '../i18n/money';
import { supabase } from '../lib/supabase';
import { PaymentStatus } from './PaymentStatus';
import { priceOrder, shippingKrw } from '../../supabase/functions/_shared/pricing.ts';

/**
 * Cart → checkout → PayMongo → result.
 *
 * The cart shows prices in the visitor's language and currency. The checkout
 * shows what PayMongo will actually charge — always pesos — priced with the
 * very same function the server uses, so the figure on this page and the
 * figure on the PayMongo page are the same number.
 */

interface ResolvedLine extends CartLine {
  product: ProductStructure;
}

function useResolvedLines(): ResolvedLine[] {
  const { lines } = useCart();
  return useMemo(
    () =>
      lines
        .map((line) => ({ ...line, product: findProduct(line.productId) }))
        .filter((line): line is ResolvedLine => Boolean(line.product)),
    [lines]
  );
}

function Swatch({ colour }: { colour: string }) {
  return <span className="line_swatch" style={{ backgroundColor: colour }} aria-label={colour} />;
}

// ---------------------------------------------------------------------------
// CART
// ---------------------------------------------------------------------------
export function CartPage() {
  const { t, locale, rates, number, moneyTimes, money } = useLocale();
  const { setQuantity, remove } = useCart();
  const lines = useResolvedLines();
  const { navigate } = useRoute();

  // totals in the visitor's currency, unit-rounded exactly as the checkout does
  const subtotalKrw = lines.reduce((sum, line) => sum + line.product.priceKrw * line.quantity, 0);
  const subtotal = lines.reduce(
    (sum, line) => sum + convertFromKrw(line.product.priceKrw, locale, rates) * line.quantity,
    0
  );
  const shipKrw = shippingKrw(subtotalKrw);
  const shipping = shipKrw ? convertFromKrw(shipKrw, locale, rates) : 0;

  return (
    <div id="contents" className="order_contents">
      <div className="order_area">
        <h2 className="order_title">{t.cart.title}</h2>

        <PaymentStatus compact />

        {lines.length === 0 ? (
          <div className="order_empty">
            <p>{t.cart.empty}</p>
            <Link className="btn_line" to="/category/all">
              {t.cart.continueShopping}
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart_lines">
              {lines.map((line) => {
                const copy = t.product.copy[line.productId];
                return (
                  <li key={`${line.productId}|${line.shade ?? ''}`} className="cart_line">
                    <Link className="line_thumb" to={line.product.href}>
                      <ImageSlot slot={line.product.slot} alt={copy.name} ratio="100%" label="1:1" />
                    </Link>
                    <div className="line_info">
                      <Link className="line_name" to={line.product.href}>
                        {copy.name}
                      </Link>
                      {line.shade ? (
                        <p className="line_shade">
                          {t.cart.shade} <Swatch colour={line.shade} />
                        </p>
                      ) : null}
                      <p className="line_unit">{money(line.product.priceKrw)}</p>
                    </div>
                    <div className="line_qty" aria-label={t.cart.quantity}>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.productId, line.shade, line.quantity - 1)}
                        disabled={line.quantity <= 1}
                        aria-label="−"
                      >
                        −
                      </button>
                      <span>{number(line.quantity)}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.productId, line.shade, line.quantity + 1)}
                        aria-label="+"
                      >
                        +
                      </button>
                    </div>
                    <p className="line_total">{moneyTimes(line.product.priceKrw, line.quantity)}</p>
                    <button
                      type="button"
                      className="line_remove"
                      onClick={() => remove(line.productId, line.shade)}
                    >
                      {t.cart.remove}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="order_summary">
              <dl>
                <div>
                  <dt>{t.cart.subtotal}</dt>
                  <dd>{formatConverted(subtotal, locale)}</dd>
                </div>
                <div>
                  <dt>{t.cart.shipping}</dt>
                  <dd>{shipping ? formatConverted(shipping, locale) : t.cart.free}</dd>
                </div>
                <div className="grand">
                  <dt>{t.cart.total}</dt>
                  <dd>{formatConverted(subtotal + shipping, locale)}</dd>
                </div>
              </dl>
              <button type="button" className="btn_dark" onClick={() => navigate('/order/checkout')}>
                {t.cart.toCheckout}
              </button>
              <Link className="order_back" to="/category/all">
                {t.cart.continueShopping}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CHECKOUT
// ---------------------------------------------------------------------------
type Customer = { name: string; email: string; phone: string; address: string; city: string; postal: string };

const EMPTY_CUSTOMER: Customer = { name: '', email: '', phone: '', address: '', city: '', postal: '' };

export function CheckoutPage() {
  const { t, locale, phpPerKrw, number } = useLocale();
  const lines = useResolvedLines();
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // the same function the create-checkout Edge Function prices with
  const priced = useMemo(
    () => priceOrder(lines.map((line) => ({ priceKrw: line.product.priceKrw, quantity: line.quantity })), phpPerKrw),
    [lines, phpPerKrw]
  );

  if (lines.length === 0) {
    return (
      <div id="contents" className="order_contents">
        <div className="order_area">
          <h2 className="order_title">{t.cart.checkoutTitle}</h2>
          <div className="order_empty">
            <p>{t.cart.empty}</p>
            <Link className="btn_line" to="/category/all">
              {t.cart.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const field = (key: keyof Customer, label: string, type = 'text', autoComplete?: string) => (
    <input
      className="form-control"
      type={type}
      placeholder={label}
      aria-label={label}
      autoComplete={autoComplete}
      value={customer[key]}
      onChange={(event) => setCustomer({ ...customer, [key]: event.target.value })}
    />
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (Object.values(customer).some((value) => !value.trim())) return setMessage(t.cart.required);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) return setMessage(t.cart.invalidEmail);
    if (!supabase) return setMessage(t.cart.unavailable);

    setBusy(true);
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: {
        items: lines.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          shade: line.shade,
          // display only — the server prices everything from the database
          name: t.product.copy[line.productId].name
        })),
        customer,
        locale,
        returnOrigin: window.location.origin
      }
    });

    if (error || !data?.checkoutUrl) {
      let reason = error?.message ?? 'unknown error';
      let status = 0;
      try {
        const response = (error as { context?: Response } | null)?.context;
        status = response?.status ?? 0;
        const body = response ? await response.json() : null;
        if (body?.error) reason = body.error;
      } catch {
        // no JSON body — keep the generic reason
      }
      setBusy(false);
      // 404: the function is not deployed yet; fetch errors: nothing answered at all
      if (status === 404 || /Failed to send a request/i.test(reason)) return setMessage(t.cart.unavailable);
      return setMessage(t.cart.failed.replace('{reason}', reason));
    }

    // off to PayMongo's hosted page; it sends the customer back to /order/result
    window.location.assign(data.checkoutUrl);
  };

  return (
    <div id="contents" className="order_contents">
      <div className="order_area checkout">
        <h2 className="order_title">{t.cart.checkoutTitle}</h2>

        <PaymentStatus />

        <div className={`checkout_grid${ONLINE_PAYMENT_LIVE ? '' : ' summary_only'}`}>
          {/* while payment is not live there is nothing for these details to
              do: the shopper is told to message customer service instead, and
              asking for an address here would only look like a dead end */}
          {ONLINE_PAYMENT_LIVE ? (
          <form className="checkout_form" onSubmit={submit} noValidate>
            <h3>{t.cart.customerHeading}</h3>
            {field('name', t.cart.name, 'text', 'name')}
            {field('email', t.cart.email, 'email', 'email')}
            {field('phone', t.cart.phone, 'tel', 'tel')}
            {field('address', t.cart.address, 'text', 'street-address')}
            <div className="field_pair">
              {field('city', t.cart.city, 'text', 'address-level2')}
              {field('postal', t.cart.postal, 'text', 'postal-code')}
            </div>

            {message ? (
              <p className="checkout_message" role="alert">
                {message}
              </p>
            ) : null}

            <button type="submit" className="btn_dark" disabled={busy}>
              {busy ? t.cart.paying : t.cart.pay}
            </button>
            <p className="checkout_methods">{t.cart.methods}</p>
          </form>
          ) : null}

          <aside className="checkout_summary">
            <h3>{t.cart.summaryHeading}</h3>
            <ul>
              {lines.map((line, index) => (
                <li key={`${line.productId}|${line.shade ?? ''}`}>
                  <span className="name">
                    {t.product.copy[line.productId].name}
                    {line.shade ? <Swatch colour={line.shade} /> : null}
                    <em> × {number(line.quantity)}</em>
                  </span>
                  <span className="amount">{formatCentavosPhp(priced.lines[index].lineCentavos)}</span>
                </li>
              ))}
            </ul>
            <dl>
              <div>
                <dt>{t.cart.subtotal}</dt>
                <dd>{formatCentavosPhp(priced.subtotalCentavos)}</dd>
              </div>
              <div>
                <dt>{t.cart.shipping}</dt>
                <dd>{priced.shippingCentavos ? formatCentavosPhp(priced.shippingCentavos) : t.cart.free}</dd>
              </div>
              <div className="grand">
                <dt>{t.cart.total}</dt>
                <dd>{formatCentavosPhp(priced.totalCentavos)}</dd>
              </div>
            </dl>
            {ONLINE_PAYMENT_LIVE ? <p className="checkout_php">{t.cart.chargedInPhp}</p> : null}
          </aside>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RESULT — where PayMongo sends the customer back
// ---------------------------------------------------------------------------
interface OrderStatus {
  orderId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'review';
  total: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string | null;
  items: { line: number; name: string; shade: string | null; quantity: number; line_total: number }[];
}

const METHOD_LABELS: Record<string, string> = {
  card: 'Card',
  gcash: 'GCash',
  paymaya: 'Maya',
  grab_pay: 'GrabPay',
  qrph: 'QR Ph',
  shopee_pay: 'ShopeePay',
  billease: 'BillEase'
};

export function OrderResultPage() {
  const { t, number } = useLocale();
  const { clear } = useCart();
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [serviceDown, setServiceDown] = useState(false);
  const [waitedLong, setWaitedLong] = useState(false);
  const cleared = useRef(false);

  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('order') ?? '';
  const token = params.get('token') ?? '';

  useEffect(() => {
    if (!supabase || !orderId || !token) {
      setNotFound(true);
      return;
    }
    const client = supabase;
    let stopped = false;
    let attempts = 0;
    let failures = 0;
    let timer: number | undefined;

    const poll = async () => {
      attempts += 1;
      const { data, error } = await client.functions.invoke('order-status', { body: { orderId, token } });
      if (stopped) return;
      if (error || !data) {
        if ((error as { context?: Response } | null)?.context?.status === 404) return setNotFound(true);
        // three failed calls in a row: the service is not answering at all —
        // say so instead of promising a confirmation that cannot arrive
        failures += 1;
        if (failures >= 3) return setServiceDown(true);
      } else {
        failures = 0;
        setOrder(data as OrderStatus);
        if ((data as OrderStatus).status !== 'pending') return; // settled — stop polling
      }
      if (attempts >= 12) setWaitedLong(true);
      // quick at first, then easing off; the webhook usually lands within seconds
      timer = window.setTimeout(poll, attempts < 12 ? 2500 : 6000);
    };
    void poll();

    return () => {
      stopped = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [orderId, token]);

  // a paid order empties the cart, once
  useEffect(() => {
    if (!cleared.current && order && (order.status === 'paid' || order.status === 'review')) {
      cleared.current = true;
      clear();
    }
  }, [order, clear]);

  const headline = notFound
    ? t.cart.resultNotFound
    : serviceDown && !order
      ? t.cart.unavailable
      : !order || order.status === 'pending'
      ? waitedLong
        ? t.cart.resultPendingLong
        : t.cart.resultPending
      : {
          paid: t.cart.resultPaid,
          review: t.cart.resultReview,
          failed: t.cart.resultFailed,
          cancelled: t.cart.resultCancelled,
          pending: t.cart.resultPending
        }[order.status];

  const settledBadly = order?.status === 'failed' || order?.status === 'cancelled';

  return (
    <div id="contents" className="order_contents">
      <div className="order_area result">
        <h2 className="order_title">{t.cart.resultTitle}</h2>

        <p
          className={`result_headline is-${notFound || (serviceDown && !order) ? 'missing' : order?.status ?? 'pending'}`}
        >
          {headline}
        </p>

        {order ? (
          <div className="result_card">
            <p className="result_meta">
              {t.cart.orderNumber} <strong>{order.orderId.slice(0, 8).toUpperCase()}</strong>
              {order.paymentMethod ? (
                <>
                  {' · '}
                  {t.cart.paidWith} <strong>{METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</strong>
                </>
              ) : null}
            </p>
            <ul>
              {order.items.map((item) => (
                <li key={item.line}>
                  <span className="name">
                    {item.name}
                    {item.shade ? <Swatch colour={item.shade} /> : null}
                    <em> × {number(item.quantity)}</em>
                  </span>
                  <span className="amount">{formatCentavosPhp(item.line_total)}</span>
                </li>
              ))}
            </ul>
            <dl>
              <div>
                <dt>{t.cart.shipping}</dt>
                <dd>{order.shipping ? formatCentavosPhp(order.shipping) : t.cart.free}</dd>
              </div>
              <div className="grand">
                <dt>{t.cart.total}</dt>
                <dd>{formatCentavosPhp(order.total)}</dd>
              </div>
            </dl>
          </div>
        ) : null}

        <div className="result_actions">
          {settledBadly ? (
            <Link className="btn_dark" to="/order/basket">
              {t.cart.backToCart}
            </Link>
          ) : null}
          <Link className="btn_line" to="/category/all">
            {t.cart.continueShopping}
          </Link>
        </div>
      </div>
    </div>
  );
}
