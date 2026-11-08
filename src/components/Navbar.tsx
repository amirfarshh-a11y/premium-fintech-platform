import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, LogOut, Menu, UserRound, X } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useScrolled } from '../lib/hooks';
import { NAV_ITEMS } from '../lib/navigation';
import { initials } from '../lib/format';

function isActive(pathname: string, to: string) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Navbar() {
  const scrolled = useScrolled(20);
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const toast = useToast();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleLogout = async () => {
    await logout();
    toast.info('You have been signed out.', 'Session closed');
  };

  return (
    <>
      <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
        <div className="container nav__inner">
          <Logo />

          <nav className="nav__links" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <div className="nav__item" key={item.label}>
                <NavLink
                  to={item.to}
                  className="nav__link"
                  data-active={isActive(location.pathname, item.to)}
                  aria-haspopup={item.children ? 'true' : undefined}
                >
                  {item.label}
                  {item.children ? <ChevronDown size={13} className="nav__chev" aria-hidden /> : null}
                </NavLink>
                {item.children ? (
                  <div className="nav__menu" role="menu">
                    {item.children.map((child) => (
                      <Link key={child.to + child.label} to={child.to} className="nav__menu-link" role="menuitem">
                        <strong>{child.label}</strong>
                        <span>{child.desc}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="nav__actions">
            {loading ? (
              <div className="skeleton skeleton--text" style={{ width: 120, height: 34, borderRadius: 999 }} />
            ) : user ? (
              <div className="nav__auth">
                <Link to="/dashboard" className="btn btn--ghost btn--sm" title="Open your dashboard">
                  <span className="avatar" style={{ width: 22, height: 22, fontSize: 10 }}>
                    {initials(user.fullName || user.email)}
                  </span>
                  <span className="nav__user-name">{user.fullName.split(' ')[0] || 'Account'}</span>
                </Link>
                <button type="button" className="btn btn--quiet btn--sm" onClick={handleLogout} aria-label="Sign out">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="nav__auth">
                <Link to="/login" className="btn btn--quiet btn--sm">
                  <UserRound size={15} /> Login
                </Link>
                <Link to="/register" className="btn btn--gold btn--sm">
                  Sign up
                </Link>
              </div>
            )}
            <button
              type="button"
              className="icon-btn nav__burger"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={19} />
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="mobile-nav__head">
            <Logo />
            <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={19} />
            </button>
          </div>
          <nav className="mobile-nav__list" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <NavLink
                  to={item.to}
                  className="mobile-nav__link"
                  data-active={isActive(location.pathname, item.to)}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span aria-hidden style={{ color: 'var(--text-faint)' }}>→</span>
                </NavLink>
                {item.children?.map((child) => (
                  <Link
                    key={child.to + child.label}
                    to={child.to}
                    className="mobile-nav__link"
                    style={{ paddingLeft: 16, fontSize: '0.9rem', color: 'var(--text-muted)', borderBottom: 'none' }}
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="mobile-nav__footer">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn--gold btn--block" onClick={() => setOpen(false)}>
                  Go to dashboard
                </Link>
                <button
                  type="button"
                  className="btn btn--ghost btn--block"
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                >
                  <LogOut size={15} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn--gold btn--block" onClick={() => setOpen(false)}>
                  Create your account
                </Link>
                <Link to="/login" className="btn btn--ghost btn--block" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
