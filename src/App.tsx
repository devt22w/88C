import { useState } from 'react';
import { PromoStrip } from './components/PromoStrip';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { SectionTitle } from './components/SectionTitle';
import { ProductGrid } from './components/ProductGrid';
import { MidBanner } from './components/MidBanner';
import { ProductPage } from './components/ProductPage';
import { CategoryPage } from './components/CategoryPage';
import {
  ContactPage,
  DeliveryPage,
  JoinPage,
  LoginPage,
  MissingPage,
  MyPage
} from './components/AccountPages';
import { CartPage, CheckoutPage, OrderResultPage } from './components/OrderPages';
import { AdminOrdersPage } from './components/AdminPages';
import { FindIdPage, FindPasswordPage, ResetPasswordPage } from './components/RecoverPages';
import { CsPage, GuidePage } from './components/GuidePages';
import { useCart } from './cart/CartProvider';
import { Footer } from './components/Footer';
import {
  RecentPanel,
  Scrim,
  SearchModal,
  SideMenu,
  TopButton
} from './components/FloatingLayer';
import { bestProducts, CATEGORY_SLUGS, newProducts } from './data/site';
import { useT } from './i18n/LocaleProvider';
import { matchCategory, matchProduct, useRoute } from './router';

/** the utility pages behind the top-right nav, keyed by their path */
const STATIC_ROUTES: Record<string, () => JSX.Element> = {
  '/member/login': LoginPage,
  '/member/join': JoinPage,
  '/order/delivery': DeliveryPage,
  '/board/contact': ContactPage,
  '/order/basket': CartPage,
  '/order/checkout': CheckoutPage,
  '/order/result': OrderResultPage,
  '/myshop': MyPage,
  '/myshop/order': MyPage,
  '/myshop/info': MyPage,
  '/member/find-id': FindIdPage,
  '/member/find-password': FindPasswordPage,
  '/member/reset': ResetPasswordPage,
  '/guide': GuidePage,
  '/board/cs': CsPage
};

/** the home page body: hero, BEST, mid banner, NEW */
function HomeSections() {
  const t = useT();

  return (
    <div id="contents">
      <HeroSlider />

      <section className="best_pd pd pd2">
        <div className="container">
          <SectionTitle title={t.sections.best.title} subtitle={t.sections.best.subtitle} />
          <ProductGrid products={bestProducts} />
        </div>
      </section>

      <MidBanner />

      <section className="new_pd pd pd2">
        <div className="container">
          <SectionTitle title={t.sections.fresh.title} subtitle={t.sections.fresh.subtitle} />
          <ProductGrid products={newProducts} />
        </div>
      </section>
    </div>
  );
}

/**
 * SECTION 2 — page skeleton, in DOM order:
 *   (1) .header_banner  (2) #header.header_new  (3) .header_dummy spacer
 *   (4) main.main  (5) #footer  (6) the floating layer.
 *
 * The shell is identical on every route; only what sits inside `main` changes.
 */
export default function App() {
  const t = useT();
  const { count: cartCount } = useCart();
  const { path } = useRoute();
  const productId = matchProduct(path);
  const categorySlug = matchCategory(path);
  const category = categorySlug ? CATEGORY_SLUGS[categorySlug] : undefined;
  const normalised = path.replace(/\/$/, '');
  const isHome = normalised === '' || normalised === '/index.html';
  // staff pages: no promo strip, no shop chrome, nothing a customer would see
  const isAdmin = normalised === '/admin' || normalised.startsWith('/admin/');
  // anything that is not the home page and matches nothing renders the
  // "not built yet" page rather than silently repeating the home page
  const StaticPage =
    STATIC_ROUTES[normalised] ?? (productId || category || isHome ? undefined : MissingPage);
  const isSub = Boolean(productId || category || StaticPage);

  const [bannerVisible, setBannerVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // what the header handed over, replayed into the modal's own box
  const [searchSeed, setSearchSeed] = useState('');
  const [recentOpen, setRecentOpen] = useState(false);

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setRecentOpen(false);
  };

  if (isAdmin) {
    return (
      <div id="wrap" className="admin">
        <main className="main">
          <AdminOrdersPage />
        </main>
      </div>
    );
  }

  return (
    <div id="wrap" className={isSub ? 'sub' : 'home'}>
      {bannerVisible ? <PromoStrip onClose={() => setBannerVisible(false)} /> : null}

      <Header
        bannerVisible={bannerVisible}
        cartCount={cartCount}
        onOpenMenu={() => {
          closeAll();
          setMenuOpen(true);
        }}
        onOpenSearch={(query) => {
          closeAll();
          setSearchSeed(query);
          setSearchOpen(true);
        }}
      />

      {/* the spacer div that pushes content below the fixed header — not body padding */}
      <div className={`header_dummy${bannerVisible ? '' : ' no_banner'}`} />

      <main className="main">
        {productId ? (
          <ProductPage id={productId} />
        ) : category ? (
          <CategoryPage category={category} />
        ) : StaticPage ? (
          <StaticPage />
        ) : (
          <HomeSections />
        )}
      </main>

      <Footer />

      {/* SECTION 9 — floating layer */}
      <TopButton />
      <SideMenu open={menuOpen} onClose={closeAll} />
      <SearchModal open={searchOpen} seed={searchSeed} onClose={closeAll} />
      <RecentPanel open={recentOpen} onClose={closeAll} />
      <Scrim show={menuOpen || searchOpen || recentOpen} onClick={closeAll} />

      {/* a small hook so the recently-viewed panel is reachable in the demo */}
      <button
        type="button"
        className="recent_toggle"
        aria-label={t.a11y.openRecent}
        onClick={() => {
          const next = !recentOpen;
          closeAll();
          setRecentOpen(next);
        }}
      >
        {t.recent.title}
      </button>
    </div>
  );
}
