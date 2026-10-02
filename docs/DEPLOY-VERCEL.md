# Putting the storefront on Vercel

A temporary link so the owner can open the shop on a phone, in any language,
without anyone running a dev server.

## The stack, in the words Vercel asks for

| Vercel field | Answer |
| --- | --- |
| **Framework Preset** | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js Version | 20.x or 22.x |
| Root Directory | leave as `./` |

`vercel.json` in the repo already states all of this, so the defaults it
offers should match. The one thing that file adds and the preset does not: a
rewrite that sends every unknown path to `index.html`. Without it a shopper
who refreshes on `/product/b9` gets a 404, because routing happens in the
browser, not on the server.

## Environment variables

Add these under **Settings → Environment Variables**, for Production *and*
Preview:

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://qvclouuywvogodrajpvm.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the **anon / public** key from Supabase → Project Settings → API |

Both are read in the browser, which is why they carry the `VITE_` prefix and
why only the anon key may ever appear here. The service-role key and the
PayMongo secret live in Supabase secrets and never leave the server.

## After the first deploy

Vercel gives a URL such as `https://88c.vercel.app`. Two follow-ups:

1. **Tell the checkout about it**, so the payment provider is allowed to send
   customers back to it:

   ```bash
   npx supabase secrets set --project-ref qvclouuywvogodrajpvm \
     SITE_URL=https://88c.vercel.app \
     ALLOWED_ORIGINS=https://88c.vercel.app,http://localhost:5183,http://localhost:5184
   ```

   Not urgent while `ONLINE_PAYMENT_LIVE` is false — nothing can reach the
   payment page yet — but it has to be done before going live.

2. **Password-protect it if the link is only for the owner.** Vercel does this
   under Settings → Deployment Protection. A public link means anyone who
   guesses the address can read the shop.

## What the owner will see

Everything the shop does today: the catalogue in English, Korean and
Indonesian with prices in pesos, rupiah or won; live search; the product page;
the cart; the Shopping Guide and CS pages; accounts and MY PAGE; and the
notice that online payment is being set up and orders are settled in cash for
now.

The staff console at `/admin/orders` works on the deployed site too, and still
needs an account listed in `public.app_admins`.

## The stack itself

- **React 18 + TypeScript**, built by **Vite 5** — a static bundle, no server
  of its own
- **Supabase** for the database, the images, accounts and the three Edge
  Functions behind payment
- **PayMongo** for payments, in test mode, switched off on the storefront
  until the merchant account is live
