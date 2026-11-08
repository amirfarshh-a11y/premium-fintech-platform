import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { Layout, RequireAuth } from './components/Layout';
import Home from './pages/Home';
import Markets from './pages/Markets';
import CryptoDetail from './pages/CryptoDetail';
import GlobalMarkets from './pages/GlobalMarkets';
import Analytics from './pages/Analytics';
import News from './pages/News';
import Insights from './pages/Insights';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Settings from './pages/Settings';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

/** Applies the signed-in user's interface theme without touching stored data. */
function ThemeSync() {
  const { user } = useAuth();
  const theme = user?.preferences?.theme;

  useEffect(() => {
    if (theme && theme !== 'midnight') {
      document.documentElement.dataset.theme = theme;
    } else {
      delete document.documentElement.dataset.theme;
    }
  }, [theme]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <WatchlistProvider>
            <ThemeSync />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/markets/:id" element={<CryptoDetail />} />
                <Route path="/global-markets" element={<GlobalMarkets />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:slug" element={<ArticleDetail />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/insights/:slug" element={<ArticleDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/portfolio"
                  element={
                    <RequireAuth>
                      <Portfolio />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/watchlist"
                  element={
                    <RequireAuth>
                      <Watchlist />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  }
                />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </WatchlistProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
