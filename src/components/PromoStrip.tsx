import { promoStrip } from '../data/site';
import { useT } from '../i18n/LocaleProvider';

interface Props {
  onClose: () => void;
}

/**
 * SECTION 3.1 — fixed promo strip, 40px tall, #b6a59d, copy centred in a 1200px
 * band. Its hover underline is the only real text-decoration on the site.
 */
export function PromoStrip({ onClose }: Props) {
  const t = useT();

  return (
    <div className="header_banner">
      <div className="header_con">
        <a href={promoStrip.href}>{t.promo.text}</a>
        <button type="button" className="header_close" onClick={onClose}>
          {t.promo.close}
        </button>
      </div>
    </div>
  );
}
