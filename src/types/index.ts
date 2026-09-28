import type { Locale } from '../i18n/types';

/**
 * SECTION 11 — image slot map.
 *
 * Every photograph on the page is a *named slot*, never a hard-coded URL. The
 * container owns the width / height / ratio, the injected image only fills it,
 * so wiring a database up later cannot move the layout by a single pixel.
 */
export type SlotName =
  | 'logo_header'
  | 'logo_footer'
  | 'icon_cart'
  | 'icon_cart_pill'
  | 'icon_alarm'
  | 'icon_hero_prev'
  | 'icon_hero_next'
  | 'icon_top_arrow'
  | 'icon_search'
  | 'icon_close'
  | 'icon_instagram'
  | 'icon_facebook'
  | 'icon_naver'
  /* SNS sign-in buttons on the login page. These are third-party brand marks,
     so they stay empty slots: upload the official badges rather than having
     the site draw imitations of them. */
  | 'icon_sns_naver'
  | 'icon_sns_facebook'
  | 'icon_sns_kakao'
  | 'icon_page_first'
  | 'icon_page_prev'
  | 'icon_page_next'
  | 'icon_page_last'
  | 'mid_banner_left'
  | 'mid_banner_right'
  | 'mid_badge'
  | `hero_slide_${number}`
  | `product_thumb_${string}`
  /** product detail gallery: product_gallery_<id>_<n>, square 1:1 masters */
  | `product_gallery_${string}`
  | `recent_thumb_${number}`;

/**
 * A slot may also be supplied per language, as `<slot>.<locale>`, for artwork
 * that carries baked-in text (hero banners above all). `ImageSlot` looks for
 * the localised key first and falls back to the plain one, so a database can
 * serve Korean hero art to Korean visitors without any layout change.
 */
export type LocalisedSlotName = `${SlotName}.${Locale}`;

/** A URL map the database phase fills in. Anything absent renders a placeholder. */
export type SlotSources = Partial<Record<SlotName | LocalisedSlotName, string>>;
