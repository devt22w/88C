import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

/**
 * A ~60 line router.
 *
 * The storefront has two views — the home page and a product page — so pulling
 * in a routing library would cost more bundle than it saves. This does the four
 * things the site actually needs: read the path, push a new one, intercept
 * in-app link clicks, and respond to the back button.
 */

const RouteContext = createContext<{ path: string; navigate: (to: string) => void } | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname
  );

  const navigate = useCallback((to: string) => {
    // a link may carry a query string — /order/result?order=…&token=… — but the
    // routes are matched on the path alone, so the two are separated here
    const url = new URL(to, window.location.origin);
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    window.history.pushState({}, '', to);
    setPath(url.pathname);
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) throw new Error('useRoute must be used inside <RouterProvider>');
  return context;
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/**
 * An ordinary anchor — real href, middle-click and "open in new tab" keep
 * working — that navigates in place on a plain left click.
 */
export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useRoute();

  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** '/product/b1' → 'b1', anything else → null */
export function matchProduct(path: string): string | null {
  const match = /^\/product\/([A-Za-z0-9_-]+)\/?$/.exec(path);
  return match ? match[1] : null;
}

/** '/category/acc-tool' → 'acc-tool', anything else → null */
export function matchCategory(path: string): string | null {
  const match = /^\/category\/([A-Za-z-]+)\/?$/.exec(path);
  return match ? match[1] : null;
}
