import { Link } from 'react-router-dom';

type LogoProps = { to?: string; compact?: boolean };

export function Logo({ to = '/', compact = false }: LogoProps) {
  return (
    <Link to={to} className="logo" aria-label="Aurum — global market intelligence, go to homepage">
      <span className="logo__mark" aria-hidden>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="logo-gold" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5E6CC" />
              <stop offset="0.5" stopColor="#E6C667" />
              <stop offset="1" stopColor="#B8912C" />
            </linearGradient>
          </defs>
          <path
            d="M12 3 21 18.5h-4.2L12 10.2 7.2 18.5H3L12 3Z"
            stroke="url(#logo-gold)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M9.2 15.1h5.6" stroke="url(#logo-gold)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="21" r="1.4" fill="url(#logo-gold)" />
        </svg>
      </span>
      {!compact && (
        <span className="logo__word">
          <span className="logo__name">Aurum</span>
          <span className="logo__tag">Global Markets</span>
        </span>
      )}
    </Link>
  );
}
