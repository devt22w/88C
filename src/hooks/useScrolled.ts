import { useEffect, useState } from 'react';

/**
 * SECTION 9.1 — the TOP button is hidden on load and revealed once the user
 * scrolls. Nothing else on the page reacts to scroll: the header in particular
 * stays exactly as it is (SECTION 10.5).
 */
export function useScrolled(threshold = 300) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
