import { Link } from 'react-router-dom';
import { ArrowUpRight, Info } from 'lucide-react';
import type { GlobalsResponse } from '../lib/types';
import { useApi } from '../lib/hooks';
import { formatCompact, formatPct, pctClass } from '../lib/format';
import { DataBadge } from '../components/DataBadge';
import { PriceChange } from '../components/PriceChange';
import { Sparkline } from '../components/Sparkline';
import { ErrorState, Skeleton } from '../components/States';

const GROUPS: { key: 'Equities' | 'Commodities' | 'Forex'; title: string; copy: string }[] = [
  {
    key: 'Equities',
    title: 'Equity indices',
    copy: 'The risk-appetite barometer. Index direction sets the tone that digital assets typically follow with a lag.',
  },
  {
    key: 'Commodities',
    title: 'Commodities',
    copy: 'Metals and energy price inflation expectations, real yields and the cost of carrying risk.',
  },
  {
    key: 'Forex',
    title: 'Foreign exchange',
    copy: 'Dollar strength is the single most reliable cross-asset transmission channel in a liquidity-driven market.',
  },
];

export default function GlobalMarkets() {
  const { data, loading, error, reload } = useApi<GlobalsResponse>('/markets/globals', { refreshMs: 120_000 });

  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">Global financial markets</span>
          <h1 className="h1">
            The world, <span className="serif-italic gold-text">priced</span>
          </h1>
          <p className="lede">
            Equity indices, metals, energy and foreign exchange in one consistent frame, alongside digital-asset
            aggregates.
          </p>
          <div className="row row--wrap" style={{ gap: 10 }}>
            <span className="badge badge--gold">
              <Info size={12} /> Reference snapshot
            </span>
            <DataBadge source={data?.source} provider={data?.provider} updatedAt={data?.updatedAt} />
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="dash-cards">
            <div className="mini-stat">
              <label>Digital asset market cap</label>
              <b>{data ? formatCompact(data.crypto.marketCap, 'USD') : '—'}</b>
              <span className={pctClass(data?.crypto.marketCapChange24h || 0)}>
                {data ? formatPct(data.crypto.marketCapChange24h) : '—'} 24h
              </span>
            </div>
            <div className="mini-stat">
              <label>Digital asset volume</label>
              <b>{data ? formatCompact(data.crypto.volume24h, 'USD') : '—'}</b>
              <span>Rolling 24 hours</span>
            </div>
            <div className="mini-stat">
              <label>BTC dominance</label>
              <b>{data ? `${data.crypto.btcDominance.toFixed(1)}%` : '—'}</b>
              <span>{data ? `ETH ${data.crypto.ethDominance.toFixed(1)}%` : '—'}</span>
            </div>
            <div className="mini-stat">
              <label>Tracked assets</label>
              <b>{data ? data.crypto.activeAssets.toLocaleString('en-US') : '—'}</b>
              <span>Across the digital-asset universe</span>
            </div>
          </div>

          {error ? (
            <div style={{ marginTop: 24 }}>
              <ErrorState message={error} onRetry={reload} title="Global markets unavailable" />
            </div>
          ) : loading && !data ? (
            <div className="grid grid--3" style={{ marginTop: 24 }}>
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="skeleton--block" style={{ height: 150 }} />
              ))}
            </div>
          ) : (
            GROUPS.map((group) => {
              const rows = (data?.indices || []).filter((row) => row.group === group.key);
              if (rows.length === 0) return null;
              return (
                <div key={group.key} style={{ marginTop: 'clamp(32px, 4vw, 52px)' }}>
                  <div className="section-head" style={{ marginBottom: 20 }}>
                    <div className="section-head__text">
                      <span className="eyebrow">{group.title}</span>
                      <p className="lede" style={{ maxWidth: '62ch' }}>{group.copy}</p>
                    </div>
                  </div>
                  <div className="grid grid--3">
                    {rows.map((row) => (
                      <div className="index-card" key={row.id}>
                        <div className="index-card__head">
                          <div>
                            <div className="index-card__name">{row.name}</div>
                            <div className="index-card__region">
                              {row.symbol} · {row.region} · {row.unit}
                            </div>
                          </div>
                          <PriceChange value={row.change} />
                        </div>
                        <div className="index-card__value">
                          {row.value.toLocaleString('en-US', { maximumFractionDigits: row.value < 10 ? 4 : 2 })}
                        </div>
                        <div className="index-card__spark">
                          <Sparkline data={row.spark} positive={row.change >= 0} strokeWidth={1.4} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}

          <div
            className="card card--pad"
            style={{ marginTop: 'clamp(32px, 4vw, 52px)', display: 'flex', gap: 14, alignItems: 'flex-start' }}
          >
            <Info size={18} style={{ color: 'var(--gold-300)', flex: 'none', marginTop: 2 }} />
            <div className="stack stack-4">
              <strong style={{ fontSize: '0.92rem' }}>About these figures</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Equity, commodity and foreign-exchange values are an illustrative reference snapshot maintained by
                the Aurum desk. They are not a live institutional feed and should not be used for execution.
                Digital-asset aggregates come from the configured market data provider and are labelled as live or
                demo at the top of this page.
              </p>
              <Link to="/analytics" className="article-card__link">
                Open market analytics <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
