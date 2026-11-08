import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { formatPct, pctClass } from '../lib/format';

export function PriceChange({
  value,
  digits = 2,
  showIcon = true,
  suffix,
}: {
  value: number;
  digits?: number;
  showIcon?: boolean;
  suffix?: string;
}) {
  const flat = !Number.isFinite(value) || Math.abs(value) < 0.0001;
  const Icon = flat ? Minus : value > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={pctClass(value)}>
      {showIcon && <Icon size={14} aria-hidden />}
      {formatPct(value, digits)}
      {suffix ? <span className="muted" style={{ fontWeight: 500, marginLeft: 4 }}>{suffix}</span> : null}
    </span>
  );
}
