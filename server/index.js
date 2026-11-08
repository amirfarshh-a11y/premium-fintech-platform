import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, initDb } from './db.js';
import { getMarkets, getGlobals, getHistory, getCandles, coinProfile, rangeToDays } from './market.js';
import { COIN_BY_SYMBOL } from './catalog.js';
import { listNews, listInsights, findArticle, NEWS_CATEGORIES, INSIGHT_TYPES } from './content.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const SECRET = process.env.JWT_SECRET || 'aurum-development-only-secret';
const COOKIE = 'aurum_session';
const isProd = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ---------------------------------------------------------------- auth ---- */

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function publicUser(row, prefs) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    country: row.country,
    baseCurrency: row.base_currency,
    bio: row.bio,
    createdAt: row.created_at,
    preferences: prefs
      ? {
          currency: prefs.currency,
          theme: prefs.theme,
          priceAlerts: prefs.price_alerts,
          weeklyDigest: prefs.weekly_digest,
          riskProfile: prefs.risk_profile,
        }
      : null,
  };
}

function setSession(res, userId) {
  const token = jwt.sign({ sub: userId }, SECRET, { expiresIn: '7d' });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

function currentUser(req) {
  const token = req.cookies?.[COOKIE] || (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET).sub;
  } catch {
    return null;
  }
}

const requireAuth = (req, res, next) => {
  const userId = currentUser(req);
  if (!userId) return res.status(401).json({ error: 'Please sign in to continue.' });
  req.userId = userId;
  next();
};

app.post('/api/auth/register', wrap(async (req, res) => {
  const fullName = String(req.body?.fullName || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (fullName.length < 2) return res.status(400).json({ error: 'Please enter your full name.' });
  if (!emailRe.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rowCount > 0) return res.status(409).json({ error: 'An account with that email already exists.' });

  const hash = await bcrypt.hash(password, 10);
  const inserted = await pool.query(
    `INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3)
     RETURNING id, email, full_name, country, base_currency, bio, created_at`,
    [email, hash, fullName],
  );
  const user = inserted.rows[0];
  const prefs = await pool.query(
    'INSERT INTO preferences (user_id) VALUES ($1) RETURNING *',
    [user.id],
  );
  setSession(res, user.id);
  res.status(201).json({ user: publicUser(user, prefs.rows[0]) });
}));

app.post('/api/auth/login', wrap(async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const found = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = found.rows[0];
  const ok = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!ok) return res.status(401).json({ error: 'Those credentials do not match our records.' });

  const prefs = await pool.query('SELECT * FROM preferences WHERE user_id = $1', [user.id]);
  setSession(res, user.id);
  res.json({ user: publicUser(user, prefs.rows[0]) });
}));

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE, { path: '/' });
  res.json({ ok: true });
});

app.get('/api/auth/me', wrap(async (req, res) => {
  const userId = currentUser(req);
  if (!userId) return res.status(401).json({ error: 'Not signed in.' });
  const found = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (found.rowCount === 0) {
    res.clearCookie(COOKIE, { path: '/' });
    return res.status(401).json({ error: 'Not signed in.' });
  }
  const prefs = await pool.query('SELECT * FROM preferences WHERE user_id = $1', [userId]);
  res.json({ user: publicUser(found.rows[0], prefs.rows[0]) });
}));

app.patch('/api/me', requireAuth, wrap(async (req, res) => {
  const fullName = String(req.body?.fullName ?? '').trim();
  const country = String(req.body?.country ?? '').trim();
  const bio = String(req.body?.bio ?? '').trim();
  const baseCurrency = String(req.body?.baseCurrency ?? 'USD').trim().toUpperCase();

  if (fullName.length < 2) return res.status(400).json({ error: 'Please enter your full name.' });
  if (!/^[A-Z]{3}$/.test(baseCurrency)) return res.status(400).json({ error: 'Base currency must be a 3-letter code.' });
  if (bio.length > 400) return res.status(400).json({ error: 'Bio must be under 400 characters.' });

  const updated = await pool.query(
    `UPDATE users SET full_name = $1, country = $2, bio = $3, base_currency = $4 WHERE id = $5
     RETURNING id, email, full_name, country, base_currency, bio, created_at`,
    [fullName, country, bio, baseCurrency, req.userId],
  );
  const prefs = await pool.query('SELECT * FROM preferences WHERE user_id = $1', [req.userId]);
  res.json({ user: publicUser(updated.rows[0], prefs.rows[0]) });
}));

app.patch('/api/me/password', requireAuth, wrap(async (req, res) => {
  const current = String(req.body?.currentPassword || '');
  const next = String(req.body?.newPassword || '');
  if (next.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters.' });

  const found = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.userId]);
  const matches = await bcrypt.compare(current, found.rows[0].password_hash);
  if (!matches) return res.status(400).json({ error: 'Your current password is incorrect.' });

  const hash = await bcrypt.hash(next, 10);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.userId]);
  res.json({ ok: true });
}));

app.put('/api/me/preferences', requireAuth, wrap(async (req, res) => {
  const currency = String(req.body?.currency || 'USD').toUpperCase();
  const theme = String(req.body?.theme || 'midnight');
  const riskProfile = String(req.body?.riskProfile || 'balanced');
  if (!/^[A-Z]{3}$/.test(currency)) return res.status(400).json({ error: 'Currency must be a 3-letter code.' });
  if (!['midnight', 'navy', 'graphite'].includes(theme)) return res.status(400).json({ error: 'Unknown theme.' });
  if (!['conservative', 'balanced', 'growth'].includes(riskProfile)) return res.status(400).json({ error: 'Unknown risk profile.' });

  const updated = await pool.query(
    `UPDATE preferences SET currency = $1, theme = $2, price_alerts = $3, weekly_digest = $4,
       risk_profile = $5, updated_at = now()
     WHERE user_id = $6 RETURNING *`,
    [currency, theme, Boolean(req.body?.priceAlerts), Boolean(req.body?.weeklyDigest), riskProfile, req.userId],
  );
  res.json({ preferences: updated.rows[0] });
}));

/* ------------------------------------------------------------ watchlist ---- */

app.get('/api/me/watchlist', requireAuth, wrap(async (req, res) => {
  const rows = await pool.query(
    'SELECT symbol, created_at FROM watchlist WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId],
  );
  res.json({ symbols: rows.rows.map((r) => r.symbol) });
}));

app.post('/api/me/watchlist', requireAuth, wrap(async (req, res) => {
  const symbol = String(req.body?.symbol || '').toUpperCase();
  if (!COIN_BY_SYMBOL.has(symbol)) return res.status(400).json({ error: 'Unknown asset.' });
  await pool.query(
    'INSERT INTO watchlist (user_id, symbol) VALUES ($1, $2) ON CONFLICT (user_id, symbol) DO NOTHING',
    [req.userId, symbol],
  );
  const rows = await pool.query(
    'SELECT symbol FROM watchlist WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId],
  );
  res.json({ symbols: rows.rows.map((r) => r.symbol) });
}));

app.delete('/api/me/watchlist/:symbol', requireAuth, wrap(async (req, res) => {
  await pool.query('DELETE FROM watchlist WHERE user_id = $1 AND symbol = $2', [
    req.userId,
    req.params.symbol.toUpperCase(),
  ]);
  const rows = await pool.query(
    'SELECT symbol FROM watchlist WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId],
  );
  res.json({ symbols: rows.rows.map((r) => r.symbol) });
}));

/* ------------------------------------------------------------- portfolio ---- */

app.get('/api/me/portfolio', requireAuth, wrap(async (req, res) => {
  const rows = await pool.query(
    `SELECT id, symbol, quantity::float8 AS quantity, avg_cost::float8 AS "avgCost",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM holdings WHERE user_id = $1 ORDER BY created_at ASC`,
    [req.userId],
  );
  res.json({ holdings: rows.rows });
}));

app.post('/api/me/portfolio', requireAuth, wrap(async (req, res) => {
  const symbol = String(req.body?.symbol || '').toUpperCase();
  const quantity = Number(req.body?.quantity);
  const avgCost = Number(req.body?.avgCost);

  if (!COIN_BY_SYMBOL.has(symbol)) return res.status(400).json({ error: 'Unknown asset.' });
  if (!Number.isFinite(quantity) || quantity <= 0) return res.status(400).json({ error: 'Quantity must be greater than zero.' });
  if (!Number.isFinite(avgCost) || avgCost < 0) return res.status(400).json({ error: 'Average cost must be zero or greater.' });

  const existing = await pool.query(
    'SELECT id, quantity::float8 AS quantity, avg_cost::float8 AS avg_cost FROM holdings WHERE user_id = $1 AND symbol = $2',
    [req.userId, symbol],
  );

  if (existing.rowCount > 0) {
    const prev = existing.rows[0];
    const totalQty = prev.quantity + quantity;
    const blended = (prev.quantity * prev.avg_cost + quantity * avgCost) / totalQty;
    await pool.query(
      'UPDATE holdings SET quantity = $1, avg_cost = $2, updated_at = now() WHERE id = $3',
      [totalQty, blended, prev.id],
    );
  } else {
    await pool.query(
      'INSERT INTO holdings (user_id, symbol, quantity, avg_cost) VALUES ($1, $2, $3, $4)',
      [req.userId, symbol, quantity, avgCost],
    );
  }

  const rows = await pool.query(
    `SELECT id, symbol, quantity::float8 AS quantity, avg_cost::float8 AS "avgCost",
            created_at AS "createdAt", updated_at AS "updatedAt"
     FROM holdings WHERE user_id = $1 ORDER BY created_at ASC`,
    [req.userId],
  );
  res.status(201).json({ holdings: rows.rows });
}));

app.patch('/api/me/portfolio/:id', requireAuth, wrap(async (req, res) => {
  const quantity = Number(req.body?.quantity);
  const avgCost = Number(req.body?.avgCost);
  if (!Number.isFinite(quantity) || quantity <= 0) return res.status(400).json({ error: 'Quantity must be greater than zero.' });
  if (!Number.isFinite(avgCost) || avgCost < 0) return res.status(400).json({ error: 'Average cost must be zero or greater.' });

  const updated = await pool.query(
    `UPDATE holdings SET quantity = $1, avg_cost = $2, updated_at = now()
     WHERE id = $3 AND user_id = $4 RETURNING id`,
    [quantity, avgCost, req.params.id, req.userId],
  );
  if (updated.rowCount === 0) return res.status(404).json({ error: 'Holding not found.' });
  res.json({ ok: true });
}));

app.delete('/api/me/portfolio/:id', requireAuth, wrap(async (req, res) => {
  const removed = await pool.query('DELETE FROM holdings WHERE id = $1 AND user_id = $2 RETURNING id', [
    req.params.id,
    req.userId,
  ]);
  if (removed.rowCount === 0) return res.status(404).json({ error: 'Holding not found.' });
  res.json({ ok: true });
}));

/* ----------------------------------------------------------------- market ---- */

app.get('/api/markets/cryptos', wrap(async (_req, res) => {
  res.json(await getMarkets());
}));

app.get('/api/markets/globals', wrap(async (_req, res) => {
  res.json(await getGlobals());
}));

app.get('/api/markets/cryptos/:id', wrap(async (req, res) => {
  const profile = coinProfile(req.params.id);
  if (!profile) return res.status(404).json({ error: 'Unknown asset.' });
  const markets = await getMarkets();
  const asset = markets.assets.find((a) => a.id === profile.id);
  if (!asset) return res.status(404).json({ error: 'Unknown asset.' });
  res.json({ asset, profile, source: markets.source, provider: markets.provider, updatedAt: markets.updatedAt });
}));

app.get('/api/markets/cryptos/:id/history', wrap(async (req, res) => {
  const days = rangeToDays(req.query.range) || Math.min(Math.max(Number(req.query.days) || 7, 1), 365);
  const data = await getHistory(req.params.id, days);
  if (!data) return res.status(404).json({ error: 'Unknown asset.' });
  res.json({ ...data, days });
}));

app.get('/api/markets/cryptos/:id/candles', wrap(async (req, res) => {
  const days = rangeToDays(req.query.range) || Math.min(Math.max(Number(req.query.days) || 7, 1), 365);
  const data = await getCandles(req.params.id, days);
  if (!data) return res.status(404).json({ error: 'Unknown asset.' });
  res.json({ ...data, days });
}));

/* ---------------------------------------------------------------- content ---- */

app.get('/api/content/news', (req, res) => {
  res.json({
    articles: listNews({ category: req.query.category, q: req.query.q }),
    categories: NEWS_CATEGORIES,
  });
});

app.get('/api/content/news/:slug', (req, res) => {
  const article = findArticle(req.params.slug);
  if (!article) return res.status(404).json({ error: 'Article not found.' });
  res.json({ article });
});

app.get('/api/content/insights', (req, res) => {
  res.json({ articles: listInsights({ type: req.query.type }), types: INSIGHT_TYPES });
});

/* ---------------------------------------------------------------- contact ---- */

const contactHits = new Map();

app.post('/api/contact', wrap(async (req, res) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const recent = (contactHits.get(ip) || []).filter((t) => now - t < 60_000);
  if (recent.length >= 4) return res.status(429).json({ error: 'Too many messages. Please try again in a minute.' });
  contactHits.set(ip, [...recent, now]);

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const subject = String(req.body?.subject || '').trim();
  const message = String(req.body?.message || '').trim();

  if (name.length < 2) return res.status(400).json({ error: 'Please enter your name.' });
  if (!emailRe.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (subject.length < 3) return res.status(400).json({ error: 'Please add a subject.' });
  if (message.length < 20) return res.status(400).json({ error: 'Please add a little more detail (20 characters minimum).' });
  if (message.length > 4000) return res.status(400).json({ error: 'Message is too long.' });

  await pool.query(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
    [name, email, subject, message],
  );
  res.status(201).json({ ok: true, message: 'Thank you — our client team will respond within one business day.' });
}));

/* ------------------------------------------------------------------ misc ---- */

app.get('/api/health', wrap(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
}));

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

app.use((error, _req, res, _next) => {
  console.error('[api]', error);
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
});

initDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => console.log(`[api] listening on ${PORT}`));
  })
  .catch((error) => {
    console.error('[api] database initialisation failed', error);
    process.exit(1);
  });
