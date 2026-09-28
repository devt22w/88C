-- =============================================================================
--  002 — catalogue alignment
--
--  Run this in the Supabase SQL editor AFTER schema.sql.
--
--  schema.sql seeds products with ON CONFLICT DO NOTHING, so rows that already
--  exist keep their old values. This file updates them in place to the live
--  catalogue: prices, discount rates and shade swatches for all twelve cards.
--
--  Safe to re-run — every statement is an idempotent UPDATE.
-- =============================================================================

update public.products as p set
  colors           = v.colors,
  price_krw        = v.price_krw,
  custom_price_krw = v.custom_price_krw,
  discount_rate    = v.discount_rate,
  rank             = v.rank,
  section          = v.section::public.product_section,
  position         = v.position,
  updated_at       = now()
from (values
  ('b1', 'best', 1, '{"#cb535b","#db605c","#ef645a","#ff5770","#de2a45"}'::text[],                                                     10800, 18000, 40, 1),
  ('b2', 'best', 2, '{"#7f604b","#4c3120","#3d3530","#423e3e"}'::text[],                                                                9100, 13000, 30, 2),
  ('b3', 'best', 3, '{"#181612","#4a3b32","#60433a"}'::text[],                                                                          8400, 14000, 40, 3),
  ('b4', 'best', 4, '{"#181612","#4a3b32"}'::text[],                                                                                    8400, 14000, 40, 4),
  ('b5', 'best', 5, '{"#de7584","#cf4151","#c04258","#d37367","#c43b43","#c05963","#a72d33"}'::text[],                                 11700, 18000, 35, 5),
  ('b6', 'best', 6, '{}'::text[],                                                                                                      22400, 32000, 30, 6),
  ('b7', 'best', 7, '{"#ff6363","#ff8cdb","#ff9696","#ff694f","#ff0569","#fc7584","#ff7876","#ee6556","#c85960"}'::text[],             10400, 16000, 35, 7),
  ('b8', 'best', 8, '{}'::text[],                                                                                                      15600, 26000, 40, 8),
  ('b9', 'best', 9, '{"#a36f4a","#834025","#48260b","#3e2717"}'::text[],                                                                8400, 14000, 40, 9),
  ('n1', 'new',  1, '{"#cf5123","#ca2219","#c34b61","#e10b32","#bc5355"}'::text[],                                                     10400, 16000, 35, null),
  ('n2', 'new',  2, '{}'::text[],                                                                                                      27300, 42000, 35, null),
  ('n3', 'new',  3, '{"#ffffff","#fe6672","#ff2b4e"}'::text[],                                                                         11700, 18000, 35, null)
) as v (id, section, position, colors, price_krw, custom_price_krw, discount_rate, rank)
where p.id = v.id;

-- Check the result:
--   select id, section, position, price_krw, custom_price_krw, discount_rate,
--          array_length(colors, 1) as swatches
--     from public.products
--    order by section desc, position;
