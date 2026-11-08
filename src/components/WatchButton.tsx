import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';

export function WatchButton({
  symbol,
  label,
  size = 'sm',
}: {
  symbol: string;
  label?: string;
  size?: 'sm' | 'md';
}) {
  const { user } = useAuth();
  const { has, toggle } = useWatchlist();
  const toast = useToast();
  const navigate = useNavigate();
  const tracked = has(symbol);

  const onClick = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      toast.info('Sign in to build a watchlist.', 'Account required');
      navigate('/login', { state: { from: '/markets' } });
      return;
    }
    try {
      const added = await toggle(symbol);
      toast.success(
        added ? `${symbol} added to your watchlist.` : `${symbol} removed from your watchlist.`,
        added ? 'Added' : 'Removed',
      );
    } catch (error) {
      toast.error((error as Error).message || 'Could not update your watchlist.');
    }
  };

  const iconSize = size === 'md' ? 18 : 15;

  if (label) {
    return (
      <button
        type="button"
        className={`btn ${tracked ? 'btn--gold' : 'btn--ghost'} btn--sm`}
        onClick={onClick}
        aria-pressed={tracked}
      >
        <Star size={iconSize} fill={tracked ? 'currentColor' : 'none'} />
        {tracked ? 'In watchlist' : label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={onClick}
      aria-pressed={tracked}
      aria-label={tracked ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      title={tracked ? 'Remove from watchlist' : 'Add to watchlist'}
      style={tracked ? { color: 'var(--gold-200)', borderColor: 'var(--line-strong)' } : undefined}
    >
      <Star size={iconSize} fill={tracked ? 'currentColor' : 'none'} />
    </button>
  );
}
