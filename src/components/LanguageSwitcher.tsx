import { useLocale } from '../i18n/LocaleProvider';
import { LOCALES, LOCALE_LABELS } from '../i18n/types';

/**
 * Click-to-translate, sitting in the utility nav beside LOGIN / JOIN.
 *
 * It borrows the row's own type treatment — 14px display face, #685d5b, the
 * 0.5s left-wiping underline from Section 3.5 — so it reads as part of the
 * original header rather than an add-on. The active locale keeps its line
 * drawn, which is what `.hover-line > a.active` already does.
 */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <ul className="lang_switch" aria-label={t.a11y.languageSwitcher}>
      {LOCALES.map((code) => (
        <li key={code} className="hover-line">
          <a
            href={`?lang=${code}`}
            className={code === locale ? 'active' : undefined}
            aria-current={code === locale ? 'true' : undefined}
            title={t.a11y.switchTo[code]}
            onClick={(event) => {
              event.preventDefault();
              setLocale(code);
            }}
          >
            {LOCALE_LABELS[code]}
          </a>
        </li>
      ))}
    </ul>
  );
}
