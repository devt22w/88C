# Payments — PayMongo (cards, GCash, Maya, GrabPay, QR Ph)

## Where the money goes

A customer's payment does **not** land in the company bank account directly. It
goes through PayMongo, which pays you out on a schedule.

```
CARD   customer's bank → Visa / Mastercard → PayMongo's partner bank ┐
GCASH  customer's GCash wallet → GCash ──────────────────────────────┼→ your PayMongo balance → company bank account
MAYA   customer's Maya wallet → Maya ────────────────────────────────┘    (fee already taken)     (on the payout schedule)
```

1. **Customer pays** on PayMongo's hosted page. Card numbers never touch this site.
2. **Your PayMongo balance** is credited with the amount *minus PayMongo's fee*
   (e.g. ₱456 via GCash at 2.23% ≈ ₱10 fee, ≈ ₱446 net). Every order row records
   `payment_fee` and `payment_net` in centavos.
3. **Clearing** — the payment must clear through PayMongo's settlement partners
   before it can be paid out.
4. **Payout** to the bank account registered in the PayMongo dashboard. Payouts
   are generated daily at 9:00 AM PHT; the **default schedule is weekly, every
   Wednesday** (payments cleared by 5 PM Wednesday). Daily, bi-weekly and monthly
   are available. Holidays roll to the next banking day.
5. **The bank account must be in the registered business name** (corporation,
   partnership or sole proprietorship), or payouts are delayed.

- *Instant Settlement* (add-on) makes GCash, QR Ph and card payments available
  in the PayMongo Wallet immediately instead of waiting for the schedule.
- Refunds come out of the balance; card disputes can hold or reverse funds.
- **Test mode moves no money at all** — no charges, no payouts.

## How the flow works in this build

```
Cart ──▶ create-checkout (Edge Function) ──▶ PayMongo hosted page ──▶ /order/result
            │ reads real prices from DB          card / GCash / Maya        │ polls order-status
            │ inserts orders row: pending                                    │
            ▼                                                                ▼
         public.orders ◀── paymongo-webhook (signature verified) ── order-status
                              both ask PayMongo directly before marking paid
```

| Piece | Where | Job |
| --- | --- | --- |
| Pricing rule | `supabase/functions/_shared/pricing.ts` | One function used by the browser **and** the server, so the shown total is the charged total |
| `create-checkout` | `supabase/functions/create-checkout` | Prices the cart from `public.products`, creates the order, opens a PayMongo Checkout Session |
| `order-status` | `supabase/functions/order-status` | What the result page polls; confirms with PayMongo if still pending |
| `paymongo-webhook` | `supabase/functions/paymongo-webhook` | Verifies `Paymongo-Signature`, then confirms with PayMongo |
| Tables | `supabase/005_orders.sql` | `fx_rates`, `orders`, `order_items`, `payment_events` |

**Safety rules the code keeps**

- The browser sends product ids and quantities only — never prices.
- Secret keys live in Supabase secrets, never in `.env` / `VITE_` variables.
- An order is marked paid only when PayMongo itself reports a `paid` payment for
  **exactly** the order total. A different amount becomes `review`, not `paid`.
- The webhook rejects anything whose HMAC signature does not verify
  (`npm run test:payments` covers forged and tampered events).
- Order rows are not readable by the public; the result page needs the order id
  **and** its random access token.

## Turning it on (test mode)

You do these steps yourself — they use your accounts and your keys.

1. **PayMongo** — sign up at dashboard.paymongo.com. In test mode, open
   *Developers → API keys* and copy the **secret key** (`sk_test_…`).
2. **Database** — run `supabase/005_orders.sql` in the Supabase SQL editor.
3. **Supabase CLI** — log in (opens your browser):

   ```bash
   npx supabase login
   ```

4. **Secrets** — paste your own test key in place of `sk_test_xxx`:

   ```bash
   npx supabase secrets set --project-ref qvclouuywvogodrajpvm PAYMONGO_SECRET_KEY=sk_test_xxx SITE_URL=http://localhost:5183 ALLOWED_ORIGINS=http://localhost:5183,http://localhost:5184
   ```

5. **Deploy the three functions** (if the CLI asks for a config, run
   `npx supabase init` once in the project folder, then repeat):

   ```bash
   npx supabase functions deploy create-checkout --project-ref qvclouuywvogodrajpvm
   npx supabase functions deploy order-status --project-ref qvclouuywvogodrajpvm
   npx supabase functions deploy paymongo-webhook --no-verify-jwt --project-ref qvclouuywvogodrajpvm
   ```

   At this point checkout already works end to end: the result page confirms
   payments by asking PayMongo directly, even before a webhook exists.

6. **Webhook** — in the PayMongo dashboard create a webhook pointing at

   ```
   https://qvclouuywvogodrajpvm.supabase.co/functions/v1/paymongo-webhook
   ```

   for the events `checkout_session.payment.paid`, `payment.paid` and
   `payment.failed`. Copy its secret (`whsk_…`) and store it:

   ```bash
   npx supabase secrets set --project-ref qvclouuywvogodrajpvm PAYMONGO_WEBHOOK_SECRET=whsk_xxx
   ```

## Test payments

| Try | Use | Expect |
| --- | --- | --- |
| Card, success | `4343 4343 4343 4345`, any future expiry, any CVC | Result page: *Payment received* |
| Card, 3-D Secure | `4120 0000 0000 0007` → choose **Authorize** | Paid |
| Card, declined | `4111 1111 1111 1111` | Stays pending; retry on PayMongo's page |
| Insufficient funds | `5100 0000 0000 0198` | Declined |
| GCash / Maya | pick it on the PayMongo page → **Authorize** or **Fail** | Paid / not paid |

Check orders while testing:

```sql
select id, status, total / 100.0 as total_php, payment_method,
       payment_fee / 100.0 as fee_php, payment_net / 100.0 as net_php, paid_at
  from public.orders order by created_at desc limit 20;
```

## Going live

Switch the secret to your `sk_live_…` key (the webhook then verifies the `li`
signature automatically), create a live-mode webhook and store its secret, set
`SITE_URL` / `ALLOWED_ORIGINS` to the real domain, and activate the account in
the PayMongo dashboard with the business's documents and bank account.

## Known limits of this build

- **Charged in pesos only.** PayMongo supports PHP only, so ID and KO visitors
  also pay in PHP; the checkout says so. Indonesia or Korea would need Xendit /
  Midtrans or a Korean PG alongside.
- **The exchange rate is a placeholder** (`fx_rates`, PHP 0.0422 per won). Set
  real rates there — or better, store fixed peso prices — before going live.
  The storefront and the checkout both read that table, so they stay in step.
- **Guest checkout only.** No accounts, no order history, no emails yet.
- **Shipping** is ₩3,000 (₱127) under ₩20,000, free from ₩20,000 — the
  reference's rule, defined once in `pricing.ts`.
