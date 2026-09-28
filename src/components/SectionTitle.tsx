import { useReveal } from '../hooks/useReveal';

interface Props {
  title: string;
  subtitle: string;
  more?: { label: string; href: string };
}

/**
 * SECTION 5 — centred title block. The sub-line carries an 11px right padding,
 * which is what makes it sit ~11px left of true centre. Intentional; keep it.
 */
export function SectionTitle({ title, subtitle, more }: Props) {
  const ref = useReveal<HTMLDivElement>();

  return (
    <div className="main_title" ref={ref} data-reveal>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      {more ? (
        <p className="hover-line">
          <a className="more" href={more.href}>
            {more.label}
          </a>
        </p>
      ) : null}
    </div>
  );
}
