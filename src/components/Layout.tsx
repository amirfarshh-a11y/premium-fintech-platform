import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '../context/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: 160, paddingBottom: 120 }}>
        <div className="stack stack-16">
          <div className="skeleton skeleton--title" style={{ width: 260 }} />
          <div className="skeleton skeleton--block" style={{ height: 220 }} />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
