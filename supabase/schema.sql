-- =============================================================================
--  MQNY storefront — Supabase schema
--  Run this whole file in the Supabase SQL editor. It is idempotent: running it
--  again will not duplicate rows or error out.
--
--  WHAT THE APP READS TODAY
--    public.image_slots   ← the only table the front end queries right now.
--                           Every picture on the page comes from here.
--
--  WHAT IS HERE FOR THE NEXT STEP (created and seeded, not read yet)
--    public.products      ← product positions, prices, swatches
--    public.product_copy  ← per-language product name and description
--    public.hero_slides   ← hero order
--    public.mid_banners   ← the two-up event strip
--    public.site_copy     ← every other hard-coded string, per language
--
--  SECURITY MODEL
--    Row level security is ON for every table, with a read-only policy for the
--    anon role. The anon key in the browser can SELECT and nothing else. All
--    writes go through the dashboard or the service_role key, which bypasses
--    RLS and must never be shipped to a browser.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Types
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'site_locale') then
    create type public.site_locale as enum ('en', 'id', 'ko');
  end if;

  if not exists (select 1 from pg_type where typname = 'product_section') then
    create type public.product_section as enum ('best', 'new');
  end if;

  if not exists (select 1 from pg_type where typname = 'slot_kind') then
    create type public.slot_kind as enum ('logo', 'icon', 'hero', 'product', 'banner', 'recent');
  end if;
end
$$;

-- -----------------------------------------------------------------------------
-- 1. image_slots — the picture table
--
--    One row per named slot. `locale` is NULL for artwork used in every
--    language, or 'en' / 'id' / 'ko' for artwork with text baked into the
--    image (hero banners above all). The app looks for `<slot>.<locale>`
--    first and falls back to the plain slot.
--
--    `ratio_hint` is documentation for whoever uploads: the layout already owns
--    the box, so an upload of the wrong shape will be cropped, never allowed to
--    move the page.
-- -----------------------------------------------------------------------------
create table if not exists public.image_slots (
  id            uuid primary key default gen_random_uuid(),
  slot          text not null,
  locale        public.site_locale,
  kind          public.slot_kind not null,
  url           text,
  storage_path  text,
  alt_text      text,
  ratio_hint    text,
  sort_order    integer not null default 0,
  updated_at    timestamptz not null default now()
);

-- One row per slot per language.
--
-- NULL means "all languages", and in Postgres two NULLs never collide, so a
-- plain unique (slot, locale) would happily allow duplicate global rows. Two
-- partial indexes solve that without an expression: casting an enum to text is
-- only STABLE, not IMMUTABLE, so coalesce(locale::text, '*') cannot be indexed.
create unique index if not exists image_slots_slot_global_idx
  on public.image_slots (slot)
  where locale is null;

create unique index if not exists image_slots_slot_locale_idx
  on public.image_slots (slot, locale)
  where locale is not null;

-- -----------------------------------------------------------------------------
-- 2. products — positions, prices, swatches
--
--    `id` matches the card ids the app already uses ('b1' … 'n3').
--    `position` is the 1-based order inside its own grid, so the three-up
--    layout is driven by data rather than by array order in the code.
--    Prices are whole Korean won: the front end converts to ₱ / Rp at render.
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id                text primary key,
  section           public.product_section not null,
  position          integer not null,
  href              text not null,
  thumb_slot        text not null,
  colors            text[] not null default '{}',
  price_krw         integer not null check (price_krw >= 0),
  custom_price_krw  integer check (custom_price_krw >= 0),
  discount_rate     smallint check (discount_rate between 0 and 100),
  rank              smallint,
  is_active         boolean not null default true,
  updated_at        timestamptz not null default now(),
  constraint products_section_position_key unique (section, position)
);

-- -----------------------------------------------------------------------------
-- 3. product_copy — the translated part of a product
--    Split from `products` so a price change and a translation never collide.
-- -----------------------------------------------------------------------------
create table if not exists public.product_copy (
  product_id    text not null references public.products (id) on delete cascade,
  locale        public.site_locale not null,
  name          text not null,
  desc_tag      text not null,
  desc_benefit  text not null,
  updated_at    timestamptz not null default now(),
  primary key (product_id, locale)
);

-- -----------------------------------------------------------------------------
-- 4. hero_slides and mid_banners — ordered content blocks
-- -----------------------------------------------------------------------------
create table if not exists public.hero_slides (
  position   integer primary key,
  slot       text not null,
  href       text not null,
  is_active  boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.mid_banners (
  position   integer primary key,
  slot       text not null,
  href       text not null,
  is_active  boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 5. site_copy — every remaining hard-coded string, per language
--    `key` mirrors the dot path in src/i18n/messages/*.ts, e.g.
--    'promo.text', 'sections.best.subtitle', 'footer.cs.heading'.
-- -----------------------------------------------------------------------------
create table if not exists public.site_copy (
  key        text not null,
  locale     public.site_locale not null,
  value      text not null,
  updated_at timestamptz not null default now(),
  primary key (key, locale)
);

-- -----------------------------------------------------------------------------
-- 6. Row level security — public read, no public write
-- -----------------------------------------------------------------------------
alter table public.image_slots  enable row level security;
alter table public.products     enable row level security;
alter table public.product_copy enable row level security;
alter table public.hero_slides  enable row level security;
alter table public.mid_banners  enable row level security;
alter table public.site_copy    enable row level security;

drop policy if exists "public read image_slots"  on public.image_slots;
drop policy if exists "public read products"     on public.products;
drop policy if exists "public read product_copy" on public.product_copy;
drop policy if exists "public read hero_slides"  on public.hero_slides;
drop policy if exists "public read mid_banners"  on public.mid_banners;
drop policy if exists "public read site_copy"    on public.site_copy;

create policy "public read image_slots"  on public.image_slots  for select to anon, authenticated using (true);
create policy "public read products"     on public.products     for select to anon, authenticated using (true);
create policy "public read product_copy" on public.product_copy for select to anon, authenticated using (true);
create policy "public read hero_slides"  on public.hero_slides  for select to anon, authenticated using (true);
create policy "public read mid_banners"  on public.mid_banners  for select to anon, authenticated using (true);
create policy "public read site_copy"    on public.site_copy    for select to anon, authenticated using (true);

-- No insert / update / delete policies exist on purpose. Editing through the
-- dashboard still works: it authenticates as service_role, which bypasses RLS.

-- -----------------------------------------------------------------------------
-- 7. Storage bucket for the images themselves
--    Public bucket: the files are readable by URL, uploads are not public.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- =============================================================================
--  SEED — mirrors exactly what the page renders today.
--  Every image_slots row starts with url = NULL, so running this changes
--  nothing on screen until you point a slot at a file.
-- =============================================================================

insert into public.image_slots (slot, locale, kind, ratio_hint, sort_order) values
  ('logo_header',       null, 'logo',    '195 x 26, max-width 240',      10),
  ('logo_footer',       null, 'logo',    '195 x 26, dark version',       11),

  ('icon_cart',         null, 'icon',    '27 x 28',                      20),
  ('icon_cart_pill',    null, 'icon',    '18 x 18, sits in the dark pill',21),
  ('icon_alarm',        null, 'icon',    '24 x 24 bell',                 22),
  ('icon_hero_prev',    null, 'icon',    '29 x 61 chevron',              23),
  ('icon_hero_next',    null, 'icon',    '29 x 61 chevron',              24),
  ('icon_top_arrow',    null, 'icon',    '18 x 12 chevron',              25),
  ('icon_search',       null, 'icon',    '22 x 22 magnifier',            26),
  ('icon_close',        null, 'icon',    '14 x 14',                      27),
  ('icon_instagram',    null, 'icon',    '22 x 22',                      28),
  ('icon_facebook',     null, 'icon',    '22 x 22',                      29),
  ('icon_naver',        null, 'icon',    '22 x 22',                      30),
  ('icon_page_first',   null, 'icon',    '32 x 32 sprite',               31),
  ('icon_page_prev',    null, 'icon',    '32 x 32 sprite',               32),
  ('icon_page_next',    null, 'icon',    '32 x 32 sprite',               33),
  ('icon_page_last',    null, 'icon',    '32 x 32 sprite',               34),

  ('hero_slide_1',      null, 'hero',    '1550 x 560 (~2.77:1)',         40),
  ('hero_slide_2',      null, 'hero',    '1550 x 560 (~2.77:1)',         41),
  ('hero_slide_3',      null, 'hero',    '1550 x 560 (~2.77:1)',         42),

  ('mid_banner_left',   null, 'banner',  '710 x 240 (~3:1)',             50),
  ('mid_banner_right',  null, 'banner',  '710 x 240 (~3:1)',             51),
  ('mid_badge',         null, 'banner',  '92 x 92 circle, rotates',      52),

  ('product_thumb_b1',  null, 'product', 'square master, 1:1',           60),
  ('product_thumb_b2',  null, 'product', 'square master, 1:1',           61),
  ('product_thumb_b3',  null, 'product', 'square master, 1:1',           62),
  ('product_thumb_b4',  null, 'product', 'square master, 1:1',           63),
  ('product_thumb_b5',  null, 'product', 'square master, 1:1',           64),
  ('product_thumb_b6',  null, 'product', 'square master, 1:1',           65),
  ('product_thumb_b7',  null, 'product', 'square master, 1:1',           66),
  ('product_thumb_b8',  null, 'product', 'square master, 1:1',           67),
  ('product_thumb_b9',  null, 'product', 'square master, 1:1',           68),
  ('product_thumb_n1',  null, 'product', 'square master, 1:1',           69),
  ('product_thumb_n2',  null, 'product', 'square master, 1:1',           70),
  ('product_thumb_n3',  null, 'product', 'square master, 1:1',           71),

  ('recent_thumb_1',    null, 'recent',  'square master, 1:1',           80),
  ('recent_thumb_2',    null, 'recent',  'square master, 1:1',           81),
  ('recent_thumb_3',    null, 'recent',  'square master, 1:1',           82),
  ('recent_thumb_4',    null, 'recent',  'square master, 1:1',           83)
on conflict (slot) where locale is null do nothing;

-- Per-language hero artwork. Fill these only if the banner has text baked into
-- the image; if a row stays empty the plain hero_slide_n is used instead.
insert into public.image_slots (slot, locale, kind, ratio_hint, sort_order) values
  ('hero_slide_1', 'en', 'hero', '1550 x 560, English artwork',    43),
  ('hero_slide_1', 'id', 'hero', '1550 x 560, Indonesian artwork', 44),
  ('hero_slide_1', 'ko', 'hero', '1550 x 560, Korean artwork',     45),
  ('hero_slide_2', 'en', 'hero', '1550 x 560, English artwork',    46),
  ('hero_slide_2', 'id', 'hero', '1550 x 560, Indonesian artwork', 47),
  ('hero_slide_2', 'ko', 'hero', '1550 x 560, Korean artwork',     48),
  ('hero_slide_3', 'en', 'hero', '1550 x 560, English artwork',    49),
  ('hero_slide_3', 'id', 'hero', '1550 x 560, Indonesian artwork', 50),
  ('hero_slide_3', 'ko', 'hero', '1550 x 560, Korean artwork',     51)
on conflict (slot, locale) where locale is not null do nothing;

-- Products, in the exact order and with the exact prices the page shows now.
insert into public.products
  (id, section, position, href, thumb_slot, colors, price_krw, custom_price_krw, discount_rate, rank) values
  ('b1', 'best', 1, '/product/b1', 'product_thumb_b1', '{"#cb535b","#db605c","#ef645a","#ff5770","#de2a45"}',                            10800, 18000, 40, 1),
  ('b2', 'best', 2, '/product/b2', 'product_thumb_b2', '{"#7f604b","#4c3120","#3d3530","#423e3e"}',                                       9100, 13000, 30, 2),
  ('b3', 'best', 3, '/product/b3', 'product_thumb_b3', '{"#181612","#4a3b32","#60433a"}',                                                 8400, 14000, 40, 3),
  ('b4', 'best', 4, '/product/b4', 'product_thumb_b4', '{"#181612","#4a3b32"}',                                                           8400, 14000, 40, 4),
  ('b5', 'best', 5, '/product/b5', 'product_thumb_b5', '{"#de7584","#cf4151","#c04258","#d37367","#c43b43","#c05963","#a72d33"}',        11700, 18000, 35, 5),
  ('b6', 'best', 6, '/product/b6', 'product_thumb_b6', '{}',                                                                             22400, 32000, 30, 6),
  ('b7', 'best', 7, '/product/b7', 'product_thumb_b7', '{"#ff6363","#ff8cdb","#ff9696","#ff694f","#ff0569","#fc7584","#ff7876","#ee6556","#c85960"}', 10400, 16000, 35, 7),
  ('b8', 'best', 8, '/product/b8', 'product_thumb_b8', '{}',                                                                             15600, 26000, 40, 8),
  ('b9', 'best', 9, '/product/b9', 'product_thumb_b9', '{"#a36f4a","#834025","#48260b","#3e2717"}',                                       8400, 14000, 40, 9),
  ('n1', 'new',  1, '/product/n1', 'product_thumb_n1', '{"#cf5123","#ca2219","#c34b61","#e10b32","#bc5355"}',                            10400, 16000, 35, null),
  ('n2', 'new',  2, '/product/n2', 'product_thumb_n2', '{}',                                                                             27300, 42000, 35, null),
  ('n3', 'new',  3, '/product/n3', 'product_thumb_n3', '{"#ffffff","#fe6672","#ff2b4e"}',                                                11700, 18000, 35, null)
on conflict (id) do nothing;

insert into public.hero_slides (position, slot, href) values
  (1, 'hero_slide_1', '/product/new-arrival'),
  (2, 'hero_slide_2', '/event/best'),
  (3, 'hero_slide_3', '/category/eye')
on conflict (position) do nothing;

insert into public.mid_banners (position, slot, href) values
  (1, 'mid_banner_left',  '/event/membership'),
  (2, 'mid_banner_right', '/event/bundle')
on conflict (position) do nothing;

-- =============================================================================
--  HOW TO PUT A PICTURE ON THE PAGE
--
--  1. Storage → site-images → upload, e.g. products/b1.jpg
--  2. Copy its public URL, or build it:
--       https://<project-ref>.supabase.co/storage/v1/object/public/site-images/products/b1.jpg
--  3. Point the slot at it:
--
--       update public.image_slots
--          set url          = 'https://<project-ref>.supabase.co/storage/v1/object/public/site-images/products/b1.jpg',
--              storage_path = 'products/b1.jpg',
--              alt_text     = 'Velvet Blur Lip Tint No.01',
--              updated_at   = now()
--        where slot = 'product_thumb_b1'
--          and locale is null;
--
--  4. Reload the page. The placeholder is replaced in the same box — the
--     layout does not move.
--
--  To clear one again: set url = null where slot = '…';
-- =============================================================================

-- Check what is wired up:
--   select kind, slot, locale, (url is not null) as has_image
--     from public.image_slots
--    order by sort_order, slot;
