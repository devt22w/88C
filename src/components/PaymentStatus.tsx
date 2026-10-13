import { Link } from '../router';
import { ONLINE_PAYMENT_LIVE, contactDetails } from '../data/site';
import { useT } from '../i18n/LocaleProvider';

/**
 * "Online payment is almost ready — for now it is cash."
 *
 * Shown wherever a shopper is about to think about paying: the cart, the
 * checkout and the shopping guide. One flag controls all of them
 * (ONLINE_PAYMENT_LIVE in data/site.ts), so the day the merchant account goes
 * live every notice disappears at once and none is left behind contradicting
 * the others.
 *
 * `compact` is the one-line version for a page that already explains itself.
 */
export function PaymentStatus({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const copy = t.paymentStatus;

  if (ONLINE_PAYMENT_LIVE) return null;

  if (compact) {
    return (
      <p className="pay_status_line">
        <span className="pay_status_badge">{copy.badge}</span>
        {copy.body}
      </p>
    );
  }

  return (
    <aside className="pay_status">
      <div className="pay_status_head">
        <span className="pay_status_badge">{copy.badge}</span>
        <h3>{copy.title}</h3>
      </div>

      <p>{copy.body}</p>

      <h4>{copy.cashTitle}</h4>
      <ol>
        {copy.cashSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <p className="pay_status_contact">
        <a href={'tel:' + contactDetails.phones[0].number.replace(/-/g, '')}>
          {contactDetails.phones[0].number}
        </a>
        {' · '}
        <a href={'mailto:' + contactDetails.email}>{contactDetails.email}</a>
      </p>

      <Link className="btn_outline" to="/board/contact">
        {copy.cta}
      </Link>
    </aside>
  );
}

/**
 * The same notice on DELIVERY.
 *
 * Tracking follows an online order, and while payment is not live there are no
 * online orders to follow — the form would have asked for an order number that
 * cannot exist. Rather than a search that always comes back "not found", the
 * page says so and hands the shopper the lines customer service answers on.
 */
export function TrackingStatus() {
  const t = useT();
  const copy = t.paymentStatus;

  if (ONLINE_PAYMENT_LIVE) return null;

  return (
    <aside className="pay_status">
      <div className="pay_status_head">
        <span className="pay_status_badge">{copy.badge}</span>
        <h3>{copy.trackTitle}</h3>
      </div>

      <p>{copy.trackBody}</p>

      <ol>
        {copy.trackSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <p className="pay_status_contact">
        {contactDetails.phones.map((phone) => (
          <span key={phone.number} className="pay_status_phone">
            <a href={'tel:' + phone.number.replace(/-/g, '')}>{phone.number}</a>
            <em> {phone.note}</em>
          </span>
        ))}
        <a href={'mailto:' + contactDetails.email}>{contactDetails.email}</a>
      </p>

      <Link className="btn_outline" to="/board/contact">
        {copy.cta}
      </Link>
    </aside>
  );
}
