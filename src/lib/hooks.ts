import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api';

type State<T> = { data: T | null; error: string | null; loading: boolean };

export function useApi<T>(
  path: string | null,
  options: { refreshMs?: number; enabled?: boolean } = {},
) {
  const { refreshMs, enabled = true } = options;
  const active = Boolean(path) && enabled;
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: active });
  const [nonce, setNonce] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!path || !enabled) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }
    let alive = true;
    setState((prev) => ({ ...prev, loading: prev.data === null, error: null }));

    api<T>(path)
      .then((data) => {
        if (alive) setState({ data, error: null, loading: false });
      })
      .catch((error: Error) => {
        if (alive) setState((prev) => ({ data: prev.data, error: error.message, loading: false }));
      });

    return () => {
      alive = false;
    };
  }, [path, enabled, nonce]);

  useEffect(() => {
    if (!refreshMs || !path || !enabled) return undefined;
    const id = window.setInterval(() => setNonce((n) => n + 1), refreshMs);
    return () => window.clearInterval(id);
  }, [refreshMs, path, enabled]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { ...state, reload };
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export function useScrolled(threshold = 18) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}
