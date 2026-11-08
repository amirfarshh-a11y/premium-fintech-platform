import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (password.length < 1) next.password = 'Enter your password.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back.', 'Signed in');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error((error as Error).message || 'We could not sign you in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <div className="auth-aside__img" aria-hidden />
        <span className="eyebrow">Client access</span>
        <h2 className="h2" style={{ maxWidth: '18ch' }}>
          Return to your <span className="serif-italic gold-text">market</span>
        </h2>
        <p className="lede" style={{ maxWidth: '42ch' }}>
          Your watchlist, portfolio and preferences are waiting — synced to your account, not your browser.
        </p>
        <div className="stack stack-12" style={{ marginTop: 8 }}>
          <span className="row" style={{ gap: 10, color: 'var(--text-soft)', fontSize: '0.86rem' }}>
            <BarChart3 size={16} style={{ color: 'var(--gold-300)' }} /> Live pricing across 12 tracked assets
          </span>
          <span className="row" style={{ gap: 10, color: 'var(--text-soft)', fontSize: '0.86rem' }}>
            <ShieldCheck size={16} style={{ color: 'var(--gold-300)' }} /> Private by default — your positions stay yours
          </span>
          <span className="row" style={{ gap: 10, color: 'var(--text-soft)', fontSize: '0.86rem' }}>
            <Lock size={16} style={{ color: 'var(--gold-300)' }} /> Sessions secured with an encrypted cookie
          </span>
        </div>
      </aside>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <div className="auth-card__head">
            <span className="eyebrow">Sign in</span>
            <h1 className="h2" style={{ fontSize: 'clamp(1.9rem, 2.6vw, 2.4rem)' }}>
              Welcome back
            </h1>
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Sign in to reach your dashboard, portfolio and watchlist.
            </p>
          </div>

          <form className="stack stack-16" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label className="field__label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="input"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                aria-invalid={Boolean(errors.email)}
                placeholder="you@company.com"
              />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="input"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                aria-invalid={Boolean(errors.password)}
                placeholder="Your password"
              />
              {errors.password && <span className="field__error">{errors.password}</span>}
            </div>

            <button type="submit" className="btn btn--gold btn--block" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'} <ArrowRight size={15} className="btn__icon" />
            </button>
          </form>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            New to Aurum?{' '}
            <Link to="/register" style={{ color: 'var(--gold-200)', fontWeight: 700 }}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
