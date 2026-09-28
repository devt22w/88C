import { useEffect, useMemo, useRef, useState } from 'react';
import { ImageSlot } from './ImageSlot';
import { ArrowUpIcon, CloseIcon, SearchIcon } from './Icons';
import { useScrolled } from '../hooks/useScrolled';
import { csPhone, findProduct, sideMenu } from '../data/site';
import type { ProductStructure } from '../data/site';
import { useMostVisited, useRecentProducts } from '../data/useVisits';
import { buildIndex, searchProducts } from '../data/search';
import { useProductKeywords } from '../data/useProductKeywords';
import { useLocale, useT } from '../i18n/LocaleProvider';
import { useRoute } from '../router';

/** SECTION 9.1 — TOP button: fixed right 50px / bottom 30px, revealed on scroll */
export function TopButton() {
  const visible = useScrolled(300);
  const t = useT();

  return (
    <a
      className={`btn-top${visible ? ' is-visible' : ''}`}
      href="#wrap"
      onClick={(event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <ImageSlot slot="icon_top_arrow" alt="" fallback={<ArrowUpIcon />} />
      {t.top.label}
    </a>
  );
}

/** SECTION 9.2 — 345px slide-in side menu, right -345px → 0 over 0.3s */
export function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();

  return (
    <div className={`menu_wrap${open ? ' open' : ''}`} aria-hidden={open ? undefined : true}>
      <button type="button" className="close" onClick={onClose} aria-label={t.a11y.closeMenu}>
        <ImageSlot slot="icon_close" alt="" fallback={<CloseIcon />} />
      </button>

      <div className="login">
        <p>{t.sideMenu.loginPrompt}</p>
        <ul>
          <li className="hover-line">
            <a href="/member/login">{t.sideMenu.login}</a>
          </li>
          <li className="hover-line">
            <a href="/member/join">{t.sideMenu.join}</a>
          </li>
        </ul>
      </div>

      <ul className="my_menu">
        {sideMenu.map((item) => (
          <li key={item.key}>
            <a href={item.href}>{t.sideMenu[item.key]}</a>
          </li>
        ))}
      </ul>

      <div className="cs">
        <h3>{t.footer.cs.title}</h3>
        <h1>{csPhone}</h1>
        {t.footer.cs.hours.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

/**
 * SECTION 9.4 — the 552 x 442px search modal, now a live search.
 *
 * Every keystroke re-ranks the whole catalogue in memory, so results appear
 * from the first letter and narrow as the word gets more specific, down to the
 * single card when only one product can still match. Each row carries the
 * product's own thumbnail, aligned to the text baseline, so a shopper
 * recognises the item before reading its name.
 *
 * With the box empty it is the reference's keyword ticker again: a slow
 * vertical list, per-locale, because a Korean and an Indonesian shopper do not
 * search for the same words.
 */
export function SearchModal({
  open,
  seed,
  onClose
}: {
  open: boolean;
  /** what was typed in the header before the modal took over */
  seed: string;
  onClose: () => void;
}) {
  const t = useT();
  const { money } = useLocale();
  const { navigate } = useRoute();
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState('');
  const field = useRef<HTMLInputElement>(null);

  const keywords = t.search.hotKeywords;
  const rows = useMemo(() => [...keywords, ...keywords], [keywords]);

  const extraWords = useProductKeywords();
  const index = useMemo(() => buildIndex(t.product.copy, extraWords), [t.product.copy, extraWords]);
  const hits = useMemo(() => searchProducts(index, query), [index, query]);

  // opening the modal adopts whatever was typed in the header and puts the
  // caret after it, so the shopper never types the same word twice
  useEffect(() => {
    if (!open) return;
    setQuery(seed);
    const timer = window.setTimeout(() => {
      field.current?.focus();
      const end = field.current?.value.length ?? 0;
      field.current?.setSelectionRange(end, end);
    }, 60);
    return () => window.clearTimeout(timer);
  }, [open, seed]);

  // a language switch can shorten the ticker under us
  useEffect(() => {
    setOffset(0);
  }, [keywords]);

  useEffect(() => {
    if (!open || query) return;
    const timer = window.setInterval(() => {
      setOffset((current) => (current + 1) % keywords.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [open, query, keywords.length]);

  const go = (href: string) => {
    onClose();
    navigate(href);
  };

  return (
    <div className={`sch_wrap${open ? ' open' : ''}${query ? ' has_results' : ''}`} aria-hidden={open ? undefined : true}>
      <button type="button" className="close" onClick={onClose} aria-label={t.a11y.closeSearch}>
        <ImageSlot slot="icon_close" alt="" fallback={<CloseIcon />} />
      </button>

      <h2 className="tit">{t.search.title}</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          // Enter takes the best match, which after a specific word is the only
          // one left; with nothing matching it opens the full listing instead
          if (hits[0]) go(hits[0].product.href);
          else if (query) go('/category/all');
        }}
      >
        <fieldset>
          <input
            ref={field}
            type="text"
            className="keyword"
            placeholder={t.search.placeholder}
            aria-label={t.search.placeholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="search_btn" aria-label={t.a11y.openSearch}>
            <ImageSlot slot="icon_search" alt="" fallback={<SearchIcon />} />
          </button>
        </fieldset>
      </form>

      {query ? (
        <div className="sch_results">
          <p className="sch_count">
            {hits.length > 0 ? t.search.results.replace('{n}', String(hits.length)) : t.search.empty}
          </p>

          <ul>
            {hits.map((hit) => (
              <li key={hit.product.id}>
                <button type="button" onClick={() => go(hit.product.href)}>
                  <span className="sch_thumb">
                    {/* no slot-name chip at 54px — it would read as the product name */}
                    <ImageSlot slot={hit.product.slot} alt="" ratio="100%" label="" />
                  </span>
                  <span className="sch_name">{hit.name}</span>
                  <span className="sch_price">{money(hit.product.priceKrw)}</span>
                </button>
              </li>
            ))}
          </ul>

          {hits.length > 0 ? (
            <button type="button" className="sch_all" onClick={() => go('/category/all')}>
              {t.search.seeAll}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="hot_keyword">
          <ul className="keyword_track" style={{ transform: `translateY(-${offset * 50}px)` }}>
            {rows.map((keyword, i) => (
              <li
                key={`${keyword}-${i}`}
                className={i === offset + 1 ? 'swiper-slide-next' : undefined}
              >
                <button type="button" onClick={() => setQuery(keyword)}>
                  {keyword}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * SECTION 9.5 — the 491px panel, now answering two different questions.
 *
 * RECENT VISIT is this browser's own history, kept in localStorage, so it is
 * right the instant a product page closes. MOST VISITED is everyone's, counted
 * in the database — the panel asks for those totals only when that tab is
 * opened, so a shopper who never presses it costs no request at all.
 */
export function RecentPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const { money } = useLocale();
  const { navigate } = useRoute();
  const [tab, setTab] = useState<'recent' | 'most'>('recent');

  const recent = useRecentProducts(open);
  const { rows, loading } = useMostVisited(open && tab === 'most');

  const recentProducts = recent
    .map((entry) => findProduct(entry.id))
    .filter((product): product is ProductStructure => Boolean(product))
    .slice(0, 8);

  const mostProducts = rows
    .map((row) => ({ product: findProduct(row.product_id), views: row.views }))
    .filter((row): row is { product: ProductStructure; views: number } => Boolean(row.product))
    .slice(0, 8);

  const go = (href: string) => {
    onClose();
    navigate(href);
  };

  const showing = tab === 'recent' ? recentProducts.length > 0 : mostProducts.length > 0;

  return (
    <div id="recent" className={open ? 'open' : undefined} aria-hidden={open ? undefined : true}>
      <button type="button" className="close" onClick={onClose} aria-label={t.a11y.closeRecent}>
        <ImageSlot slot="icon_close" alt="" fallback={<CloseIcon />} />
      </button>

      <h2>{t.recent.title}</h2>

      <div className="recent_tabs">
        <button
          type="button"
          className={tab === 'recent' ? 'is-active' : undefined}
          onClick={() => setTab('recent')}
        >
          {t.recent.tabRecent}
        </button>
        <button
          type="button"
          className={tab === 'most' ? 'is-active' : undefined}
          onClick={() => setTab('most')}
        >
          {t.recent.tabMost}
        </button>
      </div>

      {!showing ? (
        <p className="recent_empty">
          {loading ? t.recent.loading : tab === 'recent' ? t.recent.empty : t.recent.emptyMost}
        </p>
      ) : null}

      <ul>
        {(tab === 'recent'
          ? recentProducts.map((product) => ({ product, views: null as number | null }))
          : mostProducts
        ).map(({ product, views }) => (
          <li key={product.id}>
            <button type="button" onClick={() => go(product.href)}>
              <ImageSlot slot={product.slot} alt="" ratio="100%" label="" />
              <span className="recent_name">{t.product.copy[product.id].name}</span>
              <span className="recent_meta">
                {views === null
                  ? money(product.priceKrw)
                  : (views === 1 ? t.recent.viewsOne : t.recent.views).replace('{n}', String(views))}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** the scrims behind the panels */
export function Scrim({ show, onClick }: { show: boolean; onClick: () => void }) {
  return <div className={`dark_bg${show ? ' show' : ''}`} onClick={onClick} />;
}
