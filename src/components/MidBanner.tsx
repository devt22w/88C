import { ImageSlot } from './ImageSlot';
import { midBanners } from '../data/site';
import { useT } from '../i18n/LocaleProvider';

/**
 * SECTION 7 — the two-up event strip between BEST and NEW.
 *
 * The band is 1443px, narrower than the 1550px content band, so the pair sits
 * visibly inset. Each panel is calc(50% - 15px), the first floated left and the
 * second floated right, which yields the fixed 30px gutter between them.
 *
 * Like the hero, the panel artwork is a localised slot: campaign banners
 * normally carry their headline inside the image.
 */
export function MidBanner() {
  const t = useT();

  return (
    <div className="mid_banner">
      <div className="clearfix">
        {midBanners.map((panel, i) => {
          const copy = t.midBanner.panels[i];

          return (
            <a key={panel.slot} className="banner_item" href={panel.href}>
              <ImageSlot
                slot={panel.slot}
                alt={copy.alt}
                ratio="25.32%"
                label={`${panel.slot} · 707 × 179`}
                localised
              />
              <span className="banner_text">
                <span className="eyebrow" style={{ display: 'block' }}>
                  {copy.eyebrow}
                </span>
                <h3>
                  {copy.headline.map((line) => (
                    <span key={line} style={{ display: 'block' }}>
                      {line}
                    </span>
                  ))}
                </h3>
              </span>
            </a>
          );
        })}
      </div>

      {/* optional badge: 7s linear rotation, infinite, never pauses */}
      {/* <div className="mid_tit" aria-hidden="true">
        <ImageSlot slot="mid_badge" alt="" label="badge" />
      </div> */}
    </div>
  );
}
