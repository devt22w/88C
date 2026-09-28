/**
 * POST /functions/v1/paymongo-webhook      (deploy with --no-verify-jwt)
 *
 * PayMongo calls this when something happens to a payment. It carries no
 * Supabase credentials — instead PayMongo signs the body with the webhook's
 * secret, and nothing is done until that signature checks out.
 *
 * Even a verified event is not taken at its word: it only identifies which
 * order to look at, and reconcileOrder() asks PayMongo for the real status.
 * A replayed or reordered event therefore cannot mark anything paid that
 * PayMongo does not itself report as paid.
 *
 * Subscribe the webhook to: checkout_session.payment.paid, payment.paid,
 * payment.failed.
 */
import { adminClient, isLiveKey, reconcileOrder, secretKey } from '../_shared/paymongo.ts';
import { verifyPaymongoSignature } from '../_shared/signature.ts';

const reply = (status: number, message: string) =>
  new Response(JSON.stringify({ message }), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (request) => {
  if (request.method !== 'POST') return reply(405, 'method not allowed');

  // the raw bytes, exactly as signed — never re-serialise before verifying
  const raw = await request.text();
  const secret = Deno.env.get('PAYMONGO_WEBHOOK_SECRET') ?? '';
  const verified = await verifyPaymongoSignature(
    raw,
    request.headers.get('paymongo-signature'),
    secret,
    isLiveKey(secretKey())
  );
  if (!verified) return reply(401, 'invalid signature');

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return reply(400, 'invalid json');
  }

  const admin = adminClient();
  const eventId: string | undefined = event?.data?.id;
  const type: string = event?.data?.attributes?.type ?? 'unknown';
  const resource = event?.data?.attributes?.data;

  // audit trail; a redelivered event is simply recorded once
  if (eventId) {
    await admin
      .from('payment_events')
      .upsert(
        { event_id: eventId, type, livemode: event?.data?.attributes?.livemode ?? null, payload: event },
        { onConflict: 'event_id', ignoreDuplicates: true }
      );
  }

  // which order is this about?
  const sessionId: string | null = resource?.type === 'checkout_session' ? resource.id : null;
  const intentId: string | null =
    resource?.attributes?.payment_intent_id ?? resource?.attributes?.payment_intent?.id ?? null;

  let query = admin.from('orders').select('id, status, total, checkout_session_id');
  if (sessionId) query = query.eq('checkout_session_id', sessionId);
  else if (intentId) query = query.eq('payment_intent_id', intentId);
  else return reply(200, `ignored ${type}`);

  const { data: order, error } = await query.maybeSingle();
  if (error) {
    console.error('[paymongo-webhook] lookup failed', error);
    return reply(500, 'lookup failed'); // PayMongo retries
  }
  if (!order) return reply(200, 'no matching order');

  try {
    const status = await reconcileOrder(admin, order);
    return reply(200, `order ${order.id} is ${status}`);
  } catch (reconcileError) {
    console.error('[paymongo-webhook] reconcile failed', reconcileError);
    return reply(500, 'reconcile failed'); // PayMongo retries
  }
});
