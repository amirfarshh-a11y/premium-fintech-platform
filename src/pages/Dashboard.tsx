import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import type { Asset, Holding, MarketsResponse } from '../lib/types';
import { useApi } from '../lib/hooks';
import { formatCompact, formatCurrency, formatPct, pctClass } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { DashShell } from '../components/DashShell';
import { DataBadge } from '../components/DataBadge';
import { CoinMark } from '../components/CoinMark';
import { PriceChange } from '../components/PriceChange';
import { Sparkline } from '../components/Sparkline';
import { EmptyState, ErrorState, Skeleton } from '../components/States';
import { ArticleCard } from '../components/ArticleCard';
import type { Article } from '../lib/types';

function valueHoldings(holdings: Holding[], assets: Asset[]) {
  return holdings.map((holding) => {
    const asset = assets.find((item) => item.symbol === holding.symbol);
    const price = asset?.price ?? 0;
    const value = price * holding.quantity;
    const cost = holding.avgCost * holding.quantity;
    return {
      ...holding,
      asset,
      price,
      value,
      cost,
      pnl: value - cost,
      pnlPct: cost > 0 ? ((value - cost) / cost) * 100 : 0,
    };
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const { symbols } = useWatchlist();
  const markets = useApi<MarketsResponse>('/markets/cryptos', { refreshMs: 60_000 });
  const portfolio = useApi<{ holdings: Holding[] }>('/me/portfolio');
  const insights = useApi<{ articles: Article[] }>('/content/insights');

  const assets = markets.data?.assets || [];
  const rows = valueHoldings(portfolio.data?.holdings || [], assets);
  const totalValue = rows.reduce((sum, row) => sum + row.value, 0);
  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
  const pnl = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  const dayPnl = rows.reduce((sum, row) => sum + (row.value * (row.asset?.change24h || 0)) / 100, 0);

  const watched = assets.filter((asset) => symbols.includes(asset.symbol));
  const movers = [...assets].sort((a, b) => b.change24h - a.change24h).slice(0, 3);
  const laggards = [...assets].sort((a, b) => a.change24h - b.change24h).slice(0, 3);
  const firstName = (user?.fullName || 'there').split(' ')[0];

  return (
    <DashShell
      eyebrow="Your dashboard"
      title={
        <>
          Good to see you, <span className="serif-italic gold-text">{firstName}</span>
        </>
      }
      lede="A consolidated view of your positions, watchlist and the market backdrop."
      actions={
        <div className="row" style={{ gap: 8 }}>
          <Link to="/portfolio" className="btn btn--gold btn--sm">
            <Plus size={14} /> Add holding
          </Link>
          <Link to="/markets" className="btn btn--ghost btn--sm">
            Markets <ArrowUpRight size={14} className="btn__icon" />
          </Link>
        </div>
      }
    >
      <div className="dash-cards">
        <div className="mini-stat">
          <label>Portfolio value</label>
          <b>{formatCurrency(totalValue, user?.baseCurrency || 'USD')}</b>
          <span>
            {rows.length} {rows.length === 1 ? 'position' : 'positions'}
          </span>
        </div>
        <div className="mini-stat">
          <label>Unrealised P&amp;L</label>
          <b className={pctClass(pnl)}>{formatCurrency(pnl, user?.baseCurrency || 'USD')}</b>
          <span className={pctClass(pnlPct)}>{formatPct(pnlPct)} against cost</span>
        </div>
        <div className="mini-stat">
          <label>Today</label>
          <b className={pctClass(dayPnl)}>{formatCurrency(dayPnl, user?.baseCurrency || 'USD')}</b>
          <span>Based on 24h asset moves</span>
        </div>
        <div className="mini-stat">
          <label>Watchlist</label>
          <b>{symbols.length}</b>
          <span>{symbols.length ? 'Tracked assets' : 'Add your first asset'}</span>
        </div>
      </div>

      <div className="grid grid--2" style={{ alignItems: 'start' }}>
        <div className="card card--pad stack stack-16">
          <div className="row row--between">
            <span className="panel-label">Largest positions</span>
            <Link to="/portfolio" className="article-card__link" style={{ fontSize: '0.76rem' }}>
              Portfolio <ArrowRight size={13} />
            </Link>
          </div>

          {portfolio.error ? (
            <ErrorState message={portfolio.error} onRetry={portfolio.reload} />
          ) : portfolio.loading && !portfolio.data ? (
            <div className="stack stack-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="skeleton--text" style={{ height: 40 }} />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              title="No positions yet"
              body="Add a holding to track value, average cost and unrealised P&L against live prices."
              action={
                <Link to="/portfolio" className="btn btn--gold btn--sm">
                  <Plus size={14} /> Add your first holding
                </Link>
              }
            />
          ) : (
            <div className="stack stack-8">
              {rows
                .slice()
                .sort((a, b) => b.value - a.value)
                .slice(0, 4)
                .map((row) => (
                  <div className="row row--between" key={row.id} style={{ gap: 12 }}>
                    <div className="row" style={{ gap: 10 }}>
                      <CoinMark symbol={row.symbol} color={row.asset?.color} size="sm" />
                      <div className="stack stack-4">
                        <strong style={{ fontSize: '0.86rem' }}>{row.asset?.name || row.symbol}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>
                          {row.quantity} {row.symbol}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                        {formatCurrency(row.value, user?.baseCurrency || 'USD')}
                      </div>
                      <div className={pctClass(row.pnlPct)} style={{ fontSize: '0.74rem' }}>
                        {formatPct(row.pnlPct)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="card card--pad stack stack-16">
          <div className="row row--between">
            <span className="panel-label">Watchlist snapshot</span>
            <Link to="/watchlist" className="article-card__link" style={{ fontSize: '0.76rem' }}>
              Manage <ArrowRight size={13} />
            </Link>
          </div>

          {watched.length === 0 ? (
            <EmptyState
              title="Your watchlist is empty"
              body="Star an asset in the market table to keep it in view here."
              action={
                <Link to="/markets" className="btn btn--ghost btn--sm">
                  Browse markets
                </Link>
              }
            />
          ) : (
            <div className="stack stack-8">
              {watched.slice(0, 4).map((asset) => (
                <Link to={`/markets/${asset.id}`} className="row row--between" key={asset.id} style={{ gap: 12 }}>
                  <div className="row" style={{ gap: 10 }}>
                    <CoinMark symbol={asset.symbol} color={asset.color} size="sm" />
                    <div className="stack stack-4">
                      <strong style={{ fontSize: '0.86rem' }}>{asset.symbol}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)' }}>{asset.name}</span>
                    </div>
                  </div>
                  <div className="row" style={{ gap: 12 }}>
                    <div style={{ width: 64, height: 26 }}>
                      <Sparkline data={asset.sparkline} positive={asset.change24h >= 0} strokeWidth={1.3} />
                    </div>
                    <span className="mono" style={{ fontSize: '0.82rem' }}>{formatCurrency(asset.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid--2" style={{ alignItems: 'start' }}>
        <div className="card card--pad stack stack-12">
          <div className="row row--between">
            <span className="panel-label">Market leaders</span>
            <DataBadge source={markets.data?.source} updatedAt={markets.data?.updatedAt} compact />
          </div>
          {markets.error ? (
            <ErrorState message={markets.error} onRetry={markets.reload} />
          ) : (
            <>
              {movers.map((asset) => (
                <Link to={`/markets/${asset.id}`} className="row row--between" key={asset.id}>
                  <div className="row" style={{ gap: 10 }}>
                    <CoinMark symbol={asset.symbol} color={asset.color} size="sm" />
                    <strong style={{ fontSize: '0.84rem' }}>{asset.symbol}</strong>
                  </div>
                  <div className="row" style={{ gap: 14 }}>
                    <span className="mono" style={{ fontSize: '0.82rem' }}>{formatCurrency(asset.price)}</span>
                    <PriceChange value={asset.change24h} />
                  </div>
                </Link>
              ))}
              <div className="divider" />
              {laggards.map((asset) => (
                <Link to={`/markets/${asset.id}`} className="row row--between" key={asset.id}>
                  <div className="row" style={{ gap: 10 }}>
                    <CoinMark symbol={asset.symbol} color={asset.color} size="sm" />
                    <strong style={{ fontSize: '0.84rem' }}>{asset.symbol}</strong>
                  </div>
                  <div className="row" style={{ gap: 14 }}>
                    <span className="mono" style={{ fontSize: '0.82rem' }}>{formatCurrency(asset.price)}</span>
                    <PriceChange value={asset.change24h} />
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>

        <div className="card card--pad stack stack-12">
          <span className="panel-label">Aggregate market</span>
          <div className="metric-list">
            <div className="metric-row">
              <span>Tracked market cap</span>
              <b>{formatCompact(assets.reduce((sum, a) => sum + a.marketCap, 0), 'USD')}</b>
            </div>
            <div className="metric-row">
              <span>24h volume</span>
              <b>{formatCompact(assets.reduce((sum, a) => sum + a.volume24h, 0), 'USD')}</b>
            </div>
            <div className="metric-row">
              <span>Assets advancing</span>
              <b>{assets.filter((a) => a.change24h > 0).length} / {assets.length || '—'}</b>
            </div>
            <div className="metric-row">
              <span>Base currency</span>
              <b>{user?.baseCurrency || 'USD'}</b>
            </div>
          </div>
          <Link to="/analytics" className="btn btn--ghost btn--sm btn--block">
            Open analytics <ArrowRight size={14} className="btn__icon" />
          </Link>
        </div>
      </div>

      <div className="stack stack-12">
        <div className="row row--between">
          <span className="panel-label">Latest research</span>
          <Link to="/insights" className="article-card__link" style={{ fontSize: '0.76rem' }}>
            All insights <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid--3">
          {(insights.data?.articles || []).slice(0, 3).map((article) => (
            <ArticleCard key={article.slug} article={article} section="insights" compact />
          ))}
        </div>
      </div>
    </DashShell>
  );
}
