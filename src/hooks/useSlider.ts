import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * SECTION 4 — hero behaviour: looping autoplay, clickable dots, arrows always
 * visible. The original drives this with a v4-era Swiper; the behaviour and the
 * markup hooks (.swiper-wrapper / .swiper-slide / .swiper-pagination-bullet)
 * are reproduced here without the dependency, so the CSS contract is identical.
 */
export function useSlider(count: number, delay = 5000) {
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    stop();
    if (count < 2) return;
    timer.current = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, delay);
  }, [count, delay, stop]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
      start();
    },
    [count, start]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  return { index, goTo, next, prev, pause: stop, resume: start };
}
