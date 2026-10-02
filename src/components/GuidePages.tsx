import { Link } from '../router';
import { contactDetails } from '../data/site';
import { useLocale, useT } from '../i18n/LocaleProvider';
import {
  FREE_SHIPPING_OVER_KRW,
  SHIPPING_FEE_KRW
} from '../../supabase/functions/_shared/pricing.ts';

/**
 * SHOPPING GUIDE and CS — the two links in the chrome that had no page.
 *
 * Both describe what this shop actually does rather than generic store copy:
 * the shipping rule comes from the same constants the checkout charges with,
 * and the CS details are the resort's own published lines, so there is one
 * place to change a phone number and it changes everywhere.
 */

function Shell({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return (
    <div id="contents">
      <div className="account_area wide">
        <div className="account_head">
          <h2 className="account_title">{title}</h2>
          <p className="account_lead">{lead}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

export function GuidePage() {
  const t = useT();
  const { money } = useLocale();
  const copy = t.guide;

  const shipping = copy.shipBody
    .replace('{fee}', money(SHIPPING_FEE_KRW))
    .replace('{threshold}', money(FREE_SHIPPING_OVER_KRW));

  return (
    <Shell title={copy.title} lead={copy.lead}>
      <ol className="guide_steps">
        {copy.steps.map((step) => (
          <li key={step.heading}>
            <h3>{step.heading}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="guide_blocks">
        <section>
          <h3>{copy.payTitle}</h3>
          <p>{copy.payBody}</p>
        </section>
        <section>
          <h3>{copy.shipTitle}</h3>
          <p>{shipping}</p>
        </section>
        <section>
          <h3>{copy.trackTitle}</h3>
          <p>{copy.trackBody}</p>
        </section>
        <section>
          <h3>{copy.memberTitle}</h3>
          <p>{copy.memberBody}</p>
        </section>
        <section>
          <h3>{copy.returnTitle}</h3>
          <p>{copy.returnBody}</p>
        </section>
      </div>

      <div className="guide_cta">
        <Link className="btn_outline" to="/order/delivery">
          {copy.ctaTrack}
        </Link>
        <Link className="btn_outline" to="/board/contact">
          {copy.ctaContact}
        </Link>
      </div>
    </Shell>
  );
}

export function CsPage() {
  const t = useT();
  const copy = t.cs;

  return (
    <Shell title={copy.title} lead={copy.lead}>
      <div className="guide_blocks">
        <section>
          <h3>{copy.hoursTitle}</h3>
          {t.footer.cs.hours.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="cs_note">{copy.note}</p>
        </section>

        <section>
          <h3>{copy.channelsTitle}</h3>
          <dl className="contact_list">
            <div>
              <dt>{copy.phoneLabel}</dt>
              <dd>
                {contactDetails.phones.map((phone) => (
                  <span key={phone.number} style={{ display: 'block' }}>
                    <a href={'tel:' + phone.number.replace(/-/g, '')}>{phone.number}</a> ({phone.note})
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>{copy.kakaoLabel}</dt>
              <dd>{contactDetails.kakaoId}</dd>
            </div>
            <div>
              <dt>{copy.messengerLabel}</dt>
              <dd>{contactDetails.messenger}</dd>
            </div>
            <div>
              <dt>{copy.emailLabel}</dt>
              <dd>
                <a href={'mailto:' + contactDetails.email}>{contactDetails.email}</a>
              </dd>
            </div>
            <div>
              <dt>{copy.addressLabel}</dt>
              <dd>{contactDetails.address}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className="guide_cta">
        <Link className="btn_outline" to="/board/contact">
          {copy.ctaContact}
        </Link>
        <Link className="btn_outline" to="/order/delivery">
          {copy.ctaTrack}
        </Link>
        <Link className="btn_outline" to="/guide">
          {copy.ctaGuide}
        </Link>
      </div>
    </Shell>
  );
}
