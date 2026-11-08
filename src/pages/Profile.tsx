import { useEffect, useState } from 'react';
import { BadgeCheck, Mail, Save } from 'lucide-react';
import type { User } from '../lib/types';
import { api } from '../lib/api';
import { formatDate, initials } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DashShell } from '../components/DashShell';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AED'];

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ fullName: '', country: '', bio: '', baseCurrency: 'USD' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || '',
      country: user.country || '',
      bio: user.bio || '',
      baseCurrency: user.baseCurrency || 'USD',
    });
  }, [user]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.fullName.trim().length < 2) {
      toast.error('Please enter your full name.');
      return;
    }
    setSaving(true);
    try {
      const data = await api<{ user: User }>('/me', { method: 'PATCH', body: form });
      setUser(data.user);
      toast.success('Your profile has been updated.', 'Saved');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashShell
      eyebrow="Profile"
      title={
        <>
          Your <span className="serif-italic gold-text">identity</span> on Aurum
        </>
      }
      lede="Only your name and base currency appear anywhere in the product. Everything else is private to your account."
    >
      <div className="grid grid--2" style={{ alignItems: 'start' }}>
        <div className="card card--pad stack stack-16">
          <div className="row" style={{ gap: 14 }}>
            <span className="avatar avatar--lg">{initials(user?.fullName || user?.email || 'Aurum')}</span>
            <div className="stack stack-4">
              <strong style={{ fontSize: '1.02rem' }}>{user?.fullName || 'Your name'}</strong>
              <span className="row" style={{ gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Mail size={13} /> {user?.email}
              </span>
              <span className="badge badge--gold" style={{ width: 'fit-content' }}>
                <BadgeCheck size={12} /> Member since {user ? formatDate(user.createdAt) : '—'}
              </span>
            </div>
          </div>

          <div className="divider" />

          <form className="stack stack-16" onSubmit={save}>
            <div className="field">
              <label className="field__label" htmlFor="profile-name">Full name</label>
              <input
                id="profile-name"
                className="input"
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                autoComplete="name"
              />
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="field__label" htmlFor="profile-country">Country</label>
                <input
                  id="profile-country"
                  className="input"
                  value={form.country}
                  onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))}
                  placeholder="France"
                  autoComplete="country-name"
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="profile-currency">Base currency</label>
                <select
                  id="profile-currency"
                  className="select"
                  value={form.baseCurrency}
                  onChange={(event) => setForm((prev) => ({ ...prev, baseCurrency: event.target.value }))}
                >
                  {CURRENCIES.map((code) => (
                    <option key={code} value={code}>{code}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="profile-bio">Short bio</label>
              <textarea
                id="profile-bio"
                className="textarea"
                style={{ minHeight: 104 }}
                maxLength={400}
                value={form.bio}
                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
                placeholder="Optional — how you use Aurum, what markets you follow."
              />
              <span className="field__hint">{form.bio.length}/400 characters</span>
            </div>

            <button type="submit" className="btn btn--gold" style={{ width: 'fit-content' }} disabled={saving}>
              <Save size={15} /> {saving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>

        <aside className="stack stack-16">
          <div className="card card--pad stack stack-12">
            <span className="panel-label">Account details</span>
            <div className="metric-list">
              <div className="metric-row">
                <span>Email</span>
                <b style={{ fontSize: '0.8rem' }}>{user?.email}</b>
              </div>
              <div className="metric-row">
                <span>Base currency</span>
                <b>{user?.baseCurrency}</b>
              </div>
              <div className="metric-row">
                <span>Country</span>
                <b>{user?.country || '—'}</b>
              </div>
              <div className="metric-row">
                <span>Risk profile</span>
                <b style={{ textTransform: 'capitalize' }}>{user?.preferences?.riskProfile || 'balanced'}</b>
              </div>
              <div className="metric-row">
                <span>Member since</span>
                <b>{user ? formatDate(user.createdAt) : '—'}</b>
              </div>
            </div>
          </div>

          <div className="side-card">
            <span className="side-card__title">Privacy</span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Your portfolio and watchlist are scoped to your account on the server. No other user can read them,
              and they are never included in aggregate statistics.
            </p>
          </div>
        </aside>
      </div>
    </DashShell>
  );
}
