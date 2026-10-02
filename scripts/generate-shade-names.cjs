/**
 * Turn every swatch in the catalogue into a shade NAME, in three languages,
 * and write the SQL that loads them.
 *
 * Two things decide the name. First the product: a brow pencil's colours are
 * chosen by depth ("Dark Brown"), never by hue, while a lipstick's are chosen
 * by hue. Second the colour itself, read as hue / saturation / lightness.
 */
const fs = require('fs');

const site = fs.readFileSync('src/data/site.ts', 'utf8');
const copy = fs.readFileSync('src/i18n/messages/products.en.ts', 'utf8');

function productNames() {
  const out = {};
  const re = /(\w+):\s*\{\s*name:\s*'([^']*)'/g;
  let m;
  while ((m = re.exec(copy))) out[m[1]] = m[2];
  return out;
}

function products() {
  const re = /product\('(\w+)',\s*'(\w+)',\s*\d+,\s*\{([\s\S]*?)\n  \}\)/g;
  const out = [];
  let m;
  while ((m = re.exec(site))) {
    const colours = (m[3].match(/colors:\s*\[([^\]]*)\]/) || [, ''])[1]
      .split(',')
      .map((x) => x.trim().replace(/'/g, ''))
      .filter(Boolean);
    if (colours.length) out.push({ id: m[1], category: m[2], colours });
  }
  return out;
}

function hsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h, s, l };
}

/** depth, not hue: how brows, liners and mascara are actually picked */
function depth({ h, s, l }) {
  if (l < 0.13) return ['Soft Black', '소프트 블랙', 'Soft Black'];
  if (l < 0.2) {
    return s < 0.2
      ? ['Black Grey', '블랙 그레이', 'Black Grey']
      : ['Deep Brown', '딥 브라운', 'Deep Brown'];
  }
  if (l < 0.28) {
    return s < 0.18
      ? ['Ash Grey', '애쉬 그레이', 'Ash Grey']
      : ['Dark Brown', '다크 브라운', 'Dark Brown'];
  }
  if (l < 0.38) {
    if (s < 0.12) return ['Ash Brown', '애쉬 브라운', 'Ash Brown'];
    return h < 25 ? ['Choco Brown', '초코 브라운', 'Choco Brown'] : ['Natural Brown', '내추럴 브라운', 'Natural Brown'];
  }
  if (l < 0.5) {
    return s < 0.15
      ? ['Grey Brown', '그레이 브라운', 'Grey Brown']
      : ['Warm Brown', '웜 브라운', 'Warm Brown'];
  }
  return ['Light Brown', '라이트 브라운', 'Light Brown'];
}

/** lips and cheeks: hue first, then how deep and how loud it is */
function lip({ h, s, l }) {
  if (s < 0.1 && l > 0.9) return ['Clear', '클리어', 'Clear'];
  if (s < 0.12) return ['Soft Nude', '소프트 누드', 'Soft Nude'];

  // the pink side of red
  if (h >= 330 && h < 348) {
    if (l < 0.3) return ['Deep Plum', '딥 플럼', 'Deep Plum'];
    if (l < 0.45) return ['Berry Pink', '베리 핑크', 'Berry Pink'];
    if (l > 0.75) return ['Baby Pink', '베이비 핑크', 'Baby Pink'];
    return s > 0.8 ? ['Hot Pink', '핫 핑크', 'Hot Pink'] : ['Rose Pink', '로즈 핑크', 'Rose Pink'];
  }

  // true red — split again by which way it leans, because five swatches on one
  // lipstick are all "red" and a shopper still has to tell them apart
  if (h >= 348 || h < 10) {
    if (l < 0.25) return ['Dark Wine', '다크 와인', 'Dark Wine'];
    if (l < 0.4) return ['Burgundy', '버건디', 'Burgundy'];
    if (l < 0.55) return s > 0.6 ? ['Cherry Red', '체리 레드', 'Cherry Red'] : ['Rosewood', '로즈우드', 'Rosewood'];
    if (l > 0.75) return ['Rose Petal', '로즈 페탈', 'Rose Petal'];
    if (h >= 348 && h < 356) return l > 0.64 ? ['Pink Red', '핑크 레드', 'Pink Red'] : ['Rose Red', '로즈 레드', 'Rose Red'];
    if (h >= 356 || h < 3) return ['Classic Red', '클래식 레드', 'Classic Red'];
    return ['Coral Red', '코랄 레드', 'Coral Red'];
  }

  // red-orange: coral country
  if (h < 20) {
    if (l < 0.3) return ['Brick Brown', '브릭 브라운', 'Brick Brown'];
    if (l < 0.45) return ['Brick Red', '브릭 레드', 'Brick Red'];
    if (l > 0.72) return ['Soft Coral', '소프트 코랄', 'Soft Coral'];
    return ['Coral Red', '코랄 레드', 'Coral Red'];
  }

  if (h < 32) {
    if (l < 0.45) return ['Terracotta', '테라코타', 'Terakota'];
    return ['Coral Orange', '코랄 오렌지', 'Coral Orange'];
  }

  if (h < 50) return ['Peach Nude', '피치 누드', 'Peach Nude'];

  // anything left is on the purple side
  return l < 0.45 ? ['Deep Mauve', '딥 모브', 'Deep Mauve'] : ['Mauve Pink', '모브 핑크', 'Mauve Pink'];
}

/** eyeshadow and glitter: these really are chosen by colour */
function eye({ h, s, l }) {
  if (s < 0.16) return depth({ h, s, l });
  if (h >= 330 || h < 8) return l > 0.75 ? ['Blossom Pink', '블라썸 핑크', 'Blossom Pink'] : ['Rose Red', '로즈 레드', 'Rose Red'];
  if (h < 20) return ['Warm Coral', '웜 코랄', 'Warm Coral'];
  if (h < 34) return l > 0.62 ? ['Apricot', '애프리콧', 'Apricot'] : ['Burnt Orange', '번트 오렌지', 'Burnt Orange'];
  if (h < 55) return l > 0.6 ? ['Champagne Gold', '샴페인 골드', 'Champagne Gold'] : ['Antique Gold', '앤티크 골드', 'Antique Gold'];
  if (h < 300) return ['Olive Taupe', '올리브 토프', 'Olive Taupe'];
  return ['Lilac Pink', '라일락 핑크', 'Lilac Pink'];
}

/** base products are named the way foundation shades are */
function base({ l }) {
  if (l > 0.72) return ['Light Beige', '라이트 베이지', 'Light Beige'];
  if (l > 0.6) return ['Natural Beige', '내추럴 베이지', 'Natural Beige'];
  return ['Deep Beige', '딥 베이지', 'Deep Beige'];
}

const names = productNames();
/** a brow, a liner or a mascara is named by depth whatever shelf it sits on */
const byDepth = (id) => /brow|liner|mascara/i.test(names[id] ?? '');

const rows = [];
for (const product of products()) {
  const used = new Map();
  product.colours.forEach((hex, index) => {
    const c = hsl(hex);
    const [en, ko, idName] = byDepth(product.id)
      ? depth(c)
      : product.category === 'lip'
        ? lip(c)
        : product.category === 'face'
          ? base(c)
          : eye(c);

    // A range of six pinks lands on the same word more than once. Rather than
    // "Rose Pink 2", which says nothing, the repeat is qualified against the
    // first one that took the name: lighter or deeper than it actually is.
    const first = used.get(en);
    let prefixEn = '';
    let prefixKo = '';
    if (!first) {
      used.set(en, { l: c.l, count: 1 });
    } else {
      first.count += 1;
      if (c.l > first.l + 0.04) {
        prefixEn = 'Light ';
        prefixKo = '라이트 ';
      } else if (c.l < first.l - 0.04) {
        prefixEn = 'Deep ';
        prefixKo = '딥 ';
      } else {
        prefixEn = first.count === 2 ? 'Soft ' : 'Bold ';
        prefixKo = first.count === 2 ? '소프트 ' : '볼드 ';
      }
    }

    const number = String(index + 1).padStart(2, '0');
    rows.push({
      product: product.id,
      code: hex.toLowerCase(),
      position: index + 1,
      en: `${number} ${prefixEn}${en}`,
      ko: `${number} ${prefixKo}${ko}`,
      id: `${number} ${prefixEn}${idName}`
    });
  });
}

const esc = (s) => s.replace(/'/g, "''");
const values = rows
  .map((r) => `  ('${r.product}', '${r.code}', ${r.position}, '${esc(r.en)}', '${esc(r.ko)}', '${esc(r.id)}')`)
  .join(',\n');

const sql = `-- =============================================================================
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
${values}
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
`;

fs.writeFileSync('supabase/008_shade_names.sql', sql);
console.log('wrote supabase/008_shade_names.sql — ' + rows.length + ' shades');
console.log();
const show = ['b1', 'l3', 'l7', 'b9'];
for (const r of rows) {
  if (show.includes(r.product)) console.log(`${r.product} ${r.code}  ${r.en.padEnd(22)} ${r.ko}`);
}
