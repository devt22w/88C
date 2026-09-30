import { useState } from 'react';
import type { FormEvent } from 'react';
import { ImageSlot } from './ImageSlot';
import { LanguageSwitcher } from './LanguageSwitcher';
import { BagIcon, BellIcon } from './Icons';
import { Link, useRoute } from '../router';
import { categoriesLeft, categoriesRight, topMenu } from '../data/site';
import { useT } from '../i18n/LocaleProvider';
import { useSession, useSignOut } from '../account/useSession';
import { NotificationBell } from './Notifications';

interface Props {
  bannerVisible: boolean;
  cartCount: number;
  onOpenMenu: () => void;
  /** carries whatever has been typed here into the search modal */
  onOpenSearch: (query: string) => void;
}

/**
 * SECTIONS 3.2 – 3.4 — fixed header at top 40px, about 185px tall, a 1px
 * #dbd6d3 bottom border. Deliberately static: no shrink, no shadow, no
 * hide-on-scroll, no colour change (SECTION 10.5).
 */
export function Header({ bannerVisible, cartCount, onOpenMenu, onOpenSearch }: Props) {
  const t = useT();
  const { session } = useSession();
  const signOut = useSignOut();
  const { navigate } = useRoute();

  // signed in, LOGIN and JOIN are meaningless; the row keeps its four slots so
  // nothing to the right of it shifts when the session resolves
  const utility = session
    ? topMenu.filter((item) => item.key !== 'login' && item.key !== 'join')
    : topMenu;

  // The header box is a doorway, not the search itself: the first keystroke
  // hands the word to the modal, which has room for the results and the
  // thumbnails. Clearing it afterwards keeps the two boxes from disagreeing.
  const [typed, setTyped] = useState('');

  const handOver = (value: string) => {
    setTyped('');
    onOpenSearch(value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handOver(typed);
  };

  return (
    <header id="header" className={`header_new${bannerVisible ? '' : ' no_banner'}`}>
      {/* SECTION 3.3 — top row */}
      <div className="head_top">
        <div className="container clearfix">
          <h1 className="logo">
            <Link to="/">
              <ImageSlot
                slot="logo_header"
                alt={t.a11y.logo}
                width={240}
                height={29}
                loading="eager"
                label="logo_header"
              />
            </Link>
          </h1>

          <div className="top_right clearfix">
            <ul className="top_menu">
              {session ? (
                <>
                  <li className="hover-line">
                    <Link to="/myshop">{t.auth.myPage}</Link>
                  </li>
                  <li className="hover-line">
                    <button
                      type="button"
                      className="top_menu_button"
                      onClick={async () => {
                        await signOut();
                        navigate('/');
                      }}
                    >
                      {t.auth.signOut}
                    </button>
                  </li>
                </>
              ) : null}

              {utility.map((item) => (
                <li key={item.key} className="hover-line">
                  <Link to={item.href}>{t.nav[item.key]}</Link>
                </li>
              ))}
            </ul>

            {/* click-to-translate, on the utility row's own baseline */}
            <LanguageSwitcher />

            <NotificationBell />

            <div className="top_cart">
              <Link to="/order/basket" aria-label={t.a11y.cart}>
                <ImageSlot
                  slot="icon_cart"
                  alt=""
                  className="cart_icon"
                  width={27}
                  height={28}
                  fallback={<BagIcon />}
                />
                {/* the brackets around the count are drawn by CSS */}
                <span className="cart_label">{cartCount}</span>
              </Link>
            </div>

            <form className="searchBarForm" onSubmit={onSubmit} role="search">
              <input
                type="text"
                className="keyword"
                name="keyword"
                placeholder={t.nav.searchPlaceholder}
                aria-label={t.nav.searchPlaceholder}
                value={typed}
                autoComplete="off"
                onChange={(event) => handOver(event.target.value)}
              />
            </form>

            <button type="button" className="menu_btn" onClick={onOpenMenu} aria-label={t.a11y.openMenu}>
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3.4 — category row, height produced purely by the 80px line-height */}
      <nav className="head_bottom">
        <div className="container clearfix">
          <ul className="head_bottom_category">
            {categoriesLeft.map((item) => (
              <li key={item.key}>
                <Link to={item.href}>{t.categories[item.key]}</Link>
              </li>
            ))}
          </ul>

          <ul className="head_bottom_category pull-right">
            {categoriesRight.map((item) => (
              <li key={item.key} className={item.alarm ? 'alarm' : undefined}>
                {item.alarm ? (
                  <ImageSlot
                    slot="icon_alarm"
                    alt=""
                    className="alarm_icon"
                    width={24}
                    height={24}
                    fallback={<BellIcon />}
                  />
                ) : null}
                <a href={item.href}>{t.categories[item.key]}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* SECTION 9.6 — rails present in the markup, disabled on this theme */}
      <div className="head_left" aria-hidden="true" />
      <div className="head_right" aria-hidden="true" />
    </header>
  );
}
