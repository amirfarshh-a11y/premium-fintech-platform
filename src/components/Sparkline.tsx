import { useId } from 'react';

type SparklineProps = {
  data: number[];
  positive?: boolean;
  height?: number;
  showArea?: boolean;
  strokeWidth?: number;
  className?: string;
};

/**
 * Lightweight inline price sparkline. Scaled to its container with a fixed
 * viewBox so dozens can render on one page without a charting instance each.
 */
export function Sparkline({
  data,
  positive,
  height,
  showArea = true,
  strokeWidth = 1.6,
  className,
}: SparklineProps) {
  const gradientId = useId().replace(/[:]/g, '');
  if (!data || data.length < 2) {
    return <div className="skeleton skeleton--text" style={{ height: height ?? 40 }} />;
  }

  const isUp = positive ?? data[data.length - 1] >= data[0];
  const color = isUp ? 'var(--pos)' : 'var(--neg)';
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const W = 100;
  const H = 32;
  const pad = 2;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * W;
    const y = H - pad - ((value - min) / span) * (H - pad * 2);
    return [x, y] as const;
  });

  const line = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
  const area = `${line} L${W} ${H} L0 ${H} Z`;

  return (
    <svg
      className={className ?? 'spark'}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={height ? { height } : undefined}
      role="img"
      aria-label={`Price trend, ${isUp ? 'up' : 'down'}`}
    >
      <defs>
        <linearGradient id={`sg-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.34" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showArea && <path d={area} fill={`url(#sg-${gradientId})`} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
