import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Globe2,
  Layers3,
  LineChart,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import type { Article, Asset, GlobalsResponse, MarketsResponse, IndexRow } from '../lib/types';
import { useApi } from '../lib/hooks';
import { formatCompact, formatCurrency, formatPct, pctClass } from '../lib/format';
import { CoinMark } from '../components/CoinMark';
import { DataBadge } from '../components/DataBadge';
import { Sparkline } from '../components/Sparkline';
import { PriceChange } from '../components/PriceChange';
import { Skeleton, SkeletonGrid, ErrorState } from '../components/States';
import { PerformancePanel } from '../components/PerformancePanel';
import { ArticleCard } from '../components/ArticleCard';
import { NewsExplorer } from '../components/NewsExplorer';

const OVERVIEW_SYMBOLS = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'USDT'];
const FEATURED_IDS = ['bitcoin', 'ethereum', 'solana', 'chainlink'];

const ADVANTAGES = [
  {
    title: 'Advanced market intelligence',
    body: 'Aggregated pricing, depth and range analytics across digital and traditional markets, refreshed continuously.',
    icon: LineChart,
  },
  {
    title: 'Reliable financial information',
    body: 'Every price surface states its source and timestamp. When a feed degrades we say so instead of guessing.',
    icon: ShieldCheck,
  },
  {
    title: 'Professional analytics',
    body: 'Candlestick and performance views built for allocation decisions, not for noise.',
    icon: Layers3,
  },
  {
    title: 'Global market coverage',
    body: 'Equities, commodities, foreign exchange and digital assets held in one consistent framework.',
    icon: Globe2,
  },
  {
    title: 'Modern technology',
    body: 'A fast, accessible interface that renders cleanly from a phone in transit to a four-screen desk.',
    icon: Sparkles,
  },
  {
    title: 'User-focused experience',
    body: 'Watchlists, portfolio tracking and preferences that persist with your account, not your browser.',
    icon: UserRound,
  },
];

export default function Home() {
  const markets = useApi<MarketsResponse>('/markets/cryptos', { refreshMs: 60_000 });
  const globals = useApi<GlobalsResponse>('/markets/globals', { refreshMs: 60_000 });
  const insights = useApi<{ articles: Article[] }>('/content/insights');

  const assets = markets.data?.assets || [];
  const btc = assets.find((asset) => asset.id === 'bitcoin');
  const overview = OVERVIEW_SYMBOLS.map((symbol) => assets.find((asset) => asset.symbol === symbol)).filter(
    (asset): asset is Asset => Boolean(asset),
  );
  const featured = FEATURED_IDS.map((id) => assets.find((asset) => asset.id === id)).filter(
    (asset): asset is Asset => Boolean(asset),
  );
  const equityIndices = (globals.data?.indices || []).filter((row: IndexRow) => row.group === 'Equities').slice(0, 3);
  const realAssets = (globals.data?.indices || []).filter((row: IndexRow) => row.group !== 'Equities').slice(0, 3);

  return (
    <>
      {/* ------------------------------------------------------------- hero -- */}
      <section className="hero">
        <div className="hero__bg" aria-hidden />
        <div className="hero__veil" aria-hidden />
        <div className="hero__grid" aria-hidden />

        <div className="container hero__inner">
          <div className="hero__copy">
            <div className="row row--wrap rise" style={{ animationDelay: '60ms' }}>
              <span className="pill-panel">
                <span className="dot" style={{ color: 'var(--gold-300)' }} aria-hidden />
                Global market intelligence
              </span>
              <DataBadge
                source={markets.data?.source}
                provider={markets.data?.provider}
                updatedAt={markets.data?.updatedAt}
              />
            </div>

            <h1 className="hero__title rise" style={{ animationDelay: '120ms' }}>
              Navigate the Future of <em>Global Finance</em>
            </h1>

            <p className="hero__sub rise" style={{ animationDelay: '200ms' }}>
              Discover global financial markets, explore cryptocurrency opportunities, and make smarter
              investment decisions with advanced market intelligence.
            </p>

            <div className="hero__actions rise" style={{ animationDelay: '280ms' }}>
              <Link to="/markets" className="btn btn--gold btn--lg">
                Explore Markets <ArrowRight size={16} className="btn__icon" />
              </Link>
              <a href="#live-markets" className="btn btn--ghost btn--lg">
                Discover More
              </a>
            </div>

            <div className="hero__meta rise" style={{ animationDelay: '360ms' }}>
              <span>
                <BadgeCheck size={15} /> Source-labelled pricing
              </span>
              <span>
                <Globe2 size={15} /> Crypto, indices, FX and commodities
              </span>
              <span>
                <ShieldCheck size={15} /> Private portfolio workspace
              </span>
            </div>
          </div>

          <div className="hero__visual">
            <div className="quote-card">
              <div className="quote-card__top">
                <div className="quote-card__asset">
                  <CoinMark symbol={btc?.symbol || 'BTC'} color={btc?.color || '#f7931a'} size="lg" />
                  <div className="stack stack-4">
                    <strong style={{ fontSize: '0.95rem' }}>{btc?.name || 'Bitcoin'}</strong>
                    <span className="asset-cell__ticker">BTC / USD</span>
                  </div>
                </div>
                <DataBadge source={markets.data?.source} compact />
              </div>

              <div className="stack stack-8">
                <span className="quote-card__price">
                  {btc ? formatCurrency(btc.price) : <Skeleton className="skeleton--text" style={{ width: 190, height: 40 }} />}
                </span>
                {btc ? <PriceChange value={btc.change24h} suffix="24h" /> : null}
              </div>

              <div className="quote-card__chart">
                {btc ? (
                  <Sparkline data={btc.sparkline} positive={btc.change7d >= 0} strokeWidth={2} />
                ) : (
                  <Skeleton className="skeleton--block" style={{ height: '100%' }} />
                )}
              </div>

              <div className="quote-card__foot">
                <div>
                  <label>Market cap</label>
                  <strong>{btc ? formatCompact(btc.marketCap, 'USD') : '—'}</strong>
                </div>
                <div>
                  <label>24h volume</label>
                  <strong>{btc ? formatCompact(btc.volume24h, 'USD') : '—'}</strong>
                </div>
                <div>
                  <label>7d change</label>
                  <strong className={pctClass(btc?.change7d || 0)}>{btc ? formatPct(btc.change7d) : '—'}</strong>
                </div>
              </div>
            </div>

            <div className="hero__float">
              <span className="coin-mark coin-mark--sm" style={{ '--coin-color': '#627eea' } as React.CSSProperties} aria-hidden>
                E
              </span>
              <div>
                <div className="hero__float-title">Ethereum</div>
                <div className="hero__float-value">
                  {assets.find((a) => a.id === 'ethereum')
                    ? formatCurrency(assets.find((a) => a.id === 'ethereum')!.price)
                    : '—'}
                </div>
              </div>
              <PriceChange value={assets.find((a) => a.id === 'ethereum')?.change24h ?? 0} />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- ticker -- */}
      <div className="ticker" aria-label="Live market ticker">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <div className="row" style={{ gap: 0 }} key={copy} aria-hidden={copy === 1}>
              {assets.map((asset) => (
                <div className="ticker__item" key={`${copy}-${asset.id}`}>
                  <span className="ticker__symbol">{asset.symbol}</span>
                  <span className="ticker__price mono">{formatCurrency(asset.price)}</span>
                  <span className={pctClass(asset.change24h)} style={{ fontSize: '0.74rem' }}>
                    {formatPct(asset.change24h)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------- market overview -- */}
      <section className="section" id="live-markets">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Live market overview</span>
              <h2 className="h2">
                The market, at a <span className="serif-italic gold-text">glance</span>
              </h2>
              <p className="lede">
                Major digital assets with price, momentum and 7-day trend. Every figure is timestamped and labelled
                with its source.
              </p>
            </div>
            <Link to="/markets" className="btn btn--ghost">
              All markets <ArrowUpRight size={15} className="btn__icon" />
            </Link>
          </div>

          <div className="data-strip">
            <div className="data-strip__items">
              <span>
                Global market cap{' '}
                <b>{globals.data ? formatCompact(globals.data.crypto.marketCap, 'USD') : '—'}</b>
              </span>
              <span>
                24h volume <b>{globals.data ? formatCompact(globals.data.crypto.volume24h, 'USD') : '—'}</b>
              </span>
              <span>
                BTC dominance <b>{globals.data ? `${globals.data.crypto.btcDominance.toFixed(1)}%` : '—'}</b>
              </span>
              <span>
                24h market move{' '}
                <b className={pctClass(globals.data?.crypto.marketCapChange24h || 0)}>
                  {globals.data ? formatPct(globals.data.crypto.marketCapChange24h) : '—'}
                </b>
              </span>
            </div>
            <DataBadge source={markets.data?.source} provider={markets.data?.provider} updatedAt={markets.data?.updatedAt} />
          </div>

          {markets.error ? (
            <ErrorState message={markets.error} onRetry={markets.reload} title="Market feed unavailable" />
          ) : markets.loading && assets.length === 0 ? (
            <SkeletonGrid count={6} columns={3} />
          ) : (
            <div className="market-grid">
              {overview.map((asset) => (
                <Link to={`/markets/${asset.id}`} className="market-card" key={asset.id}>
                  <div className="market-card__top">
                    <div className="row" style={{ gap: 10 }}>
                      <CoinMark symbol={asset.symbol} color={asset.color} />
                      <div className="stack stack-4">
                        <strong style={{ fontSize: '0.9rem' }}>{asset.name}</strong>
                        <span className="asset-cell__ticker">
                          {asset.symbol} · #{asset.rank}
                        </span>
                      </div>
                    </div>
                    <PriceChange value={asset.change24h} />
                  </div>

                  <div className="market-card__price">
                    <strong>{formatCurrency(asset.price)}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>
                      vol {formatCompact(asset.volume24h, 'USD')}
                    </span>
                  </div>

                  <div className="market-card__spark">
                    <Sparkline data={asset.sparkline} positive={asset.change7d >= 0} />
                  </div>

                  <div className="market-card__foot">
                    <span>
                      Cap <b>{formatCompact(asset.marketCap, 'USD')}</b>
                    </span>
                    <span>
                      7d <b className={pctClass(asset.change7d)}>{formatPct(asset.change7d)}</b>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------- global financial -- */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Global financial markets</span>
              <h2 className="h2">The wider picture</h2>
              <p className="lede">
                Equity indices, metals and energy alongside digital assets — the context that moves risk appetite.
              </p>
            </div>
            <Link to="/global-markets" className="btn btn--ghost">
              Global markets <ArrowUpRight size={15} className="btn__icon" />
            </Link>
          </div>

          <div className="grid grid--3">
            {[...equityIndices, ...realAssets].map((row) => (
              <div className="index-card" key={row.id}>
                <div className="index-card__head">
                  <div>
                    <div className="index-card__name">{row.name}</div>
                    <div className="index-card__region">
                      {row.group} · {row.region}
                    </div>
                  </div>
                  <PriceChange value={row.change} />
                </div>
                <div className="index-card__value">{row.value.toLocaleString('en-US')}</div>
                <div className="index-card__spark">
                  <Sparkline data={row.spark} positive={row.change >= 0} strokeWidth={1.4} />
                </div>
              </div>
            ))}
          </div>

          <p className="muted" style={{ fontSize: '0.76rem', marginTop: 16, maxWidth: '78ch' }}>
            Global indices, commodities and FX are shown as an illustrative reference snapshot. No live
            institutional feed is connected for these instruments in this deployment.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ performance charts -- */}
      <section className="section" id="performance">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Market performance</span>
              <h2 className="h2">
                Analytics that respect <span className="serif-italic gold-text">the range</span>
              </h2>
              <p className="lede">
                Switch instruments, intervals and chart style. Volume, high and low are derived from the same series.
              </p>
            </div>
            <Link to="/analytics" className="btn btn--ghost">
              Full analytics <ArrowUpRight size={15} className="btn__icon" />
            </Link>
          </div>

          {markets.loading && assets.length === 0 ? (
            <Skeleton className="skeleton--block" style={{ height: 420 }} />
          ) : (
            <PerformancePanel assets={assets} initialId="bitcoin" />
          )}
        </div>
      </section>

      {/* ------------------------------------------------- featured crypto -- */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Featured cryptocurrencies</span>
              <h2 className="h2">The assets that set the tone</h2>
            </div>
            <Link to="/markets" className="btn btn--ghost">
              Open markets <ArrowUpRight size={15} className="btn__icon" />
            </Link>
          </div>

          <div className="grid grid--4">
            {featured.map((asset) => (
              <article className="crypto-card" key={asset.id}>
                <div className="crypto-card__head">
                  <CoinMark symbol={asset.symbol} color={asset.color} />
                  <div className="grow">
                    <div className="crypto-card__name">{asset.name}</div>
                    <div className="crypto-card__ticker">{asset.symbol}</div>
                  </div>
                  <PriceChange value={asset.change24h} showIcon={false} />
                </div>

                <div className="crypto-card__price">
                  <strong>{formatCurrency(asset.price)}</strong>
                  <span className={pctClass(asset.change7d)} style={{ fontSize: '0.78rem' }}>
                    {formatPct(asset.change7d)} 7d
                  </span>
                </div>

                <div className="crypto-card__chart">
                  <Sparkline data={asset.sparkline} positive={asset.change7d >= 0} />
                </div>

                <div className="crypto-card__stats">
                  <div className="crypto-card__stat">
                    <label>Market cap</label>
                    <b>{formatCompact(asset.marketCap, 'USD')}</b>
                  </div>
                  <div className="crypto-card__stat">
                    <label>24h vol</label>
                    <b>{formatCompact(asset.volume24h, 'USD')}</b>
                  </div>
                  <div className="crypto-card__stat">
                    <label>30d</label>
                    <b className={pctClass(asset.change30d)}>{formatPct(asset.change30d)}</b>
                  </div>
                </div>

                <Link to={`/markets/${asset.id}`} className="btn btn--ghost btn--sm btn--block">
                  View details <ArrowRight size={14} className="btn__icon" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ insights -- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Market insights &amp; analysis</span>
              <h2 className="h2">Research from the desk</h2>
              <p className="lede">
                Technical, fundamental and macro commentary written by analysts who publish their reasoning, not
                just their conclusions.
              </p>
            </div>
            <Link to="/insights" className="btn btn--ghost">
              All insights <ArrowUpRight size={15} className="btn__icon" />
            </Link>
          </div>

          <div className="insight-strip">
            {(insights.data?.articles || []).slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} section="insights" />
            ))}
            {insights.loading && !insights.data
              ? Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="skeleton--block" style={{ height: 320 }} />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- news -- */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Financial news</span>
              <h2 className="h2">What moved markets today</h2>
              <p className="lede">
                Filter by category or search the archive. Every story is editorial content from the Aurum desk.
              </p>
            </div>
          </div>
          <NewsExplorer variant="grid" limit={3} />
        </div>
      </section>

      {/* ----------------------------------------------------- why choose -- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Why Aurum</span>
              <h2 className="h2">Built for conviction, not clicks</h2>
              <p className="lede">
                A platform designed around how professional allocators actually read a market.
              </p>
            </div>
          </div>

          <div className="why-grid">
            {ADVANTAGES.map((item) => {
              const Icon = item.icon;
              return (
                <div className="why-item" key={item.title}>
                  <span className="why-item__icon">
                    <Icon size={19} />
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- CTA -- */}
      <section className="section section--tight">
        <div className="container">
          <div className="cta-band">
            <div className="cta-band__rings" aria-hidden />
            <span className="eyebrow">Begin</span>
            <h2 className="h2">
              Your Gateway to Global Financial <span className="serif-italic gold-text">Intelligence</span>
            </h2>
            <p className="lede" style={{ maxWidth: '52ch' }}>
              Create a free account to build watchlists, track a portfolio and follow the research that matters to
              your allocation.
            </p>
            <div className="row row--wrap" style={{ justifyContent: 'center' }}>
              <Link to="/register" className="btn btn--gold btn--lg">
                Start Exploring <ArrowRight size={16} className="btn__icon" />
              </Link>
              <Link to="/markets" className="btn btn--ghost btn--lg">
                Browse markets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
