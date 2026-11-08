import { Clock3, Database } from 'lucide-react';
import type { MarketSource } from '../lib/types';
import { timeAgo } from '../lib/format';

type DataBadgeProps = {
  source: MarketSource | undefined;
  provider?: string;
  updatedAt?: string;
  compact?: boolean;
};

/**
 * Every price surface carries this badge. Demo values are never presented as
 * live market data.
 */
export function DataBadge({ source, provider, updatedAt, compact = false }: DataBadgeProps) {
  if (source === 'live') {
    return (
      <span className="badge badge--live" title={`Live prices from ${provider || 'market feed'}`}>
        <span className="dot" aria-hidden />
        Live{!compact && provider ? ` · ${provider}` : ''}
        {updatedAt ? (
          <span className="muted" style={{ textTransform: 'none', letterSpacing: 0, marginLeft: 2 }}>
            · {timeAgo(updatedAt)}
          </span>
        ) : null}
      </span>
    );
  }
  if (source === 'demo') {
    return (
      <span className="badge badge--demo" title="The live market feed is unavailable. These are sample values for demonstration only.">
        <Database size={12} aria-hidden />
        Demo data
      </span>
    );
  }
  return (
    <span className="badge" title="Loading market data">
      <Clock3 size={12} aria-hidden />
      {compact ? 'Loading' : 'Connecting to market feed'}
    </span>
  );
}
