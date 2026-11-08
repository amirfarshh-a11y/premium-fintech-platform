import type { CSSProperties } from 'react';

type CoinMarkProps = {
  symbol: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function CoinMark({ symbol, color = '#d4af37', size = 'md' }: CoinMarkProps) {
  const className = `coin-mark${size === 'sm' ? ' coin-mark--sm' : size === 'lg' ? ' coin-mark--lg' : ''}`;
  return (
    <span
      className={className}
      style={{ '--coin-color': color } as CSSProperties}
      aria-hidden
      title={symbol}
    >
      {symbol.slice(0, 1)}
    </span>
  );
}
