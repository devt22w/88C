import { useEffect, useState } from 'react';
import { ImageSlot } from './ImageSlot';
import { BagIcon } from './Icons';
import { Link, useRoute } from '../router';
import { useCart } from '../cart/CartProvider';
import { useRequireSignIn } from '../account/useSession';
import { useLocale } from '../i18n/LocaleProvider';
import { useCatalogueMeta } from '../data/useCatalogueMeta';
import type { ProductStructure } from '../data/site';

interface Props {
  product: ProductStructure;
  /** ranking badge is optional and off by default */
  showRank?: boolean;
}

/**
 * SECTION 6.3 / 6.4 — the card.
 *
 * The two guards that keep a three-up row baseline-aligned on uneven data are
 * the 15px minimum-height colour-chip row and the hard 44px two-line clamp on
 * the description. Both matter more after translation, not less: the same card
 * has to hold Korean, English and a noticeably longer Indonesian string.
 *
 * Prices are stored once in won and converted here, so switching language
 * switches both the amount and the currency symbol.
 */
export function ProductCard({ product, showRank = false }: Props) {
  const { t, money, percent } = useLocale();
  const { add } = useCart();
  const requireSignIn = useRequireSignIn();
  const meta = useCatalogueMeta();
  const { navigate } = useRoute();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 1400);
    return () => window.clearTimeout(timer);
  }, [added]);

  const availability = meta.availability[product.id];
  const soldOut = Boolean(availability && !availability.in_stock);

  // products with shades need one chosen, which happens on the product page
  const onPill = () => {
    if (soldOut) return navigate(product.href);
    if (product.colors.length > 0) return navigate(product.href);
    // the cart is for members: no session, and this goes to LOGIN instead
    if (!requireSignIn()) return;
    add(product.id, null, 1);
    setAdded(true);
  };
  const copy = t.product.copy[product.id];

  return (
    <li>
      {/* the optional ranking badge numbers a product by its home-page slot */}
      {showRank && product.home ? <span className="prd_num">{product.home.position}</span> : null}

      <div className="thumbnail">
        <Link to={product.href}>
          <ImageSlot
            slot={product.slot}
            alt={copy.name}
            ratio="100%"
            label={`${product.slot} · 1:1`}
          />
          {/* the card still shows the product; it just says it cannot be had */}
          {soldOut ? <span className="sold_out">{t.detail.soldOut}</span> : null}
        </Link>
      </div>

      <div className="information">
        <div className="colorchip">
          <div className="color">
            {product.colors.map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <div className="name">
          <Link to={product.href}>
            <span>{copy.name}</span>
          </Link>
        </div>

        <p className="simple_desc">
          {copy.desc.map((line) => (
            <span key={line} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
        </p>

        {/* reading order: original price, current price, discount percentage */}
        <div className="price_wrap">
          {product.customPriceKrw ? (
            <span className="custom_price">{money(product.customPriceKrw)}</span>
          ) : null}
          <span className="price">{money(product.priceKrw)}</span>
          {product.discountRate ? (
            <span className="discount-rate">{percent(product.discountRate)}</span>
          ) : null}

          <button type="button" className={`cart_btn${soldOut ? ' is-out' : ''}`} onClick={onPill}>
            <span className="cart_btn_label">{added ? t.cart.added : t.product.addToCart}</span>
            <ImageSlot slot="icon_cart_pill" alt="" fallback={<BagIcon width={18} height={18} />} />
          </button>
        </div>
      </div>
    </li>
  );
}
