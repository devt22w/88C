/**
 * Drawn defaults for the functional UI glyphs.
 *
 * SECTION 11 makes every picture a named slot, which is right for photography
 * and for the wordmark — but an empty 27 x 28 box printing "icon_cart" reads as
 * a defect, not as a placeholder. These strokes fill the exact box each slot
 * reserves, so uploading a real PNG later changes nothing about the layout.
 *
 * They use `currentColor`, so each one picks up the colour of the row it sits
 * in: taupe in the utility nav, red on the alarm item, light on the dark pill.
 *
 * Only generic symbols are drawn here. The social chips stay as placeholders
 * on purpose — those are brand marks and belong to their owners, so upload the
 * official assets into icon_instagram / icon_facebook / icon_naver.
 */

interface IconProps {
  width?: number;
  height?: number;
}

/** shopping bag, for the header cart and the add-to-cart pill */
export function BagIcon({ width = 27, height = 28 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4.5 8.5h18l-1.4 16.5H5.9L4.5 8.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9.8 11V7.2a3.7 3.7 0 0 1 7.4 0V11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** notification bell, for the permanently highlighted alarm item */
export function BellIcon({ width = 24, height = 24 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3.2a5.6 5.6 0 0 0-5.6 5.6c0 4.3-1.2 6-2 6.9h15.2c-.8-.9-2-2.6-2-6.9A5.6 5.6 0 0 0 12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M10.2 18.4a1.9 1.9 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** magnifier, for the search modal's submit button */
export function SearchIcon({ width = 22, height = 22 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="9.5" cy="9.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14.4 14.4 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** close cross, for every panel */
export function CloseIcon({ width = 14, height = 14 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.5 1.5 12.5 12.5M12.5 1.5 1.5 12.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** padlock, for the "secure connection" line above the login form */
export function LockIcon({ width = 12, height = 14 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="6" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.6 6V4.2a2.4 2.4 0 0 1 4.8 0V6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** thin upward chevron above the TOP label */
export function ArrowUpIcon({ width = 18, height = 12 }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1.5 9 9 2.5 16.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}
