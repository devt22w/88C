/**
 * SECTION 13 — content inventory, structure only.
 *
 * No display text lives here: just the shape of the page (what links where,
 * which image slot, which swatches, what a product costs in the base
 * currency). Strings are in `src/i18n/messages/*`, prices are whole Korean won
 * converted at render time.
 *
 * Product names, prices, categories and shade swatches follow the live
 * catalogue. Swatch hexes were only captured for the twelve home-page cards;
 * the rest carry an empty list, which still reserves the 15px chip row so the
 * grid stays baseline-aligned.
 */
import type { ProductId } from '../i18n/types';
import type { SlotName } from '../types';

export interface NavEntry<K extends string> {
  /** key into the message catalogue */
  key: K;
  href: string;
}

export const promoStrip = {
  href: '/event/coupon'
};

/** utility nav: LOGIN, JOIN, DELIVERY, CONTACT */
export const topMenu: NavEntry<'login' | 'join' | 'delivery' | 'contact'>[] = [
  { key: 'login', href: '/member/login' },
  { key: 'join', href: '/member/join' },
  { key: 'delivery', href: '/order/delivery' },
  { key: 'contact', href: '/board/contact' }
];

export type CategoryKey = 'all' | 'eye' | 'lip' | 'face' | 'accTool' | 'alarm' | 'event' | 'cs';

/** the four real shelves a product can sit on; 'all' is every shelf at once */
export type ProductCategory = 'eye' | 'lip' | 'face' | 'accTool';

/** url slug ↔ category key, so /category/acc-tool resolves to accTool */
export const CATEGORY_SLUGS: Record<string, CategoryKey> = {
  all: 'all',
  eye: 'eye',
  lip: 'lip',
  face: 'face',
  'acc-tool': 'accTool'
};

export const SLUG_BY_CATEGORY: Record<CategoryKey, string> = {
  all: 'all',
  eye: 'eye',
  lip: 'lip',
  face: 'face',
  accTool: 'acc-tool',
  alarm: 'alarm',
  event: 'event',
  cs: 'cs'
};

/** left group: ALL, EYE, LIP, FACE, ACC&TOOL */
export const categoriesLeft: NavEntry<CategoryKey>[] = [
  { key: 'all', href: '/category/all' },
  { key: 'eye', href: '/category/eye' },
  { key: 'lip', href: '/category/lip' },
  { key: 'face', href: '/category/face' },
  { key: 'accTool', href: '/category/acc-tool' }
];

/** right group: the bell alarm item, EVENT, CS */
export const categoriesRight: (NavEntry<CategoryKey> & { alarm?: boolean })[] = [
  { key: 'alarm', href: '/event/alarm', alarm: true },
  { key: 'event', href: '/event' },
  { key: 'cs', href: '/board/cs' }
];

export interface HeroSlideStructure {
  /** hero_slide_n — resolved per locale, so artwork with baked-in text can
   *  differ by language without touching the layout */
  slot: SlotName;
  href: string;
}

export const heroSlides: HeroSlideStructure[] = [
  { slot: 'hero_slide_1', href: '/member/join' },
  { slot: 'hero_slide_2', href: '/category/all' },
  { slot: 'hero_slide_3', href: '/category/lip' }
];

export interface ProductStructure {
  id: ProductId;
  /** which shelf the product sits on */
  category: ProductCategory;
  /** product_thumb — square 1:1 master, rendered at 90% of the cell width */
  slot: SlotName;
  href: string;
  /** solid 15px swatches; an empty list still reserves the 15px row */
  colors: string[];
  /** struck original price, in the base currency (KRW) */
  customPriceKrw?: number;
  /** current price, in the base currency (KRW) */
  priceKrw: number;
  /** whole percent, rendered red beside the price */
  discountRate?: number;
  /** where it appears on the home page, if it does */
  home?: { section: 'best' | 'new'; position: number };
}

function product(
  id: ProductId,
  category: ProductCategory,
  priceKrw: number,
  extra: Partial<ProductStructure> = {}
): ProductStructure {
  return {
    id,
    category,
    slot: `product_thumb_${id}` as SlotName,
    href: `/product/${id}`,
    colors: [],
    priceKrw,
    ...extra
  };
}

/**
 * The whole catalogue. Category pages filter this; the home page picks out the
 * twelve cards flagged with `home`.
 */
export const catalogue: ProductStructure[] = [
  // ---- the nine BEST cards -------------------------------------------------
  product('b1', 'lip', 10800, {
    colors: ['#cb535b', '#db605c', '#ef645a', '#ff5770', '#de2a45'],
    customPriceKrw: 18000,
    discountRate: 40,
    home: { section: 'best', position: 1 }
  }),
  product('b2', 'eye', 9100, {
    colors: ['#7f604b', '#4c3120', '#3d3530', '#423e3e'],
    customPriceKrw: 13000,
    discountRate: 30,
    home: { section: 'best', position: 2 }
  }),
  product('b3', 'eye', 8400, {
    colors: ['#181612', '#4a3b32', '#60433a'],
    customPriceKrw: 14000,
    discountRate: 40,
    home: { section: 'best', position: 3 }
  }),
  product('b4', 'eye', 8400, {
    colors: ['#181612', '#4a3b32'],
    customPriceKrw: 14000,
    discountRate: 40,
    home: { section: 'best', position: 4 }
  }),
  product('b5', 'lip', 11700, {
    colors: ['#de7584', '#cf4151', '#c04258', '#d37367', '#c43b43', '#c05963', '#a72d33'],
    customPriceKrw: 18000,
    discountRate: 35,
    home: { section: 'best', position: 5 }
  }),
  product('b6', 'eye', 22400, {
    customPriceKrw: 32000,
    discountRate: 30,
    home: { section: 'best', position: 6 }
  }),
  product('b7', 'lip', 10400, {
    colors: [
      '#ff6363',
      '#ff8cdb',
      '#ff9696',
      '#ff694f',
      '#ff0569',
      '#fc7584',
      '#ff7876',
      '#ee6556',
      '#c85960'
    ],
    customPriceKrw: 16000,
    discountRate: 35,
    home: { section: 'best', position: 7 }
  }),
  product('b8', 'face', 15600, {
    customPriceKrw: 26000,
    discountRate: 40,
    home: { section: 'best', position: 8 }
  }),
  product('b9', 'eye', 8400, {
    colors: ['#a36f4a', '#834025', '#48260b', '#3e2717'],
    customPriceKrw: 14000,
    discountRate: 40,
    home: { section: 'best', position: 9 }
  }),

  // ---- the three NEW cards -------------------------------------------------
  product('n1', 'lip', 10400, {
    colors: ['#cf5123', '#ca2219', '#c34b61', '#e10b32', '#bc5355'],
    customPriceKrw: 16000,
    discountRate: 35,
    home: { section: 'new', position: 1 }
  }),
  product('n2', 'face', 27300, {
    customPriceKrw: 42000,
    discountRate: 35,
    home: { section: 'new', position: 2 }
  }),
  product('n3', 'lip', 11700, {
    colors: ['#ffffff', '#fe6672', '#ff2b4e'],
    customPriceKrw: 18000,
    discountRate: 35,
    home: { section: 'new', position: 3 }
  }),

  // ---- EYE -----------------------------------------------------------------
  product('e1', 'eye', 9750, { customPriceKrw: 15000, discountRate: 35 }),
  product('e2', 'eye', 8400, {
    colors: ['#a87653', '#b48456', '#744b2b', '#806963', '#594339', '#3f302d'],
    customPriceKrw: 12000,
    discountRate: 30
  }),
  product('e3', 'eye', 9000, { colors: ['#d9aa5c'], customPriceKrw: 15000, discountRate: 40 }),
  product('e4', 'eye', 6000, {
    colors: ['#3d3230', '#6f504d', '#90624b', '#291820', '#7c4e50', '#9c4a3c', '#da8d87'],
    customPriceKrw: 8000,
    discountRate: 25
  }),
  product('e5', 'eye', 22400, { customPriceKrw: 32000, discountRate: 30 }),

  // ---- LIP -----------------------------------------------------------------
  product('l1', 'lip', 9100, {
    colors: ['#fdbec7', '#fdc3e9', '#f58743', '#ff7e57', '#ff4a4a', '#f34e67', '#fb8d8b'],
    customPriceKrw: 14000,
    discountRate: 35
  }),
  product('l2', 'lip', 9100, {
    colors: ['#e2a497', '#dc8b90', '#f6b9b3'],
    customPriceKrw: 14000,
    discountRate: 35
  }),
  product('l3', 'lip', 11700, {
    colors: ['#e07c84', '#ea5d6d', '#e15271', '#eb8787', '#e47d6f', '#de4b5c'],
    customPriceKrw: 18000,
    discountRate: 35
  }),
  product('l4', 'lip', 10400, {
    colors: ['#f57996', '#f06c82', '#f13074', '#ff817a', '#f97678', '#ff2530'],
    customPriceKrw: 16000,
    discountRate: 35
  }),
  product('l5', 'lip', 11700, {
    colors: ['#ee8278', '#ed8487', '#f86b72', '#f36f66', '#db5c55', '#d65e68'],
    customPriceKrw: 18000,
    discountRate: 35
  }),
  product('l6', 'lip', 12350, {
    colors: ['#ed6c83', '#dd6064', '#d31e45', '#e03e69', '#de4b5e', '#d46d7e', '#f3bfda'],
    customPriceKrw: 19000,
    discountRate: 35
  }),
  product('l7', 'lip', 12300, {
    colors: ['#cb5240', '#b23a46', '#f75944', '#d71f38', '#ae0704', '#5f001b', '#7d0109'],
    customPriceKrw: 19000,
    discountRate: 35
  }),
  product('l8', 'lip', 12300, {
    colors: ['#f18b79', '#d77980', '#c22429', '#d06967', '#b15062', '#893430', '#500310'],
    customPriceKrw: 19000,
    discountRate: 35
  }),

  // ---- FACE ----------------------------------------------------------------
  product('f1', 'face', 10500, { customPriceKrw: 14000, discountRate: 25 }),
  product('f2', 'face', 12000, {
    colors: ['#e6bda1', '#9f8272', '#c7a98f'],
    customPriceKrw: 16000,
    discountRate: 25
  }),
  product('f3', 'face', 10500, { customPriceKrw: 14000, discountRate: 25 }),
  product('f4', 'face', 24750, { customPriceKrw: 33000, discountRate: 25 }),
  product('f5', 'face', 15600, { customPriceKrw: 24000, discountRate: 35 }),
  product('f6', 'face', 13800, { customPriceKrw: 23000, discountRate: 40 }),
  product('f7', 'face', 16900, {
    colors: ['#e6bda1', '#9f8272', '#c7a98f'],
    customPriceKrw: 26000,
    discountRate: 35
  }),
  product('f8', 'face', 12350, { customPriceKrw: 19000, discountRate: 35 }),
  product('f9', 'face', 12350, { customPriceKrw: 19000, discountRate: 35 }),
  product('f10', 'face', 13650, { customPriceKrw: 21000, discountRate: 35 }),

  // ---- ACC & TOOL ----------------------------------------------------------
  product('a1', 'accTool', 10000),
  product('a2', 'accTool', 7000, { customPriceKrw: 10000, discountRate: 30 }),
  product('a3', 'accTool', 7000, { customPriceKrw: 10000, discountRate: 30 }),
  product('a4', 'accTool', 8400, { customPriceKrw: 12000, discountRate: 30 })
];

const byHomePosition = (section: 'best' | 'new') =>
  catalogue
    .filter((item) => item.home?.section === section)
    .sort((a, b) => (a.home?.position ?? 0) - (b.home?.position ?? 0));

/** BEST ITEM — nine cards in the three-up grid */
export const bestProducts: ProductStructure[] = byHomePosition('best');

/** NEW ITEM — three cards, same grid, thumbnails zoom on hover */
export const newProducts: ProductStructure[] = byHomePosition('new');

/**
 * Running order on each shelf, exactly as the reference lists it (all pages,
 * first to last). A product's picture is keyed to the product, not to the
 * position, so one upload shows up everywhere that product appears.
 */
export const CATEGORY_ORDER: Record<'all' | ProductCategory, ProductId[]> = {
  all: [
    'f10', 'l7', 'f9', 'f8', 'n1', 'n2', 'n3', 'f7', 'l6', 'l5', 'f6', 'e5',
    'l4', 'l3', 'b1', 'b7', 'f5', 'b5', 'b8', 'b4', 'f4', 'a4', 'e4', 'b6',
    'l2', 'e3', 'f3', 'a3', 'b2', 'a2', 'b9', 'f2', 'e2', 'a1', 'e1', 'b3',
    'f1', 'l1', 'l8'
  ],
  eye: ['b3', 'e1', 'e2', 'b9', 'b2', 'e3', 'b6', 'e4', 'b4', 'e5'],
  lip: ['l1', 'l2', 'b5', 'b7', 'b1', 'l3', 'l4', 'l5', 'l6', 'n3', 'n1', 'l7', 'l8'],
  face: ['f1', 'f2', 'f3', 'f4', 'b8', 'f5', 'f6', 'f7', 'n2', 'f8', 'f9', 'f10'],
  accTool: ['a1', 'a2', 'a3', 'a4']
};

/** everything on a shelf, in the reference's running order */
export function productsInCategory(category: CategoryKey): ProductStructure[] {
  const ids = CATEGORY_ORDER[category as 'all' | ProductCategory];
  if (!ids) return [];
  return ids
    .map((id) => catalogue.find((item) => item.id === id))
    .filter((item): item is ProductStructure => Boolean(item));
}

export function findProduct(id: string): ProductStructure | undefined {
  return catalogue.find((item) => item.id === id);
}

export const midBanners: { slot: SlotName; href: string }[] = [
  { slot: 'mid_banner_left', href: '/event/membership' },
  { slot: 'mid_banner_right', href: '/event/bundle' }
];

export type SideMenuKey = 'myPage' | 'cart' | 'order' | 'delivery' | 'coupon' | 'qna' | 'myInfo';

export const sideMenu: NavEntry<SideMenuKey>[] = [
  { key: 'myPage', href: '/myshop' },
  { key: 'cart', href: '/order/basket' },
  { key: 'order', href: '/myshop/order' },
  { key: 'delivery', href: '/order/delivery' },
  { key: 'coupon', href: '/myshop/coupon' },
  { key: 'qna', href: '/board/qna' },
  { key: 'myInfo', href: '/myshop/info' }
];

export const footerLinks = {
  businessCheck: '/company/check',
  brandStory: '/company/story',
  shoppingGuide: '/guide',
  privacyPolicy: '/policy/privacy',
  partnership: '/board/partnership',
  bulkOrder: '/board/bulk',
  instagram: '/sns/instagram',
  facebook: '/sns/facebook',
  naver: '/sns/naver'
};

/**
 * Account numbers are structure, not copy — only the bank name is translated.
 * These are placeholders: fill them with the operating company's real details.
 */
export const bankAccounts: { key: 'kb' | 'shinhan'; number: string }[] = [
  { key: 'kb', number: '000000-00-000000' },
  { key: 'shinhan', number: '000-000-000000' }
];

/**
 * Is online payment live?
 *
 * While this is false the storefront says so plainly — on the cart, on the
 * checkout and in the shopping guide — and tells the shopper that orders are
 * settled in cash with customer service instead. Flip it to true on the day
 * the merchant account goes live and every one of those notices disappears
 * together; there is no second place to remember.
 */
export const ONLINE_PAYMENT_LIVE = false;

/**
 * The operator's real contact details, as published on 88hotspring.com.
 *
 * These are facts, not copy, so they are not translated: a phone number reads
 * the same in every language. Only the labels around them come from the message
 * catalogues.
 */
export const contactDetails = {
  phones: [
    { number: '0917-874-7888', note: 'Local' },
    { number: '0920-857-4888', note: 'Local' },
    { number: '0917-775-8282', note: 'Korean' }
  ],
  kakaoId: '88spa',
  messenger: '88 hotspring resort',
  email: 'info@88hotspring.com',
  address: '#9061 National Highway, Bagong Kalsada, Calamba City, 4027 Laguna'
};

/** the line the footer and the CS blocks print */
export const csPhone = contactDetails.phones[0].number;
