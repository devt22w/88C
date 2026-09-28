-- =============================================================================
--  003 — categories and the rest of the catalogue
--
--  Run after schema.sql and 002_catalogue_alignment.sql.
--
--  Adds the shelf a product sits on, relaxes the home-page placement so a
--  product can exist without appearing on the front page, and seeds the 26
--  catalogue-only products that fill EYE / LIP / FACE / ACC&TOOL.
--
--  Safe to re-run.
-- =============================================================================

-- ---- 1. the shelf -----------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_category') then
    create type public.product_category as enum ('eye', 'lip', 'face', 'accTool');
  end if;
end
$$;

alter table public.products add column if not exists category public.product_category;

-- home placement is now optional: most products live only on a category page
alter table public.products alter column section  drop not null;
alter table public.products alter column position drop not null;

-- ---- 2. shelve the twelve products that are already there -------------------
update public.products as p set category = v.category::public.product_category
from (values
  ('b1', 'lip'), ('b2', 'eye'), ('b3', 'eye'), ('b4', 'eye'),
  ('b5', 'lip'), ('b6', 'eye'), ('b7', 'lip'), ('b8', 'face'),
  ('b9', 'eye'), ('n1', 'lip'), ('n2', 'face'), ('n3', 'lip')
) as v (id, category)
where p.id = v.id;

-- ---- 3. the rest of the catalogue -------------------------------------------
-- No discount or swatch data was captured for these, so they carry a single
-- price and an empty colour list. The 15px chip row is reserved either way, so
-- adding swatches later will not move the grid.
insert into public.products (id, category, href, thumb_slot, colors, price_krw)
values
  ('e1', 'eye',     '/product/e1', 'product_thumb_e1', '{}', 15000),
  ('e2', 'eye',     '/product/e2', 'product_thumb_e2', '{}', 12000),
  ('e3', 'eye',     '/product/e3', 'product_thumb_e3', '{}', 15000),
  ('e4', 'eye',     '/product/e4', 'product_thumb_e4', '{}',  8000),
  ('e5', 'eye',     '/product/e5', 'product_thumb_e5', '{}', 32000),

  ('l1', 'lip',     '/product/l1', 'product_thumb_l1', '{}', 14000),
  ('l2', 'lip',     '/product/l2', 'product_thumb_l2', '{}', 14000),
  ('l3', 'lip',     '/product/l3', 'product_thumb_l3', '{}', 18000),
  ('l4', 'lip',     '/product/l4', 'product_thumb_l4', '{}', 16000),
  ('l5', 'lip',     '/product/l5', 'product_thumb_l5', '{}', 18000),
  ('l6', 'lip',     '/product/l6', 'product_thumb_l6', '{}', 19000),
  ('l7', 'lip',     '/product/l7', 'product_thumb_l7', '{}', 19000),

  ('f1',  'face',   '/product/f1',  'product_thumb_f1',  '{}', 14000),
  ('f2',  'face',   '/product/f2',  'product_thumb_f2',  '{}', 16000),
  ('f3',  'face',   '/product/f3',  'product_thumb_f3',  '{}', 14000),
  ('f4',  'face',   '/product/f4',  'product_thumb_f4',  '{}', 33000),
  ('f5',  'face',   '/product/f5',  'product_thumb_f5',  '{}', 24000),
  ('f6',  'face',   '/product/f6',  'product_thumb_f6',  '{}', 23000),
  ('f7',  'face',   '/product/f7',  'product_thumb_f7',  '{}', 26000),
  ('f8',  'face',   '/product/f8',  'product_thumb_f8',  '{}', 19000),
  ('f9',  'face',   '/product/f9',  'product_thumb_f9',  '{}', 19000),
  ('f10', 'face',   '/product/f10', 'product_thumb_f10', '{}', 21000),

  ('a1', 'accTool', '/product/a1', 'product_thumb_a1', '{}', 10000),
  ('a2', 'accTool', '/product/a2', 'product_thumb_a2', '{}', 10000),
  ('a3', 'accTool', '/product/a3', 'product_thumb_a3', '{}', 10000),
  ('a4', 'accTool', '/product/a4', 'product_thumb_a4', '{}', 12000)
on conflict (id) do nothing;

-- ---- 4. an image slot for each new product ----------------------------------
insert into public.image_slots (slot, locale, kind, ratio_hint, sort_order)
select 'product_thumb_' || id, null, 'product', 'square master, 1:1', 100
from (values
  ('e1'),('e2'),('e3'),('e4'),('e5'),
  ('l1'),('l2'),('l3'),('l4'),('l5'),('l6'),('l7'),
  ('f1'),('f2'),('f3'),('f4'),('f5'),('f6'),('f7'),('f8'),('f9'),('f10'),
  ('a1'),('a2'),('a3'),('a4')
) as v (id)
on conflict (slot) where locale is null do nothing;

-- =============================================================================
--  GALLERY SLOTS
--
--  The product page reads product_gallery_<id>_1 … _5 for the thumbnail rail
--  and _6 for the long detail sheet. A row is only needed once you have a URL
--  for it — the rail shows exactly the frames that have pictures. Add one like
--  this:
--
--    insert into public.image_slots (slot, locale, kind, ratio_hint, sort_order)
--    values ('product_gallery_b1_2', null, 'product', 'square master, 1:1', 110)
--    on conflict (slot) where locale is null do nothing;
--
--    update public.image_slots
--       set url = 'https://<project-ref>.supabase.co/storage/v1/object/public/site-images/products/b1-2.jpg'
--     where slot = 'product_gallery_b1_2' and locale is null;
-- =============================================================================

-- Check the shelves:
--   select category, count(*) from public.products group by category order by category;
