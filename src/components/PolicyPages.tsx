import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '../router';
import { contactDetails, csPhone, footerLinks, legalDetails } from '../data/site';
import { useLocale, useT } from '../i18n/LocaleProvider';
import { LOCALE_TAGS } from '../i18n/types';
import type { LegalBlock, LegalDocument } from '../i18n/types';

/**
 * TERMS OF USE and PRIVACY POLICY — as pages, and as the modal JOIN opens.
 *
 * Laid out the way a legal page is expected to read: the title, the date the
 * text took effect, a table of contents, then numbered sections a reader can
 * link to directly (/policy/privacy#rights). The text itself lives in
 * src/i18n/messages/legal.*.ts; the operator's name, email, phone and address
 * are filled in here from src/data/site.ts, so they are never retyped.
 */

export type PolicyKind = 'terms' | 'privacy';

const FILLS: Record<string, string> = {
  operator: legalDetails.operator,
  site: legalDetails.site,
  email: contactDetails.email,
  privacyEmail: legalDetails.privacyEmail,
  phone: csPhone,
  address: contactDetails.address
};

const fill = (text: string) => text.replace(/\{(\w+)\}/g, (match, key: string) => FILLS[key] ?? match);

/** 'Effective October 3, 2026', in the reader's language */
function useEffectiveLine() {
  const t = useT();
  const { locale } = useLocale();
  // the version is an ISO date; noon UTC keeps it on the same calendar day in
  // every timezone the reader might be in
  const date = new Date(legalDetails.version + 'T12:00:00Z').toLocaleDateString(LOCALE_TAGS[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return t.legal.effective.replace('{date}', date);
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === 'string') return <p>{fill(block)}</p>;
  return (
    <ul>
      {block.map((item) => (
        <li key={item}>{fill(item)}</li>
      ))}
    </ul>
  );
}

/**
 * The document itself, shared by the page and the modal. Only the page gives
 * its sections ids — it is the one a link can point into.
 */
function PolicyText({ doc, anchors }: { doc: LegalDocument; anchors: boolean }) {
  const t = useT();
  const { locale } = useLocale();

  return (
    <>
      {doc.intro.map((block, index) => (
        <Block key={index} block={block} />
      ))}

      {doc.sections.map((section) => (
        <section key={section.id} id={anchors ? section.id : undefined}>
          <h3>{section.heading}</h3>
          {section.body.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </section>
      ))}

      {locale !== 'en' ? <p className="policy_note">{t.legal.governingLanguage}</p> : null}
    </>
  );
}

function PolicyDocument({ kind }: { kind: PolicyKind }) {
  const t = useT();
  const copy = t.legal;
  const doc = copy[kind];
  const effective = useEffectiveLine();

  // arriving on /policy/privacy#rights: the section did not exist when the
  // browser looked for it, so jump to it once it has rendered
  useEffect(() => {
    const target = decodeURIComponent(window.location.hash.slice(1));
    if (target) document.getElementById(target)?.scrollIntoView();
  }, [kind]);

  return (
    <div id="contents">
      <div className="account_area wide policy_area">
        <div className="account_tabs policy_tabs">
          <Link className={`tab${kind === 'terms' ? ' is-active' : ''}`} to={footerLinks.terms}>
            {copy.terms.title}
          </Link>
          <Link className={`tab${kind === 'privacy' ? ' is-active' : ''}`} to={footerLinks.privacyPolicy}>
            {copy.privacy.title}
          </Link>
        </div>

        <div className="account_head">
          <h2 className="account_title">{doc.title}</h2>
          <p className="account_lead">{fill(doc.lead)}</p>
          <p className="policy_meta">
            <span>{effective}</span>
            <button type="button" className="btn_text" onClick={() => window.print()}>
              {copy.print}
            </button>
          </p>
        </div>

        <div className="policy_layout">
          <nav className="policy_toc" aria-label={copy.contents}>
            <h3>{copy.contents}</h3>
            <ol>
              {doc.sections.map((section) => (
                <li key={section.id}>
                  {/* a plain fragment link: the router leaves the path alone
                      and the browser scrolls to the section */}
                  <a href={`#${section.id}`}>{section.heading}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="policy_body">
            <PolicyText doc={doc} anchors />

            <p className="policy_other">
              <Link
                className="btn_outline"
                to={kind === 'terms' ? footerLinks.privacyPolicy : footerLinks.terms}
              >
                {kind === 'terms' ? copy.seePrivacy : copy.seeTerms}
              </Link>
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

export function TermsPage() {
  return <PolicyDocument kind="terms" />;
}

export function PrivacyPage() {
  return <PolicyDocument kind="privacy" />;
}

/**
 * The document in a modal, with ACCEPT at the foot.
 *
 * ACCEPT stays locked until the text has been scrolled to the end — agreeing
 * should mean the whole document went past the reader's eyes. A screen tall
 * enough to show everything at once unlocks it straight away. Closing any other
 * way (×, the backdrop, Esc) leaves the box unticked.
 */
export function PolicyModal({
  kind,
  onAccept,
  onClose
}: {
  kind: PolicyKind;
  onAccept: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const copy = t.legal;
  const doc = copy[kind];
  const effective = useEffectiveLine();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [readToEnd, setReadToEnd] = useState(false);

  // a few pixels of slack: zoom and rounding rarely land on the exact bottom
  const check = () => {
    const body = bodyRef.current;
    if (body && body.scrollTop + body.clientHeight >= body.scrollHeight - 8) setReadToEnd(true);
  };

  // each document starts unread, at the top
  useEffect(() => {
    setReadToEnd(false);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    check();
  }, [kind]);

  // the page behind stays put while the modal is open, and Esc closes it
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // rendered on <body>, so no stacking context in the page can trap it under
  // the fixed header
  return createPortal(
    <div className="policy_modal" onClick={onClose}>
      <div
        className="policy_dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy_modal_title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="policy_dialog_head">
          <div>
            <h2 id="policy_modal_title">{doc.title}</h2>
            <p>{effective}</p>
          </div>
          <button type="button" className="policy_dialog_close" aria-label={copy.close} onClick={onClose}>
            ×
          </button>
        </header>

        <div className="policy_dialog_body policy_body" ref={bodyRef} onScroll={check} tabIndex={0}>
          <PolicyText doc={doc} anchors={false} />
        </div>

        <footer className="policy_dialog_foot">
          <p className={readToEnd ? 'is-done' : undefined}>
            {readToEnd ? copy.readDone : copy.scrollToAccept}
          </p>
          <button type="button" className="policy_accept" disabled={!readToEnd} onClick={onAccept}>
            {copy.accept}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
