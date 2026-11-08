import { Link } from 'react-router-dom';
import { ArrowUpRight, Star, Trash2 } from 'lucide-react';
import type { MarketsResponse } from '../lib/types';
import { useApi } from '../lib/hooks';
import { formatCompact, formatCurrency } from '../lib/format';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { DashShell } from '../components/DashShell';
import { CoinMark } from '../components/CoinMark';
import { PriceChange } from '../components/PriceChange';
import { Sparkline } from '../components/Sparkline';
import { DataBadge } from '../components/DataBadge';
import { EmptyState, ErrorState, Skeleton } from '../components/States';

export default function Watchlist() {
  const { symbols, loading, toggle } = useWatchlist();
  const markets = useApi<MarketsResponse>('/markets/cryptos', { refreshMs: 60_000 });
  const toast = useToast();

  const assets = markets.data?.assets || [];
  const tracked = assets.filter((asset) => symbols.includes(asset.symbol));
  const marketCap = tracked.reduce((sum, asset) => sum + asset.marketCap, 0);
  const advancing = tracked.filter((asset) => asset.change24h > 0).length;

  const remove = async (symbol: string) => {
    try {
      await toggle(symbol);
      toast.success(`${symbol} removed from your watchlist.`, 'Removed');
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <DashShell
      eyebrow="Watchlist"
      title={
        <>
          The assets you <span className="serif-italic gold-text">track</span>
        </>
      }
      lede="A shortlist that follows your account. Star or unstar any asset from the markets table."
      actions={
        <div className="row" style={{ gap: 8 }}>
          <DataBadge source={markets.data?.source} updatedAt={markets.data?.updatedAt} compact />
          <Link to="/markets" className="btn btn--gold btn--sm">
            Add assets <ArrowUpRight size={14} className="btn__icon" />
          </Link>
        </div>
      }
    >
      <div className="dash-cards">
        <div className="mini-stat">
          <label>Tracked assets</label>
          <b>{symbols.length}</b>
          <span>{symbols.length ? 'In your watchlist' : 'Nothing tracked yet'}</span>
        </div>
        <div className="mini-stat">
          <label>Combined market cap</label>
          <b>{tracked.length ? formatCompact(marketCap, 'USD') : '—'}</b>
          <span>Of tracked assets</span>
        </div>
        <div className="mini-stat">
          <label>Advancing today</label>
          <b>{tracked.length ? `${advancing} / ${tracked.length}` : '—'}</b>
          <span>Positive 24h change</span>
        </div>
        <div className="mini-stat">
          <label>Feed</label>
          <b style={{ fontSize: '1.1rem' }}>
            {markets.data?.source === 'live' ? 'Live' : markets.data?.source === 'demo' ? 'Demo' : '—'}
          </b>
          <span>{markets.data?.provider || 'Connecting…'}</span>
        </div>
      </div>

      {markets.error ? (
        <ErrorState message={markets.error} onRetry={markets.reload} title="Market feed unavailable" />
      ) : (loading || (markets.loading && assets.length === 0)) && tracked.length === 0 ? (
        <div className="grid grid--3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="skeleton--block" style={{ height: 240 }} />
          ))}
        </div>
      ) : tracked.length === 0 ? (
        <div className="card card--pad">
          <EmptyState
            icon={<Star size={20} />}
            title="Your watchlist is empty"
            body="Add the assets you follow. The star in the market table, or the watchlist button on any market page, adds them instantly."
            action={
              <Link to="/markets" className="btn btn--gold btn--sm">
                Browse markets
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid--3">
          {tracked.map((asset) => (
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
                  <label>7d</label>
                  <b>{asset.change7d > 0 ? '+' : ''}{asset.change7d.toFixed(2)}%</b>
                </div>
                <div className="crypto-card__stat">
                  <label>Rank</label>
                  <b>#{asset.rank}</b>
                </div>
              </div>

              <div className="row" style={{ gap: 8 }}>
                <Link to={`/markets/${asset.id}`} className="btn btn--ghost btn--sm grow">
                  View details <ArrowUpRight size={14} className="btn__icon" />
                </Link>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => remove(asset.symbol)}
                  aria-label={`Remove ${asset.symbol} from watchlist`}
                  title="Remove from watchlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashShell>
  );
}
