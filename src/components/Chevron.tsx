/**
 * Drawn chevrons for the hero arrows.
 *
 * SECTION 4 specifies a 29 x 61px PNG in the icon_hero_prev / icon_hero_next
 * slots. Until one is uploaded the slot would otherwise print its own name in
 * a grey chip, which reads as a bug rather than an empty slot. These strokes
 * fill the same 29 x 61 box, so swapping a real PNG in changes nothing about
 * the layout.
 */
export function Chevron({ direction }: { direction: 'prev' | 'next' }) {
  const d = direction === 'prev' ? 'M20 6 L8 30.5 L20 55' : 'M9 6 L21 30.5 L9 55';

  return (
    <svg
      className="chevron"
      width="29"
      height="61"
      viewBox="0 0 29 61"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}
