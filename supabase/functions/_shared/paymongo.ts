/**
 * PayMongo API client and order reconciliation — Deno (Supabase Edge) only.
 *
 * The rule that keeps this safe: an order is marked paid only after this code
 * asks PayMongo directly, with the secret key, and PayMongo says a payment on
 * that checkout session is `paid` for exactly the order's total. A webhook or
 * a customer returning to the success page is a *reason to check*, never proof.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';
import { sendOrderConfirmation } from './email.ts';

const API = 'https://api.paymongo.com/v1';

export function secretKey(): string {
  const key = Deno.env.get('PAYMONGO_SECRET_KEY');
  if (!key) throw new Error('PAYMONGO_SECRET_KEY is not set');
  return key;
}

/** sk_live_… keys verify live signatures (`li`); sk_test_… keys verify test ones (`te`) */
export function isLiveKey(key: string): boolean {
  return key.startsWith('sk_live_');
}

export function adminClient(): SupabaseClient {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false }
  });
}

async function paymongo<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${btoa(`${secretKey()}:`)}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init.headers ?? {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = body?.errors?.[0]?.detail ?? response.statusText;
    throw new Error(`PayMongo ${response.status}: ${detail}`);
  }
  return body as T;
}

export interface PaymongoPayment {
  id: string;
  attributes: {
    status: string;
    amount: number;
    fee?: number;
    net_amount?: number;
    source?: { type?: string } | null;
    payment_method_used?: string;
  };
}

export interface CheckoutSession {
  id: string;
  attributes: {
    checkout_url: string;
    status: string;
    reference_number?: string;
    payment_intent?: { id: string } | null;
    payments?: PaymongoPayment[];
  };
}

export interface CheckoutLine {
  name: string;
  quantity: number;
  /** centavos */
  amount: number;
  description?: string;
}

export interface CreateCheckoutParams {
  orderId: string;
  lines: CheckoutLine[];
  successUrl: string;
  cancelUrl: string;
  billing: { name: string; email: string; phone: string };
  paymentMethods: string[];
}

export async function createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutSession> {
  const body = {
    data: {
      attributes: {
        line_items: params.lines.map((line) => ({
          name: line.name.slice(0, 255),
          quantity: line.quantity,
          amount: line.amount,
          currency: 'PHP',
          ...(line.description ? { description: line.description.slice(0, 255) } : {})
        })),
        payment_method_types: params.paymentMethods,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        reference_number: params.orderId,
        description: `MQNY order ${params.orderId.slice(0, 8)}`,
        send_email_receipt: false,
        show_line_items: true,
        billing: params.billing,
        metadata: { order_id: params.orderId }
      }
    }
  };
  const result = await paymongo<{ data: CheckoutSession }>('/checkout_sessions', {
    method: 'POST',
    body: JSON.stringify(body)
  });
  return result.data;
}

export async function retrieveCheckoutSession(id: string): Promise<CheckoutSession> {
  const result = await paymongo<{ data: CheckoutSession }>(`/checkout_sessions/${encodeURIComponent(id)}`);
  return result.data;
}

export interface OrderForReconcile {
  id: string;
  status: string;
  total: number;
  checkout_session_id: string | null;
}

/**
 * Take a paid order's units out of stock.
 *
 * Deliberately forgiving: a product that does not track stock, or a shade row
 * that was never created, simply has nothing to subtract. A failure here is
 * logged and swallowed — the customer has paid, and an order must never be
 * left unrecorded because a count could not be written.
 */
async function releaseStock(admin: SupabaseClient, orderId: string): Promise<void> {
  try {
    const { data: items } = await admin
      .from('order_items')
      .select('product_id, shade, quantity')
      .eq('order_id', orderId);
    if (!items?.length) return;

    for (const item of items) {
      if (item.shade) {
        const { data: shade } = await admin
          .from('product_shades')
          .select('stock')
          .eq('product_id', item.product_id)
          .eq('code', String(item.shade).toLowerCase())
          .maybeSingle();
        if (shade) {
          await admin
            .from('product_shades')
            .update({ stock: Math.max(0, shade.stock - item.quantity), updated_at: new Date().toISOString() })
            .eq('product_id', item.product_id)
            .eq('code', String(item.shade).toLowerCase());
        }
      }

      const { data: product } = await admin
        .from('products')
        .select('stock, track_stock')
        .eq('id', item.product_id)
        .maybeSingle();
      if (product?.track_stock) {
        await admin
          .from('products')
          .update({ stock: Math.max(0, product.stock - item.quantity) })
          .eq('id', item.product_id);
      }
    }
  } catch (error) {
    console.error('[stock] not adjusted', error);
  }
}

/**
 * Brings one order in line with what PayMongo says about its checkout session.
 *
 * Idempotent and race-safe: the update only applies while the order is still
 * , so the webhook and the success-page poll can both call this at
 * the same moment and the order is settled exactly once.
 */
export async function reconcileOrder(admin: SupabaseClient, order: OrderForReconcile): Promise<string> {
  if (order.status !== 'pending' || !order.checkout_session_id) return order.status;

  const session = await retrieveCheckoutSession(order.checkout_session_id);
  const paid = (session.attributes.payments ?? []).find((payment) => payment.attributes.status === 'paid');

  if (paid) {
    // a paid amount that differs from what we priced is held for a human to look at
    const status = paid.attributes.amount === order.total ? 'paid' : 'review';
    const { data: moved, error } = await admin
      .from('orders')
      .update({
        status,
        payment_id: paid.id,
        payment_method: paid.attributes.source?.type ?? paid.attributes.payment_method_used ?? null,
        payment_fee: paid.attributes.fee ?? null,
        payment_net: paid.attributes.net_amount ?? null,
        paid_at: new Date().toISOString()
      })
      .eq('id', order.id)
      .eq('status', 'pending')
      .select('id');
    if (error) throw error;

    // `moved` is empty when another caller — the webhook and the result page
    // often arrive together — already took the order out of `pending`. Only the
    // one that actually moved it takes the stock down, so a double confirmation
    // cannot sell the same unit twice.
    if (status === 'paid' && moved && moved.length > 0) {
      await releaseStock(admin, order.id);
      await sendOrderConfirmation(admin, order.id);
    }
    return status;
  }

  if (session.attributes.status === 'expired') {
    const { error } = await admin
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', order.id)
      .eq('status', 'pending');
    if (error) throw error;
    return 'cancelled';
  }

  return 'pending';
}
