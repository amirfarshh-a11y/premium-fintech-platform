import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RotateCcw } from 'lucide-react';

export function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} aria-hidden />;
}

export function CardSkeleton() {
  return (
    <div className="card card--pad">
      <div className="stack stack-12">
        <div className="row row--between">
          <Skeleton className="skeleton--title" style={{ width: '46%' }} />
          <Skeleton className="skeleton--text" style={{ width: '18%' }} />
        </div>
        <Skeleton className="skeleton--text" style={{ width: '64%', height: 26 }} />
        <Skeleton className="skeleton--block" style={{ height: 52 }} />
        <div className="row row--between">
          <Skeleton className="skeleton--text" style={{ width: '30%' }} />
          <Skeleton className="skeleton--text" style={{ width: '24%' }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, columns = 3 }: { count?: number; columns?: number }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  icon,
  action,
}: {
  title: string;
  body: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="state">
      <span className="state__icon">{icon || <Inbox size={20} />}</span>
      <p className="state__title">{title}</p>
      <p className="state__body">{body}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'We could not load this data',
  message,
  onRetry,
}: {
  title?: string;
  message?: string | null;
  onRetry?: () => void;
}) {
  return (
    <div className="state state--error">
      <span className="state__icon">
        <AlertTriangle size={20} />
      </span>
      <p className="state__title">{title}</p>
      <p className="state__body">{message || 'The market feed did not respond. Please try again.'}</p>
      {onRetry && (
        <button type="button" className="btn btn--ghost btn--sm" onClick={onRetry}>
          <RotateCcw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
