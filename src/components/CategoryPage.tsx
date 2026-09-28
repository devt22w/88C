import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from './ProductCard';
import { Link } from '../router';
import { useReveal } from '../hooks/useReveal';
import { productsInCategory, SLUG_BY_CATEGORY } from '../data/site';
import { useLocale } from '../i18n/LocaleProvider';
import type { CategoryKey, ProductStructure } from '../data/site';

/** the reference lists twelve products to a page */
const PER_PAGE = 12;

type SortKey = 'newest' | 'lowPrice' | 'popular' | 'reviews' | 'views';

/** reviews and views need data this build does not have yet */
const SORTABLE: Record<SortKey, boolean> = {
  newest: true,
  lowPrice: true,
  popular: true,
  reviews: false,
  views: false
};

const SORT_ORDER: SortKey[] = ['newest', 'lowPrice', 'popular', 'reviews', 'views'];

function sortProducts(items: ProductStructure[], key: SortKey | null): ProductStructure[] {
  if (!key) return items;
  const indexed = items.map((item, i) => ({ item, i }));

  const rank = (item: ProductStructure, section: 'best' | 'new') =>
    item.home?.section === section ? item.home.position : Number.POSITIVE_INFINITY;

  switch (key) {
    case 'lowPrice':
      return [...items].sort((a, b) => a.priceKrw - b.priceKrw);
    case 'newest':
      // NEW ITEM cards lead, in their home-page order; everything else keeps catalogue order
      return indexed
        .sort((a, b) => rank(a.item, 'new') - rank(b.item, 'new') || a.i - b.i)
        .map(({ item }) => item);
    case 'popular':
      // BEST ITEM cards lead, by their ranking; everything else keeps catalogue order
      return indexed
        .sort((a, b) => rank(a.item, 'best') - rank(b.item, 'best') || a.i - b.i)
        .map(({ item }) => item);
    default:
      return items;
  }
}

/**
 * Category listing, positioned against the reference at 1920px:
 *
 *   header bottom
 *     + 95px   the category name, 16px, centred, on a 48px line
 *     + 77px   the TOTAL bar: 35px tall with a 2px #1d1d1d rule beneath it,
 *              "TOTAL n" left and five sort links right
 *     then     a four-up grid across the full 1450px content band
 */
export function CategoryPage({ category }: { category: CategoryKey }) {
  const { t, number } = useLocale();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey | null>(null);
  const ref = useReveal<HTMLUListElement>();

  const products = useMemo(
    () => sortProducts(productsInCategory(category), sort),
    [category, sort]
  );
  const pages = Math.max(1, Math.ceil(products.length / PER_PAGE));

  // switching shelf starts at the top of the new one, unsorted
  useEffect(() => {
    setPage(1);
    setSort(null);
  }, [category]);

  const visible = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const label = t.categories[category];
  const href = `/category/${SLUG_BY_CATEGORY[category]}`;

  const goTo = (next: number) => {
    setPage(Math.min(Math.max(next, 1), pages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="contents" className="list_contents">
      <div className="list_area">
        {/* the reference hides its breadcrumb; keep it for screen readers only */}
        <nav className="blind" aria-label={t.list.here}>
          <Link to="/">{t.list.home}</Link> / {label}
        </nav>

        <h2 className="list_title">{label}</h2>

        <div className="list_bar">
          <p className="total">
            TOTAL <span>{number(products.length)}</span>
          </p>

          <ul className="sort">
            {SORT_ORDER.map((key) => {
              const available = SORTABLE[key];
              return (
                <li key={key}>
                  <button
                    type="button"
                    className={sort === key ? 'is-active' : undefined}
                    aria-pressed={sort === key}
                    aria-disabled={available ? undefined : true}
                    title={available ? undefined : t.list.sortUnavailable}
                    onClick={() => {
                      if (!available) return;
                      setSort(key);
                      setPage(1);
                    }}
                  >
                    {t.list.sort[key]}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {products.length === 0 ? (
          <p className="list_empty">{t.list.empty}</p>
        ) : (
          <div className="pd pd2 list_grid">
            <ul ref={ref} data-reveal>
              {visible.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </ul>
          </div>
        )}

        {pages > 1 ? (
          <div className="ec-base-paginate">
            <ul>
              <li>
                <a
                  href={href}
                  aria-label={t.list.prevPage}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(page - 1);
                  }}
                >
                  ‹
                </a>
              </li>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <a
                    href={href}
                    className={n === page ? 'this' : undefined}
                    aria-current={n === page ? 'page' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(n);
                    }}
                  >
                    {number(n)}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={href}
                  aria-label={t.list.nextPage}
                  onClick={(event) => {
                    event.preventDefault();
                    goTo(page + 1);
                  }}
                >
                  ›
                </a>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
