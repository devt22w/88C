import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

/**
 * The receipt a customer gets once PayMongo confirms the payment.
 *
 * Sent through Resend, which needs two secrets:
 *   RESEND_API_KEY   re_…            from resend.com → API Keys
 *   ORDER_EMAIL_FROM "MQNY <orders@yourdomain.com>"  a verified sender
 *
 * Without them nothing is sent and nothing breaks: the order is already paid
 * and recorded, and `confirmation_sent_at` stays empty, so the mail can go out
 * later once the keys exist. It is stamped before the send is attempted only
 * after success, and skipped entirely when already stamped, so a webhook and a
 * result-page poll arriving together cannot send the same receipt twice.
 */

const peso = (centavos: number) =>
  '₱' + (centavos / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function sendOrderConfirmation(admin: SupabaseClient, orderId: string): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('ORDER_EMAIL_FROM');
  if (!apiKey || !from) return;

  try {
    const { data: order } = await admin
      .from('orders')
      .select(
        'id, access_token, status, total, subtotal, shipping, customer_name, customer_email, shipping_address, shipping_city, shipping_postal, confirmation_sent_at'
      )
      .eq('id', orderId)
      .maybeSingle();
    if (!order || order.status !== 'paid' || order.confirmation_sent_at) return;

    const { data: items } = await admin
      .from('order_items')
      .select('line, name, shade, shade_name, quantity, line_total')
      .eq('order_id', orderId)
      .order('line');

    const site = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');
    const link = site ? `${site}/order/result?order=${order.id}&token=${order.access_token}` : '';

    const rows = (items ?? [])
      .map(
        (item) => `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee">
              ${escape(item.name)}${item.shade_name || item.shade ? ` <span style="color:#888">· ${escape(item.shade_name ?? item.shade)}</span>` : ''}
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">× ${item.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${peso(item.line_total)}</td>
          </tr>`
      )
      .join('');

    const html = `
      <div style="font-family:Helvetica,Arial,sans-serif;color:#1d1d1d;max-width:560px">
        <h1 style="font-size:20px;letter-spacing:1px">Thank you for your order</h1>
        <p style="font-size:14px;line-height:1.7">
          Hi ${escape(order.customer_name)}, we have your payment and your order is being prepared.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin:18px 0">${rows}</table>
        <table style="width:100%;font-size:14px">
          <tr><td>Subtotal</td><td style="text-align:right">${peso(order.subtotal)}</td></tr>
          <tr><td>Shipping</td><td style="text-align:right">${order.shipping ? peso(order.shipping) : 'Free'}</td></tr>
          <tr><td style="padding-top:8px;font-weight:bold">Total paid</td>
              <td style="padding-top:8px;text-align:right;font-weight:bold">${peso(order.total)}</td></tr>
        </table>
        <p style="font-size:14px;line-height:1.7">
          Shipping to:<br>${escape(order.shipping_address)}<br>
          ${escape(order.shipping_city)} ${escape(order.shipping_postal)}
        </p>
        ${link ? `<p style="font-size:14px"><a href="${link}">View your order</a></p>` : ''}
        <p style="font-size:12px;color:#888">Order ${order.id}</p>
      </div>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [order.customer_email],
        subject: `Your MQNY order · ${peso(order.total)}`,
        html
      })
    });

    if (!response.ok) {
      console.error('[email] resend refused', response.status, await response.text());
      return;
    }

    await admin
      .from('orders')
      .update({ confirmation_sent_at: new Date().toISOString() })
      .eq('id', orderId)
      .is('confirmation_sent_at', null);
  } catch (error) {
    // a receipt that fails to send must never fail the payment it describes
    console.error('[email] not sent', error);
  }
}
