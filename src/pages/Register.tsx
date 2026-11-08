import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, LineChart, ShieldCheck, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

type Errors = Partial<Record<'fullName' | 'email' | 'password' | 'confirm', string>>;

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const strength = (() => {
    const value = form.password;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
    return score;
  })();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Errors = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Use at least 8 characters.';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await register(form.fullName.trim(), form.email.trim(), form.password);
      toast.success('Your workspace is ready.', 'Account created');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error((error as Error).message || 'We could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <div className="auth-aside__img" aria-hidden />
        <span className="eyebrow">Create your account</span>
        <h2 className="h2" style={{ maxWidth: '20ch' }}>
          A workspace built around your <span className="serif-italic gold-text">positions</span>
        </h2>
        <p className="lede" style={{ maxWidth: '42ch' }}>
          Free to open. No card required. Your watchlist, portfolio and preferences follow your account.
        </p>
        <div className="stack stack-12">
          {[
            { icon: LineChart, text: 'Live prices and range analytics' },
            { icon: Wallet, text: 'Portfolio tracker with average cost' },
            { icon: ShieldCheck, text: 'Private data, scoped to your account' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <span key={item.text} className="row" style={{ gap: 10, color: 'var(--text-soft)', fontSize: '0.86rem' }}>
                <Icon size={16} style={{ color: 'var(--gold-300)' }} /> {item.text}
              </span>
            );
          })}
        </div>
      </aside>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <div className="auth-card__head">
            <span className="eyebrow">Sign up</span>
            <h1 className="h2" style={{ fontSize: 'clamp(1.9rem, 2.6vw, 2.4rem)' }}>
              Open your account
            </h1>
            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Takes less than a minute. You can change every detail later in Settings.
            </p>
          </div>

          <form className="stack stack-16" onSubmit={onSubmit} noValidate>
            <div className="field">
              <label className="field__label" htmlFor="reg-name">Full name</label>
              <input
                id="reg-name"
                className="input"
                autoComplete="name"
                value={form.fullName}
                onChange={(event) => update('fullName', event.target.value)}
                aria-invalid={Boolean(errors.fullName)}
                placeholder="Alex Moreau"
              />
              {errors.fullName && <span className="field__error">{errors.fullName}</span>}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                className="input"
                autoComplete="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                aria-invalid={Boolean(errors.email)}
                placeholder="you@company.com"
              />
              {errors.email && <span className="field__error">{errors.email}</span>}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                className="input"
                autoComplete="new-password"
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
                aria-invalid={Boolean(errors.password)}
                placeholder="At least 8 characters"
              />
              {errors.password ? (
                <span className="field__error">{errors.password}</span>
              ) : (
                <div className="row" style={{ gap: 6 }}>
                  {[0, 1, 2, 3].map((level) => (
                    <span
                      key={level}
                      style={{
                        height: 3,
                        flex: 1,
                        borderRadius: 999,
                        background:
                          form.password && strength > level
                            ? level < 2
                              ? 'var(--gold-400)'
                              : 'var(--pos)'
                            : 'rgba(176,187,214,0.16)',
                        transition: 'background .3s ease',
                      }}
                    />
                  ))}
                  <span className="field__hint" style={{ marginLeft: 6 }}>
                    {form.password ? (strength >= 3 ? 'Strong' : strength === 2 ? 'Fair' : 'Weak') : 'Strength'}
                  </span>
                </div>
              )}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="reg-confirm">Confirm password</label>
              <input
                id="reg-confirm"
                type="password"
                className="input"
                autoComplete="new-password"
                value={form.confirm}
                onChange={(event) => update('confirm', event.target.value)}
                aria-invalid={Boolean(errors.confirm)}
                placeholder="Repeat your password"
              />
              {errors.confirm ? (
                <span className="field__error">{errors.confirm}</span>
              ) : form.confirm && form.confirm === form.password ? (
                <span className="field__hint row" style={{ gap: 5, color: 'var(--pos)' }}>
                  <Check size={13} /> Passwords match
                </span>
              ) : null}
            </div>

            <button type="submit" className="btn btn--gold btn--block" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'} <ArrowRight size={15} className="btn__icon" />
            </button>
          </form>

          <p className="field__hint" style={{ textAlign: 'center' }}>
            By creating an account you agree to our{' '}
            <Link to="/terms" style={{ color: 'var(--gold-200)' }}>Terms</Link> and{' '}
            <Link to="/privacy" style={{ color: 'var(--gold-200)' }}>Privacy Policy</Link>.
          </p>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold-200)', fontWeight: 700 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
