import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { GlobalsResponse, MarketsResponse } from '../lib/types';
import { useApi } from '../lib/hooks';
import { formatCompact, formatPct, pctClass } from '../lib/format';
import { DataBadge } from '../components/DataBadge';
import { MarketTable } from '../components/MarketTable';
import { ErrorState, EmptyState, Skeleton } from '../components/States';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';

type Filter = 'all' | 'gainers' | 'losers' | 'watchlist';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All assets' },
  { key: 'gainers', label: 'Gainers' },
  { key: 'losers', label: 'Losers' },
  { key: 'watchlist', label: 'My watchlist' },
];

export default function Markets() {
  const markets = useApi<MarketsResponse>('/markets/cryptos', { refreshMs: 60_000 });
  const globals = useApi<GlobalsResponse>('/markets/globals', { refreshMs: 120_000 });
  const { has, symbols } = useWatchlist();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const assets = markets.data?.assets || [];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesQuery =
        !needle || asset.name.toLowerCase().includes(needle) || asset.symbol.toLowerCase().includes(needle);
      if (!matchesQuery) return false;
      if (filter === 'gainers') return asset.change24h > 0;
      if (filter === 'losers') return asset.change24h < 0;
      if (filter === 'watchlist') return has(asset.symbol);
      return true;
    });
  }, [assets, query, filter, has]);

  const gainers = assets.filter((asset) => asset.change24h > 0).length;
  const advancersPct = assets.length ? (gainers / assets.length) * 100 : 0;

  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">Cryptocurrency markets</span>
          <h1 className="h1">
            Every market, one <span className="serif-italic gold-text">lens</span>
          </h1>
          <p className="lede">
            Sort by price, momentum, capitalisation or volume. Prices are quoted in USD and refresh automatically
            while you work.
          </p>
          <div className="row row--wrap" style={{ gap: 10 }}>
            <DataBadge
              source={markets.data?.source}
              provider={markets.data?.provider}
              updatedAt={markets.data?.updatedAt}
            />
            <span className="badge">
              <SlidersHorizontal size={12} /> {assets.length} instruments
            </span>
            <span className="badge">Market breadth {advancersPct.toFixed(0)}% advancing</span>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="dash-cards" style={{ marginBottom: 24 }}>
            <div className="mini-stat">
              <label>Global market cap</label>
              <b>{globals.data ? formatCompact(globals.data.crypto.marketCap, 'USD') : '—'}</b>
              <span className={pctClass(globals.data?.crypto.marketCapChange24h || 0)}>
                {globals.data ? formatPct(globals.data.crypto.marketCapChange24h) : '—'} 24h
              </span>
            </div>
            <div className="mini-stat">
              <label>24h volume</label>
              <b>{globals.data ? formatCompact(globals.data.crypto.volume24h, 'USD') : '—'}</b>
              <span>Across tracked venues</span>
            </div>
            <div className="mini-stat">
              <label>BTC dominance</label>
              <b>{globals.data ? `${globals.data.crypto.btcDominance.toFixed(1)}%` : '—'}</b>
              <span>Of total market cap</span>
            </div>
            <div className="mini-stat">
              <label>Your watchlist</label>
              <b>{user ? symbols.length : '—'}</b>
              <span>{user ? 'Tracked assets' : 'Sign in to track'}</span>
            </div>
          </div>

          <div className="row row--between row--wrap" style={{ gap: 16, marginBottom: 18 }}>
            <div className="chip-row" role="group" aria-label="Filter assets">
              {FILTERS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="chip"
                  aria-pressed={filter === item.key}
                  onClick={() => setFilter(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <label className="search" style={{ minWidth: 240, flex: '0 1 320px' }}>
              <span className="search__icon">
                <Search size={15} />
              </span>
              <span className="visually-hidden">Search assets</span>
              <input
                className="input"
                type="search"
                placeholder="Search bitcoin, ETH…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card__hairline" />
            {markets.error ? (
              <div style={{ padding: 20 }}>
                <ErrorState message={markets.error} onRetry={markets.reload} title="Market feed unavailable" />
              </div>
            ) : markets.loading && assets.length === 0 ? (
              <div className="stack stack-12" style={{ padding: 20 }}>
                {Array.from({ length: 7 }).map((_, index) => (
                  <Skeleton key={index} className="skeleton--text" style={{ height: 44 }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: 20 }}>
                <EmptyState
                  title={filter === 'watchlist' ? 'Nothing on your watchlist yet' : 'No assets match that search'}
                  body={
                    filter === 'watchlist'
                      ? 'Use the star beside any asset to add it to your watchlist, then it will appear here.'
                      : 'Try a different term, or clear the filter to see the full market.'
                  }
                  icon={<Search size={20} />}
                  action={
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => {
                        setQuery('');
                        setFilter('all');
                      }}
                    >
                      Show all assets
                    </button>
                  }
                />
              </div>
            ) : (
              <MarketTable assets={filtered} caption="Cryptocurrency markets" />
            )}
          </div>

          <p className="muted" style={{ fontSize: '0.76rem', marginTop: 16 }}>
            Prices, market capitalisation and volume are supplied by the configured market data provider and may be
            delayed. Demo values are labelled and never presented as live pricing.
          </p>
        </div>
      </section>
    </>
  );
}
