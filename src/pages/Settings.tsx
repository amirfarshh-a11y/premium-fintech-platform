import { useEffect, useState } from 'react';
import { KeyRound, LogOut, Save, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DashShell } from '../components/DashShell';
import { useNavigate } from 'react-router-dom';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AED'];
const THEMES = [
  { value: 'midnight', label: 'Midnight navy' },
  { value: 'navy', label: 'Deep royal' },
  { value: 'graphite', label: 'Graphite' },
];
const RISK = [
  { value: 'conservative', label: 'Conservative' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'growth', label: 'Growth' },
];

export default function Settings() {
  const { user, refresh, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState({
    currency: 'USD',
    theme: 'midnight',
    riskProfile: 'balanced',
    priceAlerts: true,
    weeklyDigest: true,
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user?.preferences) return;
    setPrefs({
      currency: user.preferences.currency || user.baseCurrency || 'USD',
      theme: user.preferences.theme || 'midnight',
      riskProfile: user.preferences.riskProfile || 'balanced',
      priceAlerts: user.preferences.priceAlerts,
      weeklyDigest: user.preferences.weeklyDigest,
    });
  }, [user]);

  const savePrefs = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingPrefs(true);
    try {
      await api('/me/preferences', { method: 'PUT', body: prefs });
      await refresh();
      toast.success('Preferences saved to your account.', 'Saved');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSavingPrefs(false);
    }
  };

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (passwords.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await api('/me/password', {
        method: 'PATCH',
        body: { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword },
      });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Your password has been updated.', 'Saved');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSavingPassword(false);
    }
  };

  const signOut = async () => {
    await logout();
    toast.info('You have been signed out.', 'Session closed');
    navigate('/');
  };

  return (
    <DashShell
      eyebrow="Settings"
      title={
        <>
          How Aurum <span className="serif-italic gold-text">behaves</span> for you
        </>
      }
      lede="Preferences are stored with your account, so they follow you to any device you sign in from."
    >
      <div className="grid grid--2" style={{ alignItems: 'start' }}>
        <form className="card card--pad stack stack-16" onSubmit={savePrefs}>
          <div className="stack stack-4">
            <span className="panel-label">Display &amp; data</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Choose how values are quoted and how the interface is lit.
            </span>
          </div>

          <div className="form-grid">
            <div className="field">
              <label className="field__label" htmlFor="settings-currency">Preferred currency</label>
              <select
                id="settings-currency"
                className="select"
                value={prefs.currency}
                onChange={(event) => setPrefs((prev) => ({ ...prev, currency: event.target.value }))}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
              <span className="field__hint">Market prices are quoted in USD; this sets your portfolio display.</span>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="settings-theme">Interface theme</label>
              <select
                id="settings-theme"
                className="select"
                value={prefs.theme}
                onChange={(event) => setPrefs((prev) => ({ ...prev, theme: event.target.value }))}
              >
                {THEMES.map((theme) => (
                  <option key={theme.value} value={theme.value}>{theme.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="settings-risk">Risk profile</label>
            <select
              id="settings-risk"
              className="select"
              value={prefs.riskProfile}
              onChange={(event) => setPrefs((prev) => ({ ...prev, riskProfile: event.target.value }))}
            >
              {RISK.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
            <span className="field__hint">Used to tailor the language in analytics guidance. It never changes your data.</span>
          </div>

          <div>
            <div className="switch">
              <div className="switch__text">
                <span className="switch__title">Price alerts</span>
                <span className="switch__desc">Notify me about large moves in watchlisted assets.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs.priceAlerts}
                aria-label="Price alerts"
                className="switch__control"
                onClick={() => setPrefs((prev) => ({ ...prev, priceAlerts: !prev.priceAlerts }))}
              >
                <span className="switch__knob" />
              </button>
            </div>
            <div className="switch">
              <div className="switch__text">
                <span className="switch__title">Weekly research digest</span>
                <span className="switch__desc">A summary of market coverage and desk notes each Friday.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={prefs.weeklyDigest}
                aria-label="Weekly research digest"
                className="switch__control"
                onClick={() => setPrefs((prev) => ({ ...prev, weeklyDigest: !prev.weeklyDigest }))}
              >
                <span className="switch__knob" />
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--gold" style={{ width: 'fit-content' }} disabled={savingPrefs}>
            <Save size={15} /> {savingPrefs ? 'Saving…' : 'Save preferences'}
          </button>
        </form>

        <div className="stack stack-16">
          <form className="card card--pad stack stack-16" onSubmit={savePassword}>
            <div className="stack stack-4">
              <span className="panel-label">Security</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Changing your password ends other sessions the next time they refresh.
              </span>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="settings-current">Current password</label>
              <input
                id="settings-current"
                type="password"
                className="input"
                autoComplete="current-password"
                value={passwords.currentPassword}
                onChange={(event) => setPasswords((prev) => ({ ...prev, currentPassword: event.target.value }))}
              />
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="field__label" htmlFor="settings-new">New password</label>
                <input
                  id="settings-new"
                  type="password"
                  className="input"
                  autoComplete="new-password"
                  value={passwords.newPassword}
                  onChange={(event) => setPasswords((prev) => ({ ...prev, newPassword: event.target.value }))}
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="settings-confirm">Confirm</label>
                <input
                  id="settings-confirm"
                  type="password"
                  className="input"
                  autoComplete="new-password"
                  value={passwords.confirm}
                  onChange={(event) => setPasswords((prev) => ({ ...prev, confirm: event.target.value }))}
                />
              </div>
            </div>

            <button type="submit" className="btn btn--ghost" style={{ width: 'fit-content' }} disabled={savingPassword}>
              <KeyRound size={15} /> {savingPassword ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <div className="card card--pad stack stack-12">
            <div className="row" style={{ gap: 10 }}>
              <ShieldCheck size={17} style={{ color: 'var(--gold-300)' }} />
              <span className="panel-label">Session</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              You are signed in as <strong style={{ color: 'var(--text-soft)' }}>{user?.email}</strong>. Sessions
              use an http-only cookie and expire after seven days.
            </p>
            <button type="button" className="btn btn--danger btn--sm" style={{ width: 'fit-content' }} onClick={signOut}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </div>
    </DashShell>
  );
}
