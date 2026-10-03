import { ImageSlot, useSlotSource } from './ImageSlot';
import { Link } from '../router';
import { bankAccounts, csPhone, footerLinks } from '../data/site';
import { useT } from '../i18n/LocaleProvider';

/**
 * SECTION 8 — footer. White, separated only by the 2px #2d2d2d top rule sitting
 * 170px below the last section. Four floated columns: 285 / 550 / 330 / 280.
 *
 * Every label here is translated; the values that are not language at all —
 * account numbers, the phone number, the registration numbers — stay put.
 */
export function Footer() {
  const t = useT();
  const company = t.footer.company;
  // one wordmark for the whole site: the footer slot is used when someone has
  // uploaded a separate lock-up, and the header's artwork otherwise, so the two
  // can never drift apart by accident
  const hasFooterMark = Boolean(useSlotSource('logo_footer'));

  return (
    <footer id="footer">
      <div className="footer_all">
        {/* 8.2 — column 1, the wordmark */}
        <div className="f_logo">
          <Link to="/" aria-label={t.a11y.logo}>
            <ImageSlot
              slot={hasFooterMark ? 'logo_footer' : 'logo_header'}
              alt={t.a11y.logo}
              width={195}
              height={26}
              label="logo"
            />
          </Link>
        </div>

        {/* 8.3 — column 2, company information */}
        <div className="f_info">
          <p>
            <span>
              {company.nameLabel} : {company.name}
            </span>
            <span>
              {company.ceoLabel} : {company.ceo}
            </span>
          </p>
          <p>
            <span>
              {company.registrationLabel} : {company.registration}
            </span>
            <span>
              <a href={footerLinks.businessCheck}>{company.businessCheck}</a>
            </span>
          </p>
          <p>
            <span>
              {company.mailOrderLabel} : {company.mailOrder}
            </span>
            <span>
              {company.privacyOfficerLabel} : {company.privacyOfficer}
            </span>
          </p>
          <p>
            <span>{company.address}</span>
          </p>

          <p className="copy">
            {t.footer.copyright.map((line) => (
              <span key={line} style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </p>

          <ul className="sns">
            <li>
              <a href={footerLinks.instagram}>
                <ImageSlot slot="icon_instagram" alt="Instagram" width={22} height={22} label="ig" />
              </a>
            </li>
            <li>
              <a href={footerLinks.facebook}>
                <ImageSlot slot="icon_facebook" alt="Facebook" width={22} height={22} label="fb" />
              </a>
            </li>
            <li>
              <a href={footerLinks.naver}>
                <ImageSlot slot="icon_naver" alt="Naver Post" width={22} height={22} label="np" />
              </a>
            </li>
            {/* the fourth item is the pipe-separated policy row, same baseline */}
            <li className="policy">
              <span className="hover-line">
                <a href={footerLinks.brandStory}>{t.footer.policies.brandStory}</a>
              </span>
              <span className="hover-line">
                <span className="divider">|</span>
                <a href={footerLinks.shoppingGuide}>{t.footer.policies.shoppingGuide}</a>
              </span>
              <span className="hover-line">
                <span className="divider">|</span>
                <Link to={footerLinks.terms}>{t.footer.policies.terms}</Link>
              </span>
              <span className="hover-line">
                <span className="divider">|</span>
                {/* bold, as a privacy policy link conventionally is */}
                <Link to={footerLinks.privacyPolicy}>
                  <strong>{t.footer.policies.privacyPolicy}</strong>
                </Link>
              </span>
              <span className="hover-line">
                <span className="divider">|</span>
                <a href={footerLinks.businessCheck}>{t.footer.policies.businessCheck}</a>
              </span>
            </li>
          </ul>
        </div>

        {/* 8.4 — column 3, CS CENTER */}
        <div className="f_cs">
          <h6 className="tit">{t.footer.cs.title}</h6>
          <h2>{t.footer.cs.heading}</h2>
          <div className="txt_01">
            {csPhone}
            <span>{t.footer.cs.phoneLabel}</span>
            <i>›</i>
          </div>
          {t.footer.cs.hours.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {/* 8.5 — column 4, BANK INFO and BUSINESS */}
        <div className="f_bank">
          <ul>
            <li className="txt01">{t.footer.bank.title}</li>
            <li className="txt02">{t.footer.bank.holder}</li>
            {bankAccounts.map((account) => (
              <li key={account.number} className="txt03">
                <span>{t.footer.bank.banks[account.key]}</span>
                {account.number}
              </li>
            ))}
            <li className="txt01">{t.footer.bank.businessTitle}</li>
            <li className="hover-line">
              <a href={footerLinks.partnership}>{t.footer.bank.partnership}</a>
            </li>
            <li className="hover-line">
              <a href={footerLinks.bulkOrder}>{t.footer.bank.bulkOrder}</a>
            </li>
          </ul>
        </div>

        {/* closing two-line notice, repeating the 285 / 550 column widths */}
        <div className="info02">
          <div className="col_a" />
          <div className="col_b">
            {t.footer.notice.map((line) => (
              <span key={line} style={{ display: 'block' }}>
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
