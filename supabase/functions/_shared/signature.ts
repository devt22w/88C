/**
 * PayMongo webhook signature verification.
 *
 * Header:  Paymongo-Signature: t=<unix seconds>,te=<test hex>,li=<live hex>
 * Signed:  HMAC-SHA256(key = the webhook's secret, message = t + "." + raw body)
 * Compare: `te` for test-mode events, `li` for live-mode events.
 *
 * Without this check anyone could POST a fake "paid" event to the webhook and
 * receive goods without paying. The raw body must be used exactly as received
 * — re-serialising parsed JSON changes the bytes and breaks the signature.
 *
 * Web Crypto only, so it runs unchanged in Deno (Supabase) and Node (tests).
 */

export interface SignatureParts {
  t: string;
  te: string;
  li: string;
}

export function parseSignatureHeader(header: string | null | undefined): SignatureParts | null {
  if (!header) return null;
  const parts: Record<string, string> = {};
  for (const piece of header.split(',')) {
    const index = piece.indexOf('=');
    if (index === -1) continue;
    parts[piece.slice(0, index).trim()] = piece.slice(index + 1).trim();
  }
  if (!parts.t) return null;
  return { t: parts.t, te: parts.te ?? '', li: parts.li ?? '' };
}

export async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/** constant-time comparison, so response timing leaks nothing about the secret */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length || a.length === 0) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i += 1) {
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return difference === 0;
}

export async function verifyPaymongoSignature(
  rawBody: string,
  header: string | null | undefined,
  secret: string,
  live: boolean
): Promise<boolean> {
  const parts = parseSignatureHeader(header);
  if (!parts || !secret) return false;
  const expected = await hmacSha256Hex(secret, `${parts.t}.${rawBody}`);
  return timingSafeEqual(expected, live ? parts.li : parts.te);
}
