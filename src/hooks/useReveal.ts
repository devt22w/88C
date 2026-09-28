import { useEffect, useRef } from 'react';

/**
 * SECTION 10.4 — the AOS-style scroll reveal, kept restrained: fade-up with a
 * 40px offset over roughly 800ms, once only, fired when the section enters the
 * viewport. Used on section titles and product grids only — never the header,
 * never the footer.
 */
export function useReveal<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
