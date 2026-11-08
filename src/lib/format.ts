const LOCALE = 'en-US';

export function formatCurrency(value: number, currency = 'USD', options: { compact?: boolean } = {}) {
  if (!Number.isFinite(value)) return '—';
  const abs = Math.abs(value);
  if (options.compact) return formatCompact(value, currency);
  const digits = abs >= 1000 ? 2 : abs >= 1 ? 2 : abs >= 0.01 ? 4 : 6;
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
    notation: 'standard',
  }).format(value);
}

export function formatCompact(value: number, currency?: string) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(LOCALE, {
    style: currency ? 'currency' : 'decimal',
    currency: currency || undefined,
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPct(value: number, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

export function pctClass(value: number) {
  if (!Number.isFinite(value) || Math.abs(value) < 0.0001) return 'pct pct--flat';
  return value > 0 ? 'pct pct--pos' : 'pct pct--neg';
}

export function formatDate(iso: string, style: 'short' | 'long' = 'short') {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  }).format(date);
}

export function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' }).format(date);
}

export function timeAgo(iso: string) {
  const date = new Date(iso).getTime();
  if (Number.isNaN(date)) return '—';
  const seconds = Math.max(1, Math.round((Date.now() - date) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return formatDate(iso);
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'AU';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export const RANGE_LABELS: Record<string, string> = {
  '1d': '24H',
  '7d': '7D',
  '30d': '30D',
  '1y': '1Y',
};
