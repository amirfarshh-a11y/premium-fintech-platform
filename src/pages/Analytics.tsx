import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { MarketsResponse } from '../lib/types';
import { useApi } from '../lib/hooks';
import { formatCompact, formatPct, pctClass } from '../lib/format';
import { DataBadge } from '../components/DataBadge';
import { PerformancePanel } from '../components/PerformancePanel';
import { MarketTable } from '../components/MarketTable';
import { ErrorState, Skeleton } from '../components/States';

export default function Analytics() {
  const { data, loading, error, reload } = useApi<MarketsResponse>('/markets/cryptos', { refreshMs: 60_000 });
  const assets = data?.assets || [];

  const movers = [...assets].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 4);
  const totalCap = assets.reduce((sum, asset) => sum + asset.marketCap, 0);
  const totalVolume = assets.reduce((sum, asset) => sum + asset.volume24h, 0);

  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">Market analytics</span>
          <h1 className="h1">
            Read the range, not the <span className="serif-italic gold-text">noise</span>
          </h1>
          <p className="lede">
            Line and candlestick views across 24 hours, 7 days, 30 days and one year — with volume, high and low
            derived from the same series.
          </p>
          <div className="row row--wrap" style={{ gap: 10 }}>
            <DataBadge source={data?.source} provider={data?.provider} updatedAt={data?.updatedAt} />
            <span className="badge">Aggregate cap {formatCompact(totalCap, 'USD')}</span>
            <span className="badge">Aggregate volume {formatCompact(totalVolume, 'USD')}</span>
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          {error ? (
            <ErrorState message={error} onRetry={reload} title="Analytics unavailable" />
          ) : loading && assets.length === 0 ? (
            <Skeleton className="skeleton--block" style={{ height: 440 }} />
          ) : (
            <PerformancePanel assets={assets} initialId="bitcoin" />
          )}

          <div className="grid grid--4" style={{ marginTop: 24 }}>
            {movers.map((asset) => (
              <div className="mini-stat" key={asset.id}>
                <label>
                  {asset.symbol} · 24h
                </label>
                <b className={pctClass(asset.change24h)}>{formatPct(asset.change24h)}</b>
                <span>{formatCompact(asset.volume24h, 'USD')} traded</span>
              </div>
            ))}
          </div>

          <div className="section-head" style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
            <div className="section-head__text">
              <span className="eyebrow">Full market table</span>
              <h2 className="h2" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.2rem)' }}>
                Compare every tracked asset
              </h2>
            </div>
            <Link to="/markets" className="btn btn--ghost btn--sm">
              Open markets <ArrowUpRight size={14} className="btn__icon" />
            </Link>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card__hairline" />
            {assets.length > 0 ? (
              <MarketTable assets={assets} caption="Full market analytics table" />
            ) : (
              <div style={{ padding: 20 }}>
                <Skeleton className="skeleton--block" style={{ height: 200 }} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
