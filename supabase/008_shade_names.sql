-- =============================================================================
--  008 — shade names
--
--  Run after 006. Safe to re-run.
--
--  006 seeded every swatch as "Shade 1", "Shade 2" — a placeholder, and what a
--  customer sees today on the product page and on the payment receipt. This
--  names each one after the colour it actually is, in the three languages the
--  shop sells in.
--
--  How the names were chosen: a brow pencil, an eyeliner and a mascara are
--  named by depth, because that is how they are picked ("02 Dark Brown"); a
--  lipstick or a tint is named by hue ("03 Coral Red"); a cushion or powder is
--  named like a foundation ("01 Light Beige").
--
--  A name you have written by hand is NOT overwritten: only rows still
--  carrying the "Shade N" placeholder are touched, so this is safe to re-run
--  and safe to override one shade at a time afterwards.
-- =============================================================================

with named (product_id, code, position, name_en, name_ko, name_id) as (
  values
  ('b1', '#cb535b', 1, '01 Classic Red', '01 클래식 레드', '01 Classic Red'),
  ('b1', '#db605c', 2, '02 Light Classic Red', '02 라이트 클래식 레드', '02 Light Classic Red'),
  ('b1', '#ef645a', 3, '03 Coral Red', '03 코랄 레드', '03 Coral Red'),
  ('b1', '#ff5770', 4, '04 Pink Red', '04 핑크 레드', '04 Pink Red'),
  ('b1', '#de2a45', 5, '05 Cherry Red', '05 체리 레드', '05 Cherry Red'),
  ('b2', '#7f604b', 1, '01 Warm Brown', '01 웜 브라운', '01 Warm Brown'),
  ('b2', '#4c3120', 2, '02 Dark Brown', '02 다크 브라운', '02 Dark Brown'),
  ('b2', '#3d3530', 3, '03 Ash Grey', '03 애쉬 그레이', '03 Ash Grey'),
  ('b2', '#423e3e', 4, '04 Soft Ash Grey', '04 소프트 애쉬 그레이', '04 Soft Ash Grey'),
  ('b3', '#181612', 1, '01 Soft Black', '01 소프트 블랙', '01 Soft Black'),
  ('b3', '#4a3b32', 2, '02 Dark Brown', '02 다크 브라운', '02 Dark Brown'),
  ('b3', '#60433a', 3, '03 Choco Brown', '03 초코 브라운', '03 Choco Brown'),
  ('b4', '#181612', 1, '01 Soft Black', '01 소프트 블랙', '01 Soft Black'),
  ('b4', '#4a3b32', 2, '02 Dark Brown', '02 다크 브라운', '02 Dark Brown'),
  ('b5', '#de7584', 1, '01 Pink Red', '01 핑크 레드', '01 Pink Red'),
  ('b5', '#cf4151', 2, '02 Rosewood', '02 로즈우드', '02 Rosewood'),
  ('b5', '#c04258', 3, '03 Soft Rosewood', '03 소프트 로즈우드', '03 Soft Rosewood'),
  ('b5', '#d37367', 4, '04 Coral Red', '04 코랄 레드', '04 Coral Red'),
  ('b5', '#c43b43', 5, '05 Bold Rosewood', '05 볼드 로즈우드', '05 Bold Rosewood'),
  ('b5', '#c05963', 6, '06 Rose Red', '06 로즈 레드', '06 Rose Red'),
  ('b5', '#a72d33', 7, '07 Deep Rosewood', '07 딥 로즈우드', '07 Deep Rosewood'),
  ('b7', '#ff6363', 1, '01 Classic Red', '01 클래식 레드', '01 Classic Red'),
  ('b7', '#ff8cdb', 2, '02 Mauve Pink', '02 모브 핑크', '02 Mauve Pink'),
  ('b7', '#ff9696', 3, '03 Rose Petal', '03 로즈 페탈', '03 Rose Petal'),
  ('b7', '#ff694f', 4, '04 Coral Red', '04 코랄 레드', '04 Coral Red'),
  ('b7', '#ff0569', 5, '05 Hot Pink', '05 핫 핑크', '05 Hot Pink'),
  ('b7', '#fc7584', 6, '06 Pink Red', '06 핑크 레드', '06 Pink Red'),
  ('b7', '#ff7876', 7, '07 Soft Classic Red', '07 소프트 클래식 레드', '07 Soft Classic Red'),
  ('b7', '#ee6556', 8, '08 Soft Coral Red', '08 소프트 코랄 레드', '08 Soft Coral Red'),
  ('b7', '#c85960', 9, '09 Deep Classic Red', '09 딥 클래식 레드', '09 Deep Classic Red'),
  ('b9', '#a36f4a', 1, '01 Warm Brown', '01 웜 브라운', '01 Warm Brown'),
  ('b9', '#834025', 2, '02 Choco Brown', '02 초코 브라운', '02 Choco Brown'),
  ('b9', '#48260b', 3, '03 Deep Brown', '03 딥 브라운', '03 Deep Brown'),
  ('b9', '#3e2717', 4, '04 Soft Deep Brown', '04 소프트 딥 브라운', '04 Soft Deep Brown'),
  ('n1', '#cf5123', 1, '01 Coral Red', '01 코랄 레드', '01 Coral Red'),
  ('n1', '#ca2219', 2, '02 Cherry Red', '02 체리 레드', '02 Cherry Red'),
  ('n1', '#c34b61', 3, '03 Rosewood', '03 로즈우드', '03 Rosewood'),
  ('n1', '#e10b32', 4, '04 Soft Cherry Red', '04 소프트 체리 레드', '04 Soft Cherry Red'),
  ('n1', '#bc5355', 5, '05 Soft Rosewood', '05 소프트 로즈우드', '05 Soft Rosewood'),
  ('n3', '#ffffff', 1, '01 Clear', '01 클리어', '01 Clear'),
  ('n3', '#fe6672', 2, '02 Pink Red', '02 핑크 레드', '02 Pink Red'),
  ('n3', '#ff2b4e', 3, '03 Rose Red', '03 로즈 레드', '03 Rose Red'),
  ('e1', '#a87653', 1, '01 Warm Brown', '01 웜 브라운', '01 Warm Brown'),
  ('e1', '#b48456', 2, '02 Light Brown', '02 라이트 브라운', '02 Light Brown'),
  ('e1', '#744b2b', 3, '03 Natural Brown', '03 내추럴 브라운', '03 Natural Brown'),
  ('e1', '#806963', 4, '04 Grey Brown', '04 그레이 브라운', '04 Grey Brown'),
  ('e1', '#594339', 5, '05 Choco Brown', '05 초코 브라운', '05 Choco Brown'),
  ('e1', '#3f302d', 6, '06 Ash Grey', '06 애쉬 그레이', '06 Ash Grey'),
  ('e3', '#d9aa5c', 1, '01 Champagne Gold', '01 샴페인 골드', '01 Champagne Gold'),
  ('e5', '#fdbec7', 1, '01 Blossom Pink', '01 블라썸 핑크', '01 Blossom Pink'),
  ('e5', '#fdc3e9', 2, '02 Lilac Pink', '02 라일락 핑크', '02 Lilac Pink'),
  ('e5', '#f58743', 3, '03 Burnt Orange', '03 번트 오렌지', '03 Burnt Orange'),
  ('e5', '#ff7e57', 4, '04 Warm Coral', '04 웜 코랄', '04 Warm Coral'),
  ('e5', '#ff4a4a', 5, '05 Rose Red', '05 로즈 레드', '05 Rose Red'),
  ('e5', '#f34e67', 6, '06 Soft Rose Red', '06 소프트 로즈 레드', '06 Soft Rose Red'),
  ('e5', '#fb8d8b', 7, '07 Deep Blossom Pink', '07 딥 블라썸 핑크', '07 Deep Blossom Pink'),
  ('l2', '#e2a497', 1, '01 Soft Coral', '01 소프트 코랄', '01 Soft Coral'),
  ('l2', '#dc8b90', 2, '02 Classic Red', '02 클래식 레드', '02 Classic Red'),
  ('l2', '#f6b9b3', 3, '03 Rose Petal', '03 로즈 페탈', '03 Rose Petal'),
  ('l3', '#e07c84', 1, '01 Pink Red', '01 핑크 레드', '01 Pink Red'),
  ('l3', '#ea5d6d', 2, '02 Deep Pink Red', '02 딥 핑크 레드', '02 Deep Pink Red'),
  ('l3', '#e15271', 3, '03 Rose Pink', '03 로즈 핑크', '03 Rose Pink'),
  ('l3', '#eb8787', 4, '04 Classic Red', '04 클래식 레드', '04 Classic Red'),
  ('l3', '#e47d6f', 5, '05 Coral Red', '05 코랄 레드', '05 Coral Red'),
  ('l3', '#de4b5c', 6, '06 Rose Red', '06 로즈 레드', '06 Rose Red'),
  ('l4', '#f57996', 1, '01 Hot Pink', '01 핫 핑크', '01 Hot Pink'),
  ('l4', '#f06c82', 2, '02 Pink Red', '02 핑크 레드', '02 Pink Red'),
  ('l4', '#f13074', 3, '03 Deep Hot Pink', '03 딥 핫 핑크', '03 Deep Hot Pink'),
  ('l4', '#ff817a', 4, '04 Coral Red', '04 코랄 레드', '04 Coral Red'),
  ('l4', '#f97678', 5, '05 Classic Red', '05 클래식 레드', '05 Classic Red'),
  ('l4', '#ff2530', 6, '06 Deep Classic Red', '06 딥 클래식 레드', '06 Deep Classic Red'),
  ('l5', '#ee8278', 1, '01 Coral Red', '01 코랄 레드', '01 Coral Red'),
  ('l5', '#ed8487', 2, '02 Classic Red', '02 클래식 레드', '02 Classic Red'),
  ('l5', '#f86b72', 3, '03 Soft Classic Red', '03 소프트 클래식 레드', '03 Soft Classic Red'),
  ('l5', '#f36f66', 4, '04 Soft Coral Red', '04 소프트 코랄 레드', '04 Soft Coral Red'),
  ('l5', '#db5c55', 5, '05 Deep Coral Red', '05 딥 코랄 레드', '05 Deep Coral Red'),
  ('l5', '#d65e68', 6, '06 Rose Red', '06 로즈 레드', '06 Rose Red'),
  ('l6', '#ed6c83', 1, '01 Pink Red', '01 핑크 레드', '01 Pink Red'),
  ('l6', '#dd6064', 2, '02 Classic Red', '02 클래식 레드', '02 Classic Red'),
  ('l6', '#d31e45', 3, '03 Rose Pink', '03 로즈 핑크', '03 Rose Pink'),
  ('l6', '#e03e69', 4, '04 Light Rose Pink', '04 라이트 로즈 핑크', '04 Light Rose Pink'),
  ('l6', '#de4b5e', 5, '05 Rose Red', '05 로즈 레드', '05 Rose Red'),
  ('l6', '#d46d7e', 6, '06 Light Rose Red', '06 라이트 로즈 레드', '06 Light Rose Red'),
  ('l6', '#f3bfda', 7, '07 Mauve Pink', '07 모브 핑크', '07 Mauve Pink'),
  ('l7', '#cb5240', 1, '01 Rosewood', '01 로즈우드', '01 Rosewood'),
  ('l7', '#b23a46', 2, '02 Deep Rosewood', '02 딥 로즈우드', '02 Deep Rosewood'),
  ('l7', '#f75944', 3, '03 Coral Red', '03 코랄 레드', '03 Coral Red'),
  ('l7', '#d71f38', 4, '04 Cherry Red', '04 체리 레드', '04 Cherry Red'),
  ('l7', '#ae0704', 5, '05 Burgundy', '05 버건디', '05 Burgundy'),
  ('l7', '#5f001b', 6, '06 Deep Plum', '06 딥 플럼', '06 Deep Plum'),
  ('l7', '#7d0109', 7, '07 Dark Wine', '07 다크 와인', '07 Dark Wine'),
  ('l8', '#f18b79', 1, '01 Coral Red', '01 코랄 레드', '01 Coral Red'),
  ('l8', '#d77980', 2, '02 Pink Red', '02 핑크 레드', '02 Pink Red'),
  ('l8', '#c22429', 3, '03 Cherry Red', '03 체리 레드', '03 Cherry Red'),
  ('l8', '#d06967', 4, '04 Classic Red', '04 클래식 레드', '04 Classic Red'),
  ('l8', '#b15062', 5, '05 Rosewood', '05 로즈우드', '05 Rosewood'),
  ('l8', '#893430', 6, '06 Burgundy', '06 버건디', '06 Burgundy'),
  ('l8', '#500310', 7, '07 Dark Wine', '07 다크 와인', '07 Dark Wine'),
  ('f1', '#e6bda1', 1, '01 Light Beige', '01 라이트 베이지', '01 Light Beige'),
  ('f1', '#9f8272', 2, '02 Deep Beige', '02 딥 베이지', '02 Deep Beige'),
  ('f1', '#c7a98f', 3, '03 Natural Beige', '03 내추럴 베이지', '03 Natural Beige'),
  ('f3', '#e6bda1', 1, '01 Light Beige', '01 라이트 베이지', '01 Light Beige'),
  ('f3', '#9f8272', 2, '02 Deep Beige', '02 딥 베이지', '02 Deep Beige'),
  ('f3', '#c7a98f', 3, '03 Natural Beige', '03 내추럴 베이지', '03 Natural Beige')
)
update public.product_shades s
   set name_en    = n.name_en,
       name_ko    = n.name_ko,
       name_id    = n.name_id,
       position   = n.position,
       updated_at = now()
  from named n
 where s.product_id = n.product_id
   and lower(s.code) = n.code
   and s.name_en like 'Shade %';

-- What the shop now calls each swatch:
--
-- select product_id, position, code, name_en, name_ko, name_id
--   from public.product_shades order by product_id, position;
--
-- To rename one by hand afterwards:
--
-- update public.product_shades
--    set name_en = '03 Sunset Coral', name_ko = '03 선셋 코랄', name_id = '03 Sunset Coral'
--  where product_id = 'b1' and code = '#ef645a';
