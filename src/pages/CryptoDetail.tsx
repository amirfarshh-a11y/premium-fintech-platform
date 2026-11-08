import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Info } from 'lucide-react';
import type { AssetDetailResponse, MarketsResponse } from '../lib/types';
import { useApi } from '../lib/hooks';
import { formatCompact, formatCurrency, formatPct, pctClass } from '../lib/format';
import { CoinMark } from '../components/CoinMark';
import { DataBadge } from '../components/DataBadge';
import { PriceChange } from '../components/PriceChange';
import { Sparkline } from '../components/Sparkline';
import { PerformancePanel } from '../components/PerformancePanel';
import { ErrorState, Skeleton } from '../components/States';
import { WatchButton } from '../components/WatchButton';

export default function CryptoDetail() {
  const { id = 'bitcoin' } = useParams();
  const detail = useApi<AssetDetailResponse>(`/markets/cryptos/${id}`, { refreshMs: 60_000 });
  const markets = useApi<MarketsResponse>('/markets/cryptos', { refreshMs: 60_000 });

  const asset = detail.data?.asset;
  const profile = detail.data?.profile;
  const related = (markets.data?.assets || []).filter((item) => item.id !== id).slice(0, 3);

  if (detail.error) {
    return (
      <div className="container" style={{ paddingTop: 160, paddingBottom: 120 }}>
        <ErrorState
          title="We could not open that market"
          message={detail.error}
          onRetry={detail.reload}
        />
        <div style={{ marginTop: 20 }}>
          <Link to="/markets" className="btn btn--ghost">
            <ArrowLeft size={15} /> Back to markets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner" style={{ maxWidth: 1000 }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/markets">Markets</Link>
            <span aria-hidden>/</span>
            <span style={{ color: 'var(--gold-200)' }}>{asset?.symbol || id.toUpperCase()}</span>
          </div>

          {detail.loading && !asset ? (
            <div className="stack stack-16">
              <Skeleton className="skeleton--title" style={{ width: 280, height: 34 }} />
              <Skeleton className="skeleton--text" style={{ width: 200, height: 40 }} />
            </div>
          ) : asset ? (
            <>
              <div className="row row--between row--wrap" style={{ gap: 16 }}>
                <div className="row" style={{ gap: 16 }}>
                  <CoinMark symbol={asset.symbol} color={asset.color} size="lg" />
                  <div className="stack stack-4">
                    <h1 className="h1" style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}>
                      {asset.name}
                    </h1>
                    <div className="row" style={{ gap: 10 }}>
                      <span className="asset-cell__ticker" style={{ fontSize: '0.8rem' }}>
                        {asset.symbol} / USD
                      </span>
                      <span className="badge badge--gold">Rank #{asset.rank}</span>
                      <DataBadge source={detail.data?.source} provider={detail.data?.provider} compact />
                    </div>
                  </div>
                </div>

                <div className="row" style={{ gap: 8 }}>
                  <WatchButton symbol={asset.symbol} label="Watchlist" size="md" />
                  <Link to={`/portfolio?symbol=${asset.symbol}`} className="btn btn--gold btn--sm">
                    <Briefcase size={15} /> Add to portfolio
                  </Link>
                </div>
              </div>

              <div className="price-hero">
                <strong>{formatCurrency(asset.price)}</strong>
                <PriceChange value={asset.change24h} suffix="24h" />
                <PriceChange value={asset.change7d} suffix="7d" />
                <PriceChange value={asset.change30d} suffix="30d" />
              </div>
            </>
          ) : null}
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          {markets.loading && !markets.data ? (
            <Skeleton className="skeleton--block" style={{ height: 420 }} />
          ) : (
            <PerformancePanel assets={markets.data?.assets || []} initialId={id} />
          )}

          <div className="grid grid--2" style={{ marginTop: 24, alignItems: 'start' }}>
            <div className="card card--pad stack stack-12">
              <span className="panel-label">About {asset?.name || 'this asset'}</span>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.92rem', lineHeight: 1.72 }}>
                {profile?.about ||
                  'A curated profile for this asset is being prepared by the research desk.'}
              </p>
              <div className="row" style={{ gap: 8, color: 'var(--text-faint)', fontSize: '0.78rem' }}>
                <Info size={14} />
                <span>Profiles are editorial summaries, not investment recommendations.</span>
              </div>
            </div>

            <div className="card card--pad">
              <span className="panel-label">Market snapshot</span>
              <div className="metric-list" style={{ marginTop: 8 }}>
                <div className="metric-row">
                  <span>Price</span>
                  <b>{asset ? formatCurrency(asset.price) : '—'}</b>
                </div>
                <div className="metric-row">
                  <span>Market capitalisation</span>
                  <b>{asset ? formatCompact(asset.marketCap, 'USD') : '—'}</b>
                </div>
                <div className="metric-row">
                  <span>Volume (24h)</span>
                  <b>{asset ? formatCompact(asset.volume24h, 'USD') : '—'}</b>
                </div>
                <div className="metric-row">
                  <span>24h change</span>
                  <b className={pctClass(asset?.change24h || 0)}>{asset ? formatPct(asset.change24h) : '—'}</b>
                </div>
                <div className="metric-row">
                  <span>7-day trend</span>
                  <b>
                    <div style={{ width: 120, height: 30 }}>
                      {asset ? (
                        <Sparkline data={asset.sparkline} positive={asset.change7d >= 0} strokeWidth={1.4} />
                      ) : null}
                    </div>
                  </b>
                </div>
              </div>
            </div>
          </div>

          <div className="section-head" style={{ marginTop: 'clamp(40px, 5vw, 64px)' }}>
            <div className="section-head__text">
              <span className="eyebrow">Related markets</span>
              <h2 className="h2" style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)' }}>
                Compare with the majors
              </h2>
            </div>
            <Link to="/markets" className="btn btn--ghost btn--sm">
              All markets <ArrowRight size={14} className="btn__icon" />
            </Link>
          </div>

          <div className="grid grid--3">
            {related.map((item) => (
              <Link to={`/markets/${item.id}`} className="crypto-card" key={item.id}>
                <div className="crypto-card__head">
                  <CoinMark symbol={item.symbol} color={item.color} />
                  <div className="grow">
                    <div className="crypto-card__name">{item.name}</div>
                    <div className="crypto-card__ticker">{item.symbol}</div>
                  </div>
                  <PriceChange value={item.change24h} showIcon={false} />
                </div>
                <div className="crypto-card__price">
                  <strong>{formatCurrency(item.price)}</strong>
                </div>
                <div className="crypto-card__chart">
                  <Sparkline data={item.sparkline} positive={item.change7d >= 0} />
                </div>
                <span className="article-card__link">View details <ArrowRight size={14} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
