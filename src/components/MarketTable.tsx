import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import type { Asset } from '../lib/types';
import { formatCompact, formatCurrency, formatPct, pctClass } from '../lib/format';
import { CoinMark } from './CoinMark';
import { Sparkline } from './Sparkline';
import { WatchButton } from './WatchButton';

type SortKey = 'rank' | 'price' | 'change24h' | 'change7d' | 'change30d' | 'marketCap' | 'volume24h';

const COLUMNS: { key: SortKey; label: string; align?: 'left' }[] = [
  { key: 'rank', label: '#', align: 'left' },
  { key: 'price', label: 'Price' },
  { key: 'change24h', label: '24h' },
  { key: 'change7d', label: '7d' },
  { key: 'change30d', label: '30d' },
  { key: 'marketCap', label: 'Market cap' },
  { key: 'volume24h', label: 'Volume (24h)' },
];

export function MarketTable({ assets, caption }: { assets: Asset[]; caption?: string }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'rank', dir: 'asc' });

  const rows = useMemo(() => {
    const sorted = [...assets].sort((a, b) => {
      const av = Number(a[sort.key] ?? 0);
      const bv = Number(b[sort.key] ?? 0);
      return sort.dir === 'asc' ? av - bv : bv - av;
    });
    return sorted;
  }, [assets, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: key === 'rank' ? 'asc' : 'desc' },
    );
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        {caption ? <caption className="visually-hidden">{caption}</caption> : null}
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                style={column.align === 'left' ? { textAlign: 'left' } : undefined}
                aria-sort={sort.key === column.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                <button type="button" onClick={() => toggleSort(column.key)}>
                  {column.label}
                  {sort.key === column.key ? (
                    sort.dir === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                  ) : (
                    <ChevronsUpDown size={12} style={{ opacity: 0.4 }} />
                  )}
                </button>
              </th>
            ))}
            <th style={{ textAlign: 'right' }}>7d trend</th>
            <th style={{ textAlign: 'right' }} aria-label="Watchlist" />
          </tr>
        </thead>
        <tbody>
          {rows.map((asset) => (
            <tr key={asset.id}>
              <td style={{ textAlign: 'left', color: 'var(--text-faint)', width: 56 }}>{asset.rank}</td>
              <td style={{ textAlign: 'left' }}>
                <Link to={`/markets/${asset.id}`} className="asset-cell">
                  <CoinMark symbol={asset.symbol} color={asset.color} />
                  <span>
                    <span className="asset-cell__name">{asset.name}</span>{' '}
                    <span className="asset-cell__ticker">{asset.symbol}</span>
                  </span>
                </Link>
              </td>
              <td>
                <Link to={`/markets/${asset.id}`} style={{ fontWeight: 600 }}>
                  {formatCurrency(asset.price)}
                </Link>
              </td>
              <td className={pctClass(asset.change24h)}>{formatPct(asset.change24h)}</td>
              <td className={pctClass(asset.change7d)}>{formatPct(asset.change7d)}</td>
              <td className={pctClass(asset.change30d)}>{formatPct(asset.change30d)}</td>
              <td>{formatCompact(asset.marketCap, 'USD')}</td>
              <td>{formatCompact(asset.volume24h, 'USD')}</td>
              <td>
                <div style={{ width: 108, height: 34, marginLeft: 'auto' }}>
                  <Sparkline data={asset.sparkline} positive={asset.change7d >= 0} strokeWidth={1.4} />
                </div>
              </td>
              <td style={{ textAlign: 'right', width: 56 }}>
                <WatchButton symbol={asset.symbol} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
