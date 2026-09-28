import { createContext, useContext, useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { SlotName, SlotSources } from '../types';
import { imageSources } from '../data/imageSources';
import { useLocale } from '../i18n/LocaleProvider';

const SlotSourceContext = createContext<SlotSources>(imageSources);

export function ImageSlotProvider({
  value,
  children
}: {
  value: SlotSources;
  children: ReactNode;
}) {
  return <SlotSourceContext.Provider value={value}>{children}</SlotSourceContext.Provider>;
}

/**
 * Does this slot currently have an image behind it?
 *
 * Used by the hero: real banner artwork normally has its headline baked in, so
 * the live text layer must stand down once a picture arrives, or the two
 * headlines print on top of each other.
 */
/** the whole slot → url map, for components that need to ask about several */
export function useSlotSources(): SlotSources {
  return useContext(SlotSourceContext);
}

export function useSlotSource(slot: SlotName, localised = false): string | undefined {
  const sources = useContext(SlotSourceContext);
  const { locale } = useLocale();
  return (localised ? sources[`${slot}.${locale}`] : undefined) ?? sources[slot];
}

export interface ImageSlotProps {
  /** SECTION 11 slot name — the key the database injects a URL against */
  slot: SlotName;
  alt: string;
  className?: string;
  style?: CSSProperties;
  /** intrinsic box, so the placeholder and the real image occupy the same area */
  width?: number | string;
  height?: number | string;
  /** padding-top ratio box for fluid slots (e.g. '100%' for a 1:1 product master) */
  ratio?: string;
  /** eager for the first hero slide, lazy for everything below it */
  loading?: 'lazy' | 'eager';
  /** short label drawn on the placeholder; defaults to the slot name */
  label?: string;
  /**
   * Drawn instead of the grey slot-name placeholder while the slot is empty.
   * Use it where a slot-name chip would look like a defect rather than a
   * placeholder — the hero chevrons, for instance, which need to read as
   * arrows whether or not anyone ever uploads a PNG for them.
   */
  fallback?: ReactNode;
  /**
   * Look for `<slot>.<locale>` before `<slot>`. Use it for artwork that carries
   * baked-in text — hero banners, campaign panels — so each language can be
   * served its own master without the layout moving.
   */
  localised?: boolean;
}

/**
 * An image slot never defines layout. The wrapper already owns the width,
 * height or ratio; the injected image only fills it. That is why swapping a
 * placeholder for a real URL moves nothing on the page.
 *
 * If a URL fails to load — a dead link, a host that blocks hotlinking, a
 * private file — the slot falls back to its placeholder rather than showing a
 * broken-image icon. URLs come from the database, so a bad row is an everyday
 * possibility, not an exceptional one.
 */
export function ImageSlot({
  slot,
  alt,
  className,
  style,
  width,
  height,
  ratio,
  loading = 'lazy',
  label,
  localised = false,
  fallback
}: ImageSlotProps) {
  const sources = useContext(SlotSourceContext);
  const { locale } = useLocale();
  const src = (localised ? sources[`${slot}.${locale}`] : undefined) ?? sources[slot];

  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // a new URL deserves a fresh attempt
  useEffect(() => {
    setFailedSrc(null);
  }, [src]);

  const showImage = Boolean(src) && src !== failedSrc;

  const wrapperStyle: CSSProperties = { ...style };
  if (width !== undefined) wrapperStyle.width = width;
  if (height !== undefined) wrapperStyle.height = height;

  const onError = () => {
    if (src) {
      console.warn(`[image_slots] "${slot}" could not load its image: ${src}`);
      setFailedSrc(src);
    }
  };

  const placeholder = fallback ?? <span className="slot__placeholder">{label ?? slot}</span>;

  if (ratio) {
    return (
      <span className={['slot', className].filter(Boolean).join(' ')} style={wrapperStyle} data-slot={slot}>
        <span className="slot__ratio" style={{ display: 'block', paddingTop: ratio }} />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block'
          }}
        >
          {showImage ? (
            <img
              className="slot__img"
              src={src}
              alt={alt}
              loading={loading}
              onError={onError}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            placeholder
          )}
        </span>
      </span>
    );
  }

  return (
    <span className={['slot', className].filter(Boolean).join(' ')} style={wrapperStyle} data-slot={slot}>
      {showImage ? (
        <img className="slot__img" src={src} alt={alt} loading={loading} onError={onError} />
      ) : (
        placeholder
      )}
    </span>
  );
}
