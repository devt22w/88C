import { useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { ImageSlot, useSlotSource, useSlotSources } from './ImageSlot';
import { Link, useRoute } from '../router';
import { useCart } from '../cart/CartProvider';
import { useRequireSignIn } from '../account/useSession';
import { findProduct } from '../data/site';
import { recordVisit } from '../data/useVisits';
import { shadeAvailable, shadeName, useCatalogueMeta } from '../data/useCatalogueMeta';
import { ProductReviews } from './ProductReviews';
import { useLocale } from '../i18n/LocaleProvider';
import type { ProductStructure } from '../data/site';
import type { SlotName } from '../types';
import type { ProductId } from '../i18n/types';
// the shipping rule the checkout charges — one definition for page and payment
import { FREE_SHIPPING_OVER_KRW, SHIPPING_FEE_KRW } from '../../supabase/functions/_shared/pricing.ts';

/** reward points read off the reference storefront: 5% back, rounded to the nearest ten won */
const POINTS_RATE = 0.05;

/** how many gallery frames a product page reserves */
const GALLERY_FRAMES = 5;

/**
 * The magnifier: a 200px lens over the main square, painted into a 500px panel
 * at 2.5x. The square is fluid now (530px at 1920, 472px at 1263), so the zoom
 * maths reads its real size on every move instead of assuming one.
 */
const LENS_SIZE = 200;
const ZOOM_PANEL = 500;
const ZOOM_FACTOR = 2.5;

function gallerySlot(id: ProductId, frame: number): SlotName {
  return `product_gallery_${id}_${frame}` as SlotName;
}

interface GalleryProps {
  product: ProductStructure;
  alt: string;
}

/**
 * Thumbnail rail plus the main square, with the hover magnifier.
 *
 * The lens only appears when the frame actually has a picture behind it —
 * there is nothing to magnify about a placeholder.
 */
function Gallery({ product, alt }: GalleryProps) {
  const [frame, setFrame] = useState(0);
  const [lens, setLens] = useState<{ x: number; y: number; size: number } | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const sources = useSlotSources();

  /**
   * The rail is built from what actually exists: the card thumbnail first, then
   * any gallery frame that has a picture behind it. Listing all five slots
   * regardless would mean hovering a thumbnail could swap a real photograph for
   * a grey placeholder, which reads as the page breaking.
   */
  const frames = useMemo(() => {
    const gallery = Array.from({ length: GALLERY_FRAMES }, (_, i) =>
      gallerySlot(product.id, i + 1)
    ).filter((slot) => Boolean(sources[slot]));
    return [product.slot, ...gallery];
  }, [product.id, product.slot, sources]);

  const activeSlot = frames[Math.min(frame, frames.length - 1)];
  const activeSrc = useSlotSource(activeSlot);

  useEffect(() => {
    setFrame(0);
    setLens(null);
  }, [product.id]);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!activeSrc || !mainRef.current) return;
    const box = mainRef.current.getBoundingClientRect();
    const half = LENS_SIZE / 2;
    const x = Math.min(Math.max(event.clientX - box.left, half), box.width - half);
    const y = Math.min(Math.max(event.clientY - box.top, half), box.height - half);
    setLens({ x: x - half, y: y - half, size: box.width });
  };

  const centring = (ZOOM_PANEL - LENS_SIZE * ZOOM_FACTOR) / 2;
  const zoomStyle = lens
    ? {
        backgroundImage: `url(${activeSrc})`,
        backgroundSize: `${lens.size * ZOOM_FACTOR}px ${lens.size * ZOOM_FACTOR}px`,
        backgroundPosition: `-${lens.x * ZOOM_FACTOR - centring}px -${lens.y * ZOOM_FACTOR - centring}px`
      }
    : undefined;

  return (
    <div className="image_col">
      <ul className="listImg">
        {frames.map((slot, i) => (
          <li
            key={slot}
            className={i === frame ? 'is-active' : undefined}
            onMouseEnter={() => setFrame(i)}
            onClick={() => setFrame(i)}
          >
            <ImageSlot slot={slot} alt={`${alt} ${i + 1}`} label={`${i + 1}`} />
          </li>
        ))}
      </ul>

      <div
        className="keyImg"
        ref={mainRef}
        onMouseMove={onMove}
        onMouseLeave={() => setLens(null)}
      >
        <ImageSlot slot={activeSlot} alt={alt} loading="eager" label={`${activeSlot} · 1:1`} />
        {lens ? <span className="zoom_lens" style={{ left: lens.x, top: lens.y }} /> : null}
      </div>

      {lens ? <span className="zoom_panel" style={zoomStyle} /> : null}
    </div>
  );
}

export function ProductPage({ id }: { id: string }) {
  const { t, money, percent, number, locale } = useLocale();
  // the whole catalogue, not just the twelve home-page cards — anything a
  // category page links to has to resolve here
  const product = findProduct(id);
  const [shade, setShade] = useState<string | null>(null);
  const [warn, setWarn] = useState(false);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const requireSignIn = useRequireSignIn();
  const { navigate } = useRoute();
  const meta = useCatalogueMeta();

  useEffect(() => {
    setShade(null);
    setWarn(false);
    setAdded(false);
  }, [id]);

  // one visit per product page: the local history the panel reads, and the
  // shared count behind MOST VISITED
  useEffect(() => {
    if (findProduct(id)) recordVisit(id, locale);
  }, [id, locale]);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [added]);

  if (!product) {
    return (
      <div id="contents">
        <div className="not_found">
          <h2>404</h2>
          <Link to="/">{t.detail.back}</Link>
        </div>
      </div>
    );
  }

  const copy = t.product.copy[product.id];
  const pointsKrw = Math.round((product.priceKrw * POINTS_RATE) / 10) * 10;
  const needsShade = product.colors.length > 0;
  const quantity = !needsShade || shade ? 1 : 0;

  // stock and shade names come from the database; with none loaded the page is
  // exactly what it was before — every swatch buyable, nothing marked sold out
  const shades = meta.shades[product.id] ?? [];
  const availability = meta.availability[product.id];
  const tracked = availability?.track_stock ?? false;
  const soldOut = Boolean(availability && !availability.in_stock);
  const byCode = new Map(shades.map((row) => [row.code.toLowerCase(), row]));
  const lowStock =
    tracked && !soldOut && availability ? availability.stock > 0 && availability.stock <= availability.low_stock_at : false;

  const shadeOf = (code: string) => byCode.get(code.toLowerCase());
  const labelFor = (code: string) => {
    const row = shadeOf(code);
    return row ? shadeName(row, locale) : code;
  };
  const buyable = (code: string) => {
    const row = shadeOf(code);
    return row ? shadeAvailable(row, tracked) : true;
  };

  const shipping = t.detail.shippingFree.replace('{amount}', money(FREE_SHIPPING_OVER_KRW));

  /** a product with shades cannot go in the cart until an available one is chosen */
  const putInCart = (): boolean => {
    if (soldOut) return false;
    // the cart is for members: no session, and both buttons go to LOGIN, which
    // brings the shopper back to this product afterwards
    if (!requireSignIn()) return false;
    if (needsShade && (!shade || !buyable(shade))) {
      setWarn(true);
      return false;
    }
    add(product.id, needsShade ? shade : null, 1);
    return true;
  };

  return (
    <div id="contents">
      <div className="detail_area">
        <Gallery product={product} alt={copy.name} />

        <div className="info_col">
          <h2 className="prd_name">{copy.name}</h2>

          <p className="prd_summary">
            {copy.desc.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>

          {/* label | value rows on an 82px label column, as the reference sets them */}
          <dl className="spec">
            {product.customPriceKrw ? (
              <div className="row consumer">
                <dt>{t.detail.consumerPrice}</dt>
                <dd>
                  <s>{money(product.customPriceKrw)}</s>
                </dd>
              </div>
            ) : null}

            <div className="row sale">
              <dt>{t.detail.salePrice}</dt>
              <dd>
                <strong>{money(product.priceKrw)}</strong>
                {product.discountRate ? (
                  <strong className="rate">({percent(product.discountRate)})</strong>
                ) : null}
              </dd>
            </div>

            <div className="row points">
              <dt>{t.detail.points}</dt>
              <dd>
                {money(pointsKrw)} ({percent(POINTS_RATE * 100)})
              </dd>
            </div>

            <div className="row shipping">
              <dt>{t.detail.shipping}</dt>
              <dd>
                <strong>{money(SHIPPING_FEE_KRW)}</strong> ({shipping})
              </dd>
            </div>
          </dl>

          {needsShade ? (
            <div className="options">
              <span className="options_label">{t.detail.selectLabel}</span>
              <div className="options_value">
                <div className="swatches">
                  {product.colors.map((color) => {
                    const available = buyable(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        // a sold-out shade stays visible and stays in place; it
                        // simply cannot be chosen, which is honest about what
                        // the shop has rather than hiding it
                        className={`swatch${shade === color ? ' is-selected' : ''}${
                          available ? '' : ' is-out'
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={
                          available ? labelFor(color) : `${labelFor(color)} — ${t.detail.soldOut}`
                        }
                        aria-pressed={shade === color}
                        disabled={!available}
                        title={labelFor(color)}
                        onClick={() => {
                          setShade(color);
                          setWarn(false);
                        }}
                      />
                    );
                  })}
                </div>
                {shade ? (
                  <p className="chosen">
                    {t.detail.selectLabel} : {labelFor(shade)}
                  </p>
                ) : (
                  <p className={`required${warn ? ' is-warning' : ''}`}>{t.detail.optionRequired}</p>
                )}
              </div>
            </div>
          ) : null}

          <div className="total">
            <strong className="label">{t.detail.total} :</strong>
            <em className="amount">{money(product.priceKrw * quantity)}</em>
            <span className="count">
              ({number(quantity)} {t.detail.pieces})
            </span>
          </div>

          {soldOut ? <p className="stock_note is-out">{t.detail.soldOut}</p> : null}
          {lowStock ? (
            <p className="stock_note is-low">
              {t.detail.lowStock.replace('{n}', number(availability?.stock ?? 0))}
            </p>
          ) : null}

          <div className="buy_row">
            <button
              type="button"
              className="btn_buy"
              disabled={soldOut}
              onClick={() => {
                if (putInCart()) navigate('/order/checkout');
              }}
            >
              {soldOut ? t.detail.soldOut : t.detail.buyNow}
            </button>
            <button
              type="button"
              className={`btn_cart${added ? ' is-added' : ''}`}
              disabled={soldOut}
              onClick={() => {
                if (putInCart()) setAdded(true);
              }}
            >
              {added ? t.cart.added : t.detail.addToCart}
            </button>
            <button type="button" className="btn_share" aria-label={t.detail.share}>
              ⌁
            </button>
          </div>

          <p className="back_row">
            <span className="hover-line">
              <Link to="/">{t.detail.back}</Link>
            </span>
          </p>
        </div>
      </div>

      <div className="prd_detail">
        <h2>{t.detail.detailHeading}</h2>
        <p className="note">{t.detail.detailNote}</p>
        <div className="sheet">
          <ImageSlot
            slot={gallerySlot(product.id, 6)}
            alt={`${copy.name} detail`}
            ratio="120%"
            label={`product_gallery_${product.id}_6 · long sheet`}
          />
        </div>
      </div>

      <ProductReviews productId={product.id} rating={meta.ratings[product.id]} />
    </div>
  );
}
