# MQNY storefront clone — React + TypeScript + Vite

A desktop-first storefront homepage built to the measurements in
*MQNY / Macqueenmall — Full Visual Clone Spec & Master Prompt*. Every number in
the CSS (band widths, paddings, line-heights, hex values, easings) comes from
that document, and each rule is commented with the section it implements.

## What this is, and what it deliberately is not

- It reproduces the **layout, typography scale, spacing rhythm, colour tokens and
  motion** described in the spec.
- It contains **no artwork, wordmark, product photography or marketing copy from
  the reference site**. Section 11 of the spec requires every image to be an
  empty *named slot*, and that is exactly what ships here — placeholders that
  already own the right box. All text is generic placeholder copy.
- Swap the placeholder copy in `src/data/site.ts` and the slot URLs in
  `src/data/imageSources.ts` for real store data.

## Run it

```bash
npm install
npm run dev      # http://localhost:5183
npm run build    # tsc -b && vite build
```

## Database (Supabase)

Images now come from Supabase. Everything else is still in the code — that is
the next step, and the schema is already shaped for it.

### Setting it up

1. Open the Supabase SQL editor and run [`supabase/schema.sql`](supabase/schema.sql).
   It is idempotent, so re-running it is safe.
2. Paste your Project URL and **anon** key into `.env` (see `.env.example`).
3. Restart the dev server — Vite only reads `.env` at startup.
4. Upload files to the `site-images` storage bucket and point a slot at one:

```sql
update public.image_slots
   set url        = 'https://<project-ref>.supabase.co/storage/v1/object/public/site-images/products/b1.jpg',
       alt_text   = 'Velvet Blur Lip Tint No.01',
       updated_at = now()
 where slot = 'product_thumb_b1'
   and locale is null;
```

### What the app reads

Only `public.image_slots`. The query lives in
[`src/data/useImageSources.ts`](src/data/useImageSources.ts): it selects every
row with a URL and turns it into the same `{ slot: url }` map the static file
always provided. A row with a `locale` becomes `slot.locale`, which is how
per-language hero artwork works.

**Without credentials the page is unchanged** — `src/lib/supabase.ts` exports a
null client, the hook does nothing, and every slot renders its placeholder. A
failed query is logged and swallowed for the same reason: a database problem
must never blank the storefront.

### Tables waiting for the next step

`products` (positions, prices, swatches), `product_copy` (per-language name and
description), `hero_slides`, `mid_banners` and `site_copy` are created and
seeded to match the page exactly, but nothing reads them yet.

### Security

Row level security is on for every table with a **read-only policy for the anon
role** — the key in the browser can select and nothing else. There are no
insert, update or delete policies on purpose; the dashboard can still edit
because it authenticates as `service_role`, which bypasses RLS. Never put a
`service_role` key in a `VITE_` variable: those are compiled into the bundle
every visitor downloads.

## Injecting images (Section 11)

`src/data/imageSources.ts` is the single wiring point:

```ts
export const imageSources: SlotSources = {
  logo_header: 'https://cdn.example.com/logo.png',
  hero_slide_1: 'https://cdn.example.com/hero-1.jpg',
  product_thumb_b1: 'https://cdn.example.com/products/b1.jpg'
};
```

`<ImageSlot slot="…">` reads that map through a context, so a database-driven
map can be passed to `<ImageSlotProvider>` in `src/main.tsx` instead. A slot that
has no URL renders a neutral placeholder **in the same box**, so filling it in
never shifts the layout.

Slot names: `logo_header`, `logo_footer`, `icon_cart`, `icon_cart_pill`,
`icon_alarm`, `icon_hero_prev`, `icon_hero_next`, `icon_top_arrow`,
`icon_search`, `icon_close`, `icon_instagram`, `icon_facebook`, `icon_naver`,
`icon_page_first|prev|next|last`, `mid_banner_left`, `mid_banner_right`,
`mid_badge`, `hero_slide_{n}`, `product_thumb_{id}`, `recent_thumb_{n}`.

Rules the markup enforces for you:

- the cell, band or column owns its width / height / ratio — never the image;
- product masters must be **square** (the card reserves a 1:1 area at 90% width);
- the 44px two-line description clamp and the 15px colour-chip row are the two
  guards that keep a three-up row baseline-aligned on uneven data;
- the first hero slide loads `eager`, everything below it loads `lazy`.

## Click-to-translate (EN · ID · KO)

The switcher sits in the utility nav beside LOGIN / JOIN. One click swaps the
whole page in place — no reload, no route change.

**English is the base.** Resolution order on first paint: `?lang=` in the URL,
then the visitor's stored choice, then English. Every switch is written to
`localStorage` and mirrored into the URL, so a link can carry a language and a
returning visitor keeps theirs.

What a switch changes:

- every visible string — promo strip, both navs, hero copy, section titles,
  product names and descriptions, cart pill, mid banners, the whole footer, side
  menu, search modal and its hot-keyword list, TOP button;
- `<html lang>`, `<title>` and the meta description;
- `alt` text, `aria-label`s and input placeholders;
- **prices** — stored once in won, converted and formatted per locale:
  ₩18,000 → ₱760 → Rp 210.600;
- the body font stack — `html[lang="ko"]` promotes Noto Sans KR to the front.

### Adding or editing copy

`src/i18n/messages/{en,id,ko}.ts` are each typed as `Messages`, so a missing or
misspelled key is a build error rather than a blank spot on the page. Product
copy is keyed by `ProductId`, so forgetting to translate one product will not
compile. `src/data/site.ts` now holds **no display text at all** — only
structure (slots, links, swatches, won prices).

### Currency conversion — read this before shipping

`src/i18n/money.ts` holds the rate table. **The rates in it are hand-captured
placeholders and are already stale** — a live storefront must feed them from a
daily FX job or its pricing service. Everything reads through `convertFromKrw`,
so there is exactly one place to change. Rounding is per currency: whole pesos,
nearest hundred rupiah, nearest ten won.

### Translated artwork

`ImageSlot` takes a `localised` prop, used by the hero and the mid banners.
It looks for `<slot>.<locale>` first and falls back to the plain slot, so a
database can serve `hero_slide_1.ko` to Korean visitors and `hero_slide_1.id` to
Indonesian ones without any layout change.

### Fitting translations into fixed boxes

This is the part a spec-faithful clone gets wrong most easily: the card geometry
is fixed, so longer languages clip. Measured at the **1263px minimum width**,
where the description box is only 316px wide:

| Symptom | Found | Fix |
| --- | --- | --- |
| Description clipped by the 44px two-line clamp | 11 of 12 cards in EN, 8 of 12 in ID, 2 in KO | benefit lines rewritten shorter in all three catalogues |
| Cart pill grew past 212px and sat 25px off centre in ID | `MASUKKAN KERANJANG` measured 262px | label shortened to `KE KERANJANG`, and the pill now centres with `translateX(-50%)` instead of the spec's `margin-left: -106px` — identical at 212px, correct if a label ever runs long |

After the fixes, all three locales measure **0 clipped descriptions, 0 clipped
product names, 0 footer overflow, pill exactly 212px and perfectly centred**,
with the grid still 387.63px per cell and the hero still 560px.

When you write new copy, keep the benefit line under roughly 40 Latin characters
or 20 Hangul characters and it will fit.

## Where each spec section lives

| Spec | File |
| --- | --- |
| 1.1 fonts | `index.html` (Google Fonts), `src/styles/tokens.css` |
| 1.2 reset | `src/styles/reset.css` |
| 1.3 colour tokens | `src/styles/tokens.css` |
| 1.4 layout band, 3.5 animated underline, 10.4 reveal, 11 slot box | `src/styles/base.css` |
| 2 page skeleton | `src/App.tsx` |
| 3 header, 9.3 burger, 9.6 rails | `src/styles/header.css`, `src/components/Header.tsx` |
| 4 hero slider | `src/styles/hero.css`, `src/components/HeroSlider.tsx`, `src/hooks/useSlider.ts` |
| 5 section title | `src/components/SectionTitle.tsx` |
| 6 product grid and card, 7 mid banner | `src/styles/sections.css`, `src/components/ProductGrid.tsx`, `ProductCard.tsx`, `MidBanner.tsx` |
| 8 footer | `src/styles/footer.css`, `src/components/Footer.tsx` |
| 9 floating layer, pagination, forms | `src/styles/overlays.css`, `src/components/FloatingLayer.tsx` |
| 10 motion | easing variables in `tokens.css`, `useReveal.ts` |
| 12 breakpoints | `reset.css` (min-width) and `footer.css` media queries |
| 13 content inventory | `src/i18n/messages/*` (text) + `src/data/site.ts` (structure) |
| translation layer | `src/i18n/` and `src/components/LanguageSwitcher.tsx` |

## Verified against the Section 14 QA checklist

Measured in the browser from the running dev server:

| Check | Measured |
| --- | --- |
| Promo strip 40px, `#b6a59d` | 40px, `rgb(182,165,157)` |
| Header fixed at top 40px, 1px `#dbd6d3` border | `top: 40px`, `1px solid rgb(219,214,211)` |
| Spacer div 225px | 225px |
| Logo padding 38px 0, utility cluster pulled −120px | `38px 0px`, `-120px` |
| Search field 220 × 40 | 220 × 40 |
| Category links on an 80px line-height | 80px |
| Hero slides exactly 560px, dots 35px apart | 560px, 35px |
| BEST 160px below hero, grid 48px below title | 160px / 48px |
| NEW 95px below mid banner, grid 45px below title | 95px / 45px |
| h2 50px / 6px tracking, sub-line 11px right padding | 50px / 6px, 11px |
| Cards 33.33% with shared `#f0f0f0` hairlines | 478.3px cells, `1px solid rgb(240,240,240)`, `margin: -1px 0 0 -1px` |
| Card inner padding 40px 30px 20px | `40px 30px 20px` |
| Colour-chip row min-height 15px, description locked to 44px | 15px / 44px |
| Name 20px weight 500, price row 35px below | 20px / 500, 35px |
| Hover outline 2px `#2d2d2d` over 0.3s | `2px solid rgb(45,45,45)`, `0.3s ease-in-out` |
| Cart pill `#2d2d2d`, radius 30px, padding 16px 43.5px, ~212px | 212px, centred exactly |
| NEW thumbnails zoom 0.4s; BEST do not | `0.4s ease-in-out` on NEW only |
| Mid banner band 1443px, 100px below grid | 1443px / 100px |
| Badge rotation 7s linear infinite | `7s linear infinite spin` |
| Footer: 170px gap, 2px `#2d2d2d` rule, padding 68px 50px 80px | all three match |
| No browser underlines anywhere | 0 anchors with `text-decoration` |
| No box shadows on the page | 0 elements with a shadow |

## Notes on two deliberate deviations

1. **No Swiper dependency.** The spec names a v4-era Swiper for the hero. The
   behaviour (loop, autoplay, clickable dots, always-visible arrows) and the
   class hooks (`.swiper-wrapper`, `.swiper-slide`, `.swiper-pagination-bullet`)
   are reproduced in `useSlider.ts`, so the CSS contract is unchanged and the
   bundle carries no carousel library. Drop Swiper in later if you want its
   easing curve exactly.
2. **Hero chevrons are anchored to the content band**, not to the full-bleed
   slide, so they overhang the 1550px band by 25px as the QA checklist describes
   instead of falling off the left edge of the viewport.

Mobile is out of scope per Section 12: this is a fixed-width desktop skin that
holds a 1263px minimum and scrolls horizontally below it.
