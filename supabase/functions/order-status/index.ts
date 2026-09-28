/**
 * POST /functions/v1/order-status   { orderId, token }  or  { orderId, email }
 *
 * What the result page polls after PayMongo sends the customer back, and what
 * the DELIVERY page uses to look an order up.
 *
 * Either way two things must line up. The result page holds the order id and
 * its random access token. A shopper tracking a delivery has the order id and
 * the email they ordered with — the id is a v4 UUID, so it cannot be guessed,
 * and the email keeps a leaked id from being enough on its own.
 *
 * If the order is still pending it asks PayMongo directly, which means a test
 * payment is confirmed even before the webhook is configured, and a late or
 * lost webhook never leaves a paid order stuck.
 */
import { corsHeaders, json } from '../_shared/cors.ts';
import { adminClient, reconcileOrder } from '../_shared/paymongo.ts';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  try {
    const { orderId, token, email } = await request.json().catch(() => ({}));
    if (!UUID.test(String(orderId))) return json({ error: 'not found' }, 404);

    const byToken = UUID.test(String(token));
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (!byToken && !cleanEmail) return json({ error: 'not found' }, 404);

    const admin = adminClient();
    let query = admin
      .from('orders')
      .select(
        'id, status, total, subtotal, shipping, currency, checkout_session_id, payment_method, paid_at, created_at, fulfilment, courier, tracking_number, shipped_at, delivered_at'
      )
      .eq('id', orderId);

    // ilike, not eq: an address typed with different capitalisation is the
    // same address, and Postgres compares text case-sensitively
    query = byToken ? query.eq('access_token', token) : query.ilike('customer_email', cleanEmail);

    const { data: order, error } = await query.maybeSingle();
    if (error) throw error;
    if (!order) return json({ error: 'not found' }, 404);

    let status = order.status;
    if (status === 'pending') {
      try {
        status = await reconcileOrder(admin, order);
      } catch (reconcileError) {
        // PayMongo unreachable: report what we know, the next poll tries again
        console.error('[order-status] reconcile failed', reconcileError);
      }
    }

    const { data: items } = await admin
      .from('order_items')
      .select('line, product_id, name, shade, unit_price, quantity, line_total')
      .eq('order_id', order.id)
      .order('line');

    const { data: fresh } = await admin
      .from('orders')
      .select('payment_method, paid_at')
      .eq('id', order.id)
      .single();

    return json({
      orderId: order.id,
      status,
      currency: order.currency,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: fresh?.payment_method ?? order.payment_method,
      paidAt: fresh?.paid_at ?? order.paid_at,
      createdAt: order.created_at,
      fulfilment: order.fulfilment,
      courier: order.courier,
      trackingNumber: order.tracking_number,
      shippedAt: order.shipped_at,
      deliveredAt: order.delivered_at,
      items: items ?? []
    });
  } catch (error) {
    console.error('[order-status]', error);
    return json({ error: 'status unavailable' }, 500);
  }
});
