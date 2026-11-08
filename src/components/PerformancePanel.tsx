import { useEffect, useMemo, useState } from 'react';
import { BarChart3, LineChart as LineIcon } from 'lucide-react';
import type { Asset, CandlesResponse, HistoryResponse, RangeKey } from '../lib/types';
import { useApi } from '../lib/hooks';
import { formatCompact, formatCurrency, formatPct, pctClass, RANGE_LABELS, formatDate } from '../lib/format';
import { CoinMark } from './CoinMark';
import { PriceChange } from './PriceChange';
import { CandleChart, PriceAreaChart } from './Charts';
import { DataBadge } from './DataBadge';
import { ErrorState, Skeleton } from './States';

const RANGES: RangeKey[] = ['1d', '7d', '30d', '1y'];

export function PerformancePanel({
  assets,
  initialId,
  compactHeader = false,
}: {
  assets: Asset[];
  initialId?: string;
  compactHeader?: boolean;
}) {
  const [assetId, setAssetId] = useState(initialId || assets[0]?.id || 'bitcoin');
  const [range, setRange] = useState<RangeKey>('7d');
  const [mode, setMode] = useState<'line' | 'candles'>('line');

  useEffect(() => {
    if (initialId) setAssetId(initialId);
  }, [initialId]);

  const asset = assets.find((item) => item.id === assetId) || assets[0];
  const history = useApi<HistoryResponse>(`/markets/cryptos/${assetId}/history?range=${range}`, {
    refreshMs: 120_000,
  });
  const candles = useApi<CandlesResponse>(
    mode === 'candles' ? `/markets/cryptos/${assetId}/candles?range=${range}` : null,
  );

  const stats = useMemo(() => {
    const points = history.data?.points || [];
    if (points.length < 2) return null;
    const first = points[0].price;
    const last = points[points.length - 1].price;
    const prices = points.map((p) => p.price);
    return {
      change: ((last - first) / first) * 100,
      high: Math.max(...prices),
      low: Math.min(...prices),
      volume: points.reduce((sum, p) => sum + (p.volume || 0), 0),
      last,
      first,
      source: history.data?.source || 'demo',
    };
  }, [history.data]);

  const positive = (stats?.change ?? asset?.change7d ?? 0) >= 0;

  if (!asset) return <Skeleton className="skeleton--block" style={{ height: 420 }} />;

  return (
    <div className="analytics">
      <div className="chart-panel">
        <div className="chart-panel__head">
          <div className="row" style={{ gap: 12 }}>
            <CoinMark symbol={asset.symbol} color={asset.color} />
            <div className="stack stack-4">
              <div className="row" style={{ gap: 8 }}>
                <strong style={{ fontSize: '0.98rem' }}>{asset.name}</strong>
                <span className="asset-cell__ticker">{asset.symbol}/USD</span>
              </div>
              <div className="row" style={{ gap: 10 }}>
                <span className="mono" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {formatCurrency(asset.price)}
                </span>
                <PriceChange value={asset.change24h} />
              </div>
            </div>
          </div>

          <div className="row row--wrap" style={{ gap: 10 }}>
            <div className="seg" role="group" aria-label="Chart type">
              <button type="button" aria-pressed={mode === 'line'} onClick={() => setMode('line')} title="Line chart">
                <LineIcon size={13} />
              </button>
              <button
                type="button"
                aria-pressed={mode === 'candles'}
                onClick={() => setMode('candles')}
                title="Candlestick chart"
              >
                <BarChart3 size={13} />
              </button>
            </div>
            <div className="seg" role="group" aria-label="Time range">
              {RANGES.map((key) => (
                <button key={key} type="button" aria-pressed={range === key} onClick={() => setRange(key)}>
                  {RANGE_LABELS[key]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-panel__body">
          {history.error ? (
            <ErrorState message={history.error} onRetry={history.reload} />
          ) : mode === 'candles' ? (
            candles.loading && !candles.data ? (
              <Skeleton className="skeleton--block" style={{ height: '100%' }} />
            ) : candles.error ? (
              <ErrorState message={candles.error} onRetry={candles.reload} />
            ) : candles.data ? (
              <CandleChart candles={candles.data.candles} />
            ) : null
          ) : history.loading && !history.data ? (
            <Skeleton className="skeleton--block" style={{ height: '100%' }} />
          ) : history.data ? (
            <PriceAreaChart points={history.data.points} range={range} positive={positive} />
          ) : null}
        </div>

        <div className="chart-panel__foot">
          <DataBadge
            source={mode === 'candles' ? candles.data?.source : history.data?.source}
            provider={history.data?.source === 'live' ? 'CoinGecko' : undefined}
            compact
          />
          {stats ? (
            <>
              <span>
                {RANGE_LABELS[range]} range{' '}
                <b className={pctClass(stats.change)}>{formatPct(stats.change)}</b>
              </span>
              <span>
                High <b className="mono" style={{ color: 'var(--text-soft)' }}>{formatCurrency(stats.high)}</b>
              </span>
              <span>
                Low <b className="mono" style={{ color: 'var(--text-soft)' }}>{formatCurrency(stats.low)}</b>
              </span>
              <span style={{ marginLeft: 'auto' }}>
                {mode === 'candles' ? 'Candles' : 'Prices'} in USD ·{' '}
                {history.data?.updatedAt ? formatDate(history.data.updatedAt) : '—'}
              </span>
            </>
          ) : (
            <span className="muted">Loading range analytics…</span>
          )}
        </div>
      </div>

      <aside className="card card--pad stack stack-16">
        {!compactHeader && (
          <div className="stack stack-4">
            <span className="panel-label">Instrument</span>
            <select
              className="select"
              value={assetId}
              onChange={(event) => setAssetId(event.target.value)}
              aria-label="Select asset for the performance chart"
            >
              {assets.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.symbol}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="metric-list">
          <div className="metric-row">
            <span>Market capitalisation</span>
            <b>{formatCompact(asset.marketCap, 'USD')}</b>
          </div>
          <div className="metric-row">
            <span>Volume (24h)</span>
            <b>{formatCompact(asset.volume24h, 'USD')}</b>
          </div>
          <div className="metric-row">
            <span>24h change</span>
            <b className={pctClass(asset.change24h)}>{formatPct(asset.change24h)}</b>
          </div>
          <div className="metric-row">
            <span>7d change</span>
            <b className={pctClass(asset.change7d)}>{formatPct(asset.change7d)}</b>
          </div>
          <div className="metric-row">
            <span>30d change</span>
            <b className={pctClass(asset.change30d)}>{formatPct(asset.change30d)}</b>
          </div>
          <div className="metric-row">
            <span>Market cap rank</span>
            <b>#{asset.rank ?? '—'}</b>
          </div>
          <div className="metric-row">
            <span>{RANGE_LABELS[range]} volume traded</span>
            <b>{stats ? formatCompact(stats.volume, 'USD') : '—'}</b>
          </div>
        </div>

        <p style={{ fontSize: '0.74rem', color: 'var(--text-faint)', lineHeight: 1.6 }}>
          Charts render the market feed captured at the timestamp shown. Ranges use hourly to daily resolution
          depending on the selected period.
        </p>
      </aside>
    </div>
  );
}
