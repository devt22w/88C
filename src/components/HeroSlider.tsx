import { ImageSlot, useSlotSource } from './ImageSlot';
import { Chevron } from './Chevron';
import { useSlider } from '../hooks/useSlider';
import { heroSlides } from '../data/site';
import { useLocale } from '../i18n/LocaleProvider';
import type { HeroSlideStructure } from '../data/site';
import type { SlideCopy } from '../i18n/types';

interface SlideProps {
  slide: HeroSlideStructure;
  copy: SlideCopy;
  active: boolean;
  eager: boolean;
}

/**
 * One hero slide.
 *
 * The live text layer only draws while the slot is still empty. Real banner
 * artwork carries its own headline, so once a picture is injected the overlay
 * stands down instead of printing a second headline over the first.
 */
/** the coupon threshold is one number in won; each language prints it in the
 *  currency that language shops in, so the copy never contradicts the prices */
const COUPON_MIN_KRW = 10000;

function HeroSlide({ slide, copy, active, eager }: SlideProps) {
  const hasArtwork = Boolean(useSlotSource(slide.slot, true));
  const { money } = useLocale();

  return (
    <div className={`swiper-slide${active ? ' is-active' : ''}`} aria-hidden={active ? undefined : true}>
      <a className="slide_link" href={slide.href}>
        <ImageSlot
          slot={slide.slot}
          alt={copy.alt}
          loading={eager ? 'eager' : 'lazy'}
          label={`${slide.slot} · 1550 × 560`}
          localised
        />
        {hasArtwork ? null : (
          <div className="slide_text">
            <h1>
              {copy.headline.map((line) => (
                <span key={line} style={{ display: 'block' }}>
                  {line}
                </span>
              ))}
            </h1>
            {copy.lines.map((line) => (
              <p key={line}>{line.replace('{amount}', money(COUPON_MIN_KRW))}</p>
            ))}
          </div>
        )}
      </a>
    </div>
  );
}

/**
 * SECTION 4 — full-bleed hero. Slides are a hard 560px band, dots are 10px with
 * 35px gaps centred inside a band inset 50px each side, and the 29 x 61px
 * chevrons overhang the content band by 25px on each side.
 */
export function HeroSlider() {
  const { t } = useLocale();
  const { index, goTo, next, prev, pause, resume } = useSlider(heroSlides.length);

  return (
    <div className="main_banner" onMouseEnter={pause} onMouseLeave={resume}>
      <div className="swiper-wrapper">
        {heroSlides.map((slide, i) => (
          <HeroSlide
            key={slide.slot}
            slide={slide}
            copy={t.hero.slides[i]}
            active={i === index}
            eager={i === 0}
          />
        ))}
      </div>

      {/* chevrons, overhanging the 1550px band by 25px */}
      <div className="main-nav">
        <button type="button" className="main-prev" onClick={prev} aria-label={t.a11y.prevSlide}>
          <ImageSlot slot="icon_hero_prev" alt="" fallback={<Chevron direction="prev" />} />
        </button>
        <button type="button" className="main-next" onClick={next} aria-label={t.a11y.nextSlide}>
          <ImageSlot slot="icon_hero_next" alt="" fallback={<Chevron direction="next" />} />
        </button>
      </div>

      <div className="page">
        <div className="swiper-pagination">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.slot}
              type="button"
              className={`swiper-pagination-bullet${i === index ? ' swiper-pagination-bullet-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`${t.a11y.goToSlide} ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
