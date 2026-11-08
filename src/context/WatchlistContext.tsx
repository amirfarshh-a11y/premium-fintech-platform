import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

type WatchlistValue = {
  symbols: string[];
  loading: boolean;
  has: (symbol: string) => boolean;
  toggle: (symbol: string) => Promise<boolean>;
};

const WatchlistContext = createContext<WatchlistValue | null>(null);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!user) {
      setSymbols([]);
      return () => {
        alive = false;
      };
    }
    setLoading(true);
    api<{ symbols: string[] }>('/me/watchlist')
      .then((data) => {
        if (alive) setSymbols(data.symbols);
      })
      .catch(() => {
        if (alive) setSymbols([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  const toggle = useCallback(
    async (symbol: string) => {
      const tracked = symbols.includes(symbol);
      const data = tracked
        ? await api<{ symbols: string[] }>(`/me/watchlist/${symbol}`, { method: 'DELETE' })
        : await api<{ symbols: string[] }>('/me/watchlist', { method: 'POST', body: { symbol } });
      setSymbols(data.symbols);
      return !tracked;
    },
    [symbols],
  );

  const value = useMemo<WatchlistValue>(
    () => ({
      symbols,
      loading,
      has: (symbol: string) => symbols.includes(symbol),
      toggle,
    }),
    [symbols, loading, toggle],
  );

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used inside WatchlistProvider');
  return context;
}
