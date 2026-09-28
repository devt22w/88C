/**
 * The two parts of the payment flow that must never be wrong:
 *
 *   1. the webhook signature check — a forged "paid" event must be rejected;
 *   2. price parity — for every product, the peso price the storefront prints
 *      must equal, to the centavo, the amount the checkout function charges.
 *
 * Run: npm run test:payments
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

import {
  FREE_SHIPPING_OVER_KRW,
  SHIPPING_FEE_KRW,
  isValidQuantity,
  krwToPhpCentavos,
  priceOrder,
  shippingKrw
} from '../supabase/functions/_shared/pricing.ts';
import {
  parseSignatureHeader,
  timingSafeEqual,
  verifyPaymongoSignature
} from '../supabase/functions/_shared/signature.ts';
import { RATES_FROM_KRW, convertFromKrw } from '../src/i18n/money.ts';
import { catalogue } from '../src/data/site.ts';

const PHP = RATES_FROM_KRW.en;

// ---------------------------------------------------------------------------
// 1. webhook signatures
// ---------------------------------------------------------------------------
const SECRET = 'whsk_test_example_secret';
const BODY = JSON.stringify({ data: { id: 'evt_1', attributes: { type: 'checkout_session.payment.paid' } } });
const T = '1789900000';
const sign = (secret: string, body: string) => createHmac('sha256', secret).update(`${T}.${body}`).digest('hex');

test('a correctly signed test-mode event is accepted', async () => {
  const header = `t=${T},te=${sign(SECRET, BODY)},li=`;
  assert.equal(await verifyPaymongoSignature(BODY, header, SECRET, false), true);
});

test('a test signature is not accepted as a live one', async () => {
  const header = `t=${T},te=${sign(SECRET, BODY)},li=`;
  assert.equal(await verifyPaymongoSignature(BODY, header, SECRET, true), false);
});

test('a live signature is accepted in live mode', async () => {
  const header = `t=${T},te=,li=${sign(SECRET, BODY)}`;
  assert.equal(await verifyPaymongoSignature(BODY, header, SECRET, true), true);
});

test('a body changed after signing is rejected (forged "paid")', async () => {
  const header = `t=${T},te=${sign(SECRET, BODY)},li=`;
  const forged = BODY.replace('evt_1', 'evt_2');
  assert.equal(await verifyPaymongoSignature(forged, header, SECRET, false), false);
});

test('a signature made with another secret is rejected', async () => {
  const header = `t=${T},te=${sign('someone_else', BODY)},li=`;
  assert.equal(await verifyPaymongoSignature(BODY, header, SECRET, false), false);
});

test('a missing or malformed header is rejected', async () => {
  assert.equal(await verifyPaymongoSignature(BODY, null, SECRET, false), false);
  assert.equal(await verifyPaymongoSignature(BODY, 'garbage', SECRET, false), false);
  assert.equal(await verifyPaymongoSignature(BODY, `t=${T}`, SECRET, false), false);
});

test('an empty secret never verifies anything', async () => {
  const header = `t=${T},te=${sign('', BODY)},li=`;
  assert.equal(await verifyPaymongoSignature(BODY, header, '', false), false);
});

test('the header parser reads t, te and li', () => {
  assert.deepEqual(parseSignatureHeader('t=1,te=abc,li=def'), { t: '1', te: 'abc', li: 'def' });
});

test('timing-safe comparison', () => {
  assert.equal(timingSafeEqual('abc', 'abc'), true);
  assert.equal(timingSafeEqual('abc', 'abd'), false);
  assert.equal(timingSafeEqual('abc', 'ab'), false);
  assert.equal(timingSafeEqual('', ''), false);
});

// ---------------------------------------------------------------------------
// 2. pricing
// ---------------------------------------------------------------------------
test('every product: printed peso price = charged amount (all 39)', () => {
  assert.equal(catalogue.length, 39);
  for (const product of catalogue) {
    const shown = convertFromKrw(product.priceKrw, 'en') * 100;
    const charged = krwToPhpCentavos(product.priceKrw, PHP);
    assert.equal(charged, shown, `${product.id}: shown ${shown} vs charged ${charged}`);
    if (product.customPriceKrw) {
      assert.equal(
        krwToPhpCentavos(product.customPriceKrw, PHP),
        convertFromKrw(product.customPriceKrw, 'en') * 100,
        `${product.id} struck price`
      );
    }
  }
});

test('shipping fee printed on the product page = shipping charged', () => {
  assert.equal(krwToPhpCentavos(SHIPPING_FEE_KRW, PHP), convertFromKrw(SHIPPING_FEE_KRW, 'en') * 100);
});

test('₩10,800 is ₱456 (45600 centavos)', () => {
  assert.equal(krwToPhpCentavos(10800, PHP), 45600);
});

test('shipping: ₩3,000 below ₩20,000, free from ₩20,000, none on an empty cart', () => {
  assert.equal(shippingKrw(FREE_SHIPPING_OVER_KRW - 1), SHIPPING_FEE_KRW);
  assert.equal(shippingKrw(FREE_SHIPPING_OVER_KRW), 0);
  assert.equal(shippingKrw(0), 0);
});

test('a small order pays shipping', () => {
  // 워터프루프 펜슬 젤 아이라이너 빅사이즈: ₩6,000 → ₱253, shipping ₩3,000 → ₱127
  const order = priceOrder([{ priceKrw: 6000, quantity: 1 }], PHP);
  assert.equal(order.subtotalCentavos, 25300);
  assert.equal(order.shippingCentavos, 12700);
  assert.equal(order.totalCentavos, 38000);
});

test('a larger order ships free, and lines are unit × quantity exactly', () => {
  const order = priceOrder(
    [
      { priceKrw: 10800, quantity: 2 }, // ₱456 × 2
      { priceKrw: 9100, quantity: 1 } //   ₱384
    ],
    PHP
  );
  assert.equal(order.lines[0].lineCentavos, 45600 * 2);
  assert.equal(order.subtotalKrw, 30700);
  assert.equal(order.shippingCentavos, 0);
  assert.equal(order.totalCentavos, 91200 + 38400);
});

test('quantity limits', () => {
  assert.equal(isValidQuantity(1), true);
  assert.equal(isValidQuantity(99), true);
  assert.equal(isValidQuantity(0), false);
  assert.equal(isValidQuantity(100), false);
  assert.equal(isValidQuantity(1.5), false);
  assert.equal(isValidQuantity('2'), false);
});
