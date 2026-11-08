import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, LayoutDashboard, Settings as SettingsIcon, Star, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/watchlist', label: 'Watchlist', icon: Star },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export function DashShell({
  eyebrow,
  title,
  lede,
  actions,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <>
      <header className="page-head" style={{ paddingTop: 'clamp(112px, 13vh, 156px)' }}>
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner" style={{ maxWidth: 'none' }}>
          <div className="row row--between row--wrap" style={{ alignItems: 'flex-end', gap: 18 }}>
            <div className="stack stack-8" style={{ maxWidth: 720 }}>
              <span className="eyebrow">{eyebrow}</span>
              <h1 className="h1" style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)' }}>{title}</h1>
              {lede ? <p className="muted" style={{ fontSize: '0.92rem' }}>{lede}</p> : null}
            </div>
            {actions}
          </div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="dash-shell">
            <nav className="side-nav" aria-label="Account">
              {LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="side-nav__link"
                    data-active={pathname === link.to}
                  >
                    <Icon size={16} /> {link.label}
                  </Link>
                );
              })}
              <div className="divider" style={{ marginBlock: 8 }} />
              <div className="stack stack-4" style={{ padding: '4px 10px', fontSize: '0.74rem', color: 'var(--text-faint)' }}>
                <span>Signed in as</span>
                <span style={{ color: 'var(--text-soft)', wordBreak: 'break-all' }}>{user?.email}</span>
              </div>
            </nav>

            <div className="dash-main">{children}</div>
          </div>
        </div>
      </section>
    </>
  );
}
