-- =============================================================================
--  004 — the reference's catalogue, running order and the 39th product
--
--  Run after schema.sql, 002 and 003. Safe to re-run.
--
--  1. corrects the 26 catalogue-only products to the live prices, discounts
--     and shade swatches (003 had a single price and no swatches for them)
--  2. adds the 39th product, 멜팅 블러 틴트 (l8), and its image slot
--  3. stores the running order of every shelf exactly as the reference lists
--     it, so the order lives in the database when the app reads it from there
-- =============================================================================

-- ---- 1 + 2. prices, discounts, swatches; the new product -------------------
insert into public.products (id, category, href, thumb_slot, colors, price_krw, custom_price_krw, discount_rate)
values
  ('e1', 'eye', '/product/e1', 'product_thumb_e1', '{}', 9750, 15000, 35),
  ('e2', 'eye', '/product/e2', 'product_thumb_e2', '{"#a87653","#b48456","#744b2b","#806963","#594339","#3f302d"}', 8400, 12000, 30),
  ('e3', 'eye', '/product/e3', 'product_thumb_e3', '{"#d9aa5c"}', 9000, 15000, 40),
  ('e4', 'eye', '/product/e4', 'product_thumb_e4', '{"#3d3230","#6f504d","#90624b","#291820","#7c4e50","#9c4a3c","#da8d87"}', 6000, 8000, 25),
  ('e5', 'eye', '/product/e5', 'product_thumb_e5', '{}', 22400, 32000, 30),
  ('l1', 'lip', '/product/l1', 'product_thumb_l1', '{"#fdbec7","#fdc3e9","#f58743","#ff7e57","#ff4a4a","#f34e67","#fb8d8b"}', 9100, 14000, 35),
  ('l2', 'lip', '/product/l2', 'product_thumb_l2', '{"#e2a497","#dc8b90","#f6b9b3"}', 9100, 14000, 35),
  ('l3', 'lip', '/product/l3', 'product_thumb_l3', '{"#e07c84","#ea5d6d","#e15271","#eb8787","#e47d6f","#de4b5c"}', 11700, 18000, 35),
  ('l4', 'lip', '/product/l4', 'product_thumb_l4', '{"#f57996","#f06c82","#f13074","#ff817a","#f97678","#ff2530"}', 10400, 16000, 35),
  ('l5', 'lip', '/product/l5', 'product_thumb_l5', '{"#ee8278","#ed8487","#f86b72","#f36f66","#db5c55","#d65e68"}', 11700, 18000, 35),
  ('l6', 'lip', '/product/l6', 'product_thumb_l6', '{"#ed6c83","#dd6064","#d31e45","#e03e69","#de4b5e","#d46d7e","#f3bfda"}', 12350, 19000, 35),
  ('l7', 'lip', '/product/l7', 'product_thumb_l7', '{"#cb5240","#b23a46","#f75944","#d71f38","#ae0704","#5f001b","#7d0109"}', 12300, 19000, 35),
  ('l8', 'lip', '/product/l8', 'product_thumb_l8', '{"#f18b79","#d77980","#c22429","#d06967","#b15062","#893430","#500310"}', 12300, 19000, 35),
  ('f1', 'face', '/product/f1', 'product_thumb_f1', '{}', 10500, 14000, 25),
  ('f2', 'face', '/product/f2', 'product_thumb_f2', '{"#e6bda1","#9f8272","#c7a98f"}', 12000, 16000, 25),
  ('f3', 'face', '/product/f3', 'product_thumb_f3', '{}', 10500, 14000, 25),
  ('f4', 'face', '/product/f4', 'product_thumb_f4', '{}', 24750, 33000, 25),
  ('f5', 'face', '/product/f5', 'product_thumb_f5', '{}', 15600, 24000, 35),
  ('f6', 'face', '/product/f6', 'product_thumb_f6', '{}', 13800, 23000, 40),
  ('f7', 'face', '/product/f7', 'product_thumb_f7', '{"#e6bda1","#9f8272","#c7a98f"}', 16900, 26000, 35),
  ('f8', 'face', '/product/f8', 'product_thumb_f8', '{}', 12350, 19000, 35),
  ('f9', 'face', '/product/f9', 'product_thumb_f9', '{}', 12350, 19000, 35),
  ('f10', 'face', '/product/f10', 'product_thumb_f10', '{}', 13650, 21000, 35),
  ('a1', 'accTool', '/product/a1', 'product_thumb_a1', '{}', 10000, null, null),
  ('a2', 'accTool', '/product/a2', 'product_thumb_a2', '{}', 7000, 10000, 30),
  ('a3', 'accTool', '/product/a3', 'product_thumb_a3', '{}', 7000, 10000, 30),
  ('a4', 'accTool', '/product/a4', 'product_thumb_a4', '{}', 8400, 12000, 30)
on conflict (id) do update set
  category         = excluded.category,
  colors           = excluded.colors,
  price_krw        = excluded.price_krw,
  custom_price_krw = excluded.custom_price_krw,
  discount_rate    = excluded.discount_rate,
  updated_at       = now();

insert into public.image_slots (slot, locale, kind, ratio_hint, sort_order)
values ('product_thumb_l8', null, 'product', 'square master, 1:1', 100)
on conflict (slot) where locale is null do nothing;

-- ---- 3. running order on every shelf ---------------------------------------
create table if not exists public.category_positions (
  category   text not null check (category in ('all', 'eye', 'lip', 'face', 'accTool')),
  position   integer not null,
  product_id text not null references public.products (id) on delete cascade,
  primary key (category, position),
  unique (category, product_id)
);

alter table public.category_positions enable row level security;
drop policy if exists "public read category_positions" on public.category_positions;
create policy "public read category_positions" on public.category_positions
  for select to anon, authenticated using (true);

-- rebuild the order from scratch so re-running always matches the reference
delete from public.category_positions;

insert into public.category_positions (category, position, product_id) values
  ('all', 1, 'f10'),
  ('all', 2, 'l7'),
  ('all', 3, 'f9'),
  ('all', 4, 'f8'),
  ('all', 5, 'n1'),
  ('all', 6, 'n2'),
  ('all', 7, 'n3'),
  ('all', 8, 'f7'),
  ('all', 9, 'l6'),
  ('all', 10, 'l5'),
  ('all', 11, 'f6'),
  ('all', 12, 'e5'),
  ('all', 13, 'l4'),
  ('all', 14, 'l3'),
  ('all', 15, 'b1'),
  ('all', 16, 'b7'),
  ('all', 17, 'f5'),
  ('all', 18, 'b5'),
  ('all', 19, 'b8'),
  ('all', 20, 'b4'),
  ('all', 21, 'f4'),
  ('all', 22, 'a4'),
  ('all', 23, 'e4'),
  ('all', 24, 'b6'),
  ('all', 25, 'l2'),
  ('all', 26, 'e3'),
  ('all', 27, 'f3'),
  ('all', 28, 'a3'),
  ('all', 29, 'b2'),
  ('all', 30, 'a2'),
  ('all', 31, 'b9'),
  ('all', 32, 'f2'),
  ('all', 33, 'e2'),
  ('all', 34, 'a1'),
  ('all', 35, 'e1'),
  ('all', 36, 'b3'),
  ('all', 37, 'f1'),
  ('all', 38, 'l1'),
  ('all', 39, 'l8'),
  ('eye', 1, 'b3'),
  ('eye', 2, 'e1'),
  ('eye', 3, 'e2'),
  ('eye', 4, 'b9'),
  ('eye', 5, 'b2'),
  ('eye', 6, 'e3'),
  ('eye', 7, 'b6'),
  ('eye', 8, 'e4'),
  ('eye', 9, 'b4'),
  ('eye', 10, 'e5'),
  ('lip', 1, 'l1'),
  ('lip', 2, 'l2'),
  ('lip', 3, 'b5'),
  ('lip', 4, 'b7'),
  ('lip', 5, 'b1'),
  ('lip', 6, 'l3'),
  ('lip', 7, 'l4'),
  ('lip', 8, 'l5'),
  ('lip', 9, 'l6'),
  ('lip', 10, 'n3'),
  ('lip', 11, 'n1'),
  ('lip', 12, 'l7'),
  ('lip', 13, 'l8'),
  ('face', 1, 'f1'),
  ('face', 2, 'f2'),
  ('face', 3, 'f3'),
  ('face', 4, 'f4'),
  ('face', 5, 'b8'),
  ('face', 6, 'f5'),
  ('face', 7, 'f6'),
  ('face', 8, 'f7'),
  ('face', 9, 'n2'),
  ('face', 10, 'f8'),
  ('face', 11, 'f9'),
  ('face', 12, 'f10'),
  ('accTool', 1, 'a1'),
  ('accTool', 2, 'a2'),
  ('accTool', 3, 'a3'),
  ('accTool', 4, 'a4');

-- Check it:
--   select c.category, c.position, c.product_id, p.price_krw
--     from public.category_positions c join public.products p on p.id = c.product_id
--    order by c.category, c.position;
