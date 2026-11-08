import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Candle, HistoryPoint, RangeKey } from '../lib/types';
import { formatCurrency, formatDate } from '../lib/format';

function axisTime(value: number, range: RangeKey) {
  const date = new Date(value);
  if (range === '1d') {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(date);
  }
  if (range === '1y') {
    return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  }
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
}

function ChartTooltip({ active, payload, range }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as HistoryPoint;
  return (
    <div className="tooltip-card">
      <strong>{formatCurrency(point.price)}</strong>
      <span>{range === '1d' ? axisTime(point.t, range) : formatDate(new Date(point.t).toISOString())}</span>
      {point.volume ? <span>Volume {formatCurrency(point.volume, 'USD', { compact: true })}</span> : null}
    </div>
  );
}

export function PriceAreaChart({
  points,
  range,
  positive,
  showAxis = true,
  showGrid = true,
}: {
  points: HistoryPoint[];
  range: RangeKey;
  positive: boolean;
  showAxis?: boolean;
  showGrid?: boolean;
}) {
  const color = positive ? 'var(--pos)' : 'var(--neg)';
  const gradientId = positive ? 'area-pos' : 'area-neg';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={points} margin={{ top: 10, right: showAxis ? 8 : 0, bottom: 0, left: showAxis ? 8 : 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="72%" stopColor={color} stopOpacity={0.06} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showGrid && <CartesianGrid stroke="rgba(176,187,214,0.07)" vertical={false} />}
        {showAxis && (
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => axisTime(value, range)}
            tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            minTickGap={44}
          />
        )}
        {showAxis && (
          <YAxis
            orientation="right"
            domain={['auto', 'auto']}
            tickFormatter={(value) => formatCurrency(Number(value), 'USD', { compact: true })}
            tick={{ fill: 'var(--text-faint)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={62}
          />
        )}
        <Tooltip content={<ChartTooltip range={range} />} cursor={{ stroke: 'rgba(212,175,55,0.35)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={1.9}
          fill={`url(#${gradientId})`}
          animationDuration={520}
          dot={false}
          activeDot={{ r: 3, fill: color, stroke: '#050a1c', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CandleChart({ candles }: { candles: Candle[] }) {
  if (!candles || candles.length === 0) return null;
  const W = 800;
  const H = 300;
  const padY = 12;

  const highs = candles.map((c) => c.h);
  const lows = candles.map((c) => c.l);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const span = max - min || 1;

  const slot = W / candles.length;
  const bodyW = Math.max(2, slot * 0.56);
  const y = (value: number) => H - padY - ((value - min) / span) * (H - padY * 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }} role="img" aria-label="Candlestick price chart">
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={0}
          x2={W}
          y1={padY + f * (H - padY * 2)}
          y2={padY + f * (H - padY * 2)}
          stroke="rgba(176,187,214,0.08)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {candles.map((c, index) => {
        const x = index * slot + slot / 2;
        const up = c.c >= c.o;
        const color = up ? 'var(--pos)' : 'var(--neg)';
        const top = y(Math.max(c.o, c.c));
        const bottom = y(Math.min(c.o, c.c));
        return (
          <g key={c.t}>
            <line
              x1={x}
              x2={x}
              y1={y(c.h)}
              y2={y(c.l)}
              stroke={color}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              opacity={0.85}
            />
            <rect
              x={x - bodyW / 2}
              y={top}
              width={bodyW}
              height={Math.max(1.2, bottom - top)}
              fill={color}
              opacity={up ? 0.9 : 0.82}
            />
          </g>
        );
      })}
    </svg>
  );
}
