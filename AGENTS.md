# Aurum — project notes for agents

## Stack
- `src/` — React 18 + TypeScript + Vite SPA (React Router, Recharts, lucide-react).
- `server/` — Express API on port 4000, ESM, PostgreSQL via `pg`.
- `docker-compose.base44.yml` — dev stack: `db` (Postgres 16), `api`, `web` (Vite on host port 3000).

## How it runs
- Vite dev server proxies `/api` to `http://api:4000` (single origin), so the session
  cookie is same-origin and `credentials` work without CORS.
- The API creates its schema idempotently on boot (`server/db.js`, `initDb()`), so no
  separate migration service is needed. Data lives in the `db-data` volume.
- `node_modules` live in named volumes; both services run `npm install` before starting.
  If you change a manifest, restart that service (it re-installs) — never delete the DB volume.
- `JWT_SECRET` is required at boot. A development placeholder sits in
  `.env.base44-defaults`; the platform-delivered secret in `/run/base44/app.env` wins.

## Market data
- Live crypto data comes from the public CoinGecko API (`server/market.js`), cached in
  memory (60s markets, 2–10min history). `COINGECKO_API_KEY` is optional.
- If the feed is unreachable, the API returns the demo dataset with `source: "demo"`.
  The UI must always show that badge — never present demo values as live prices.
- Global indices/commodities/FX have no key-free institutional feed. They are served as
  `indicesSource: "reference"` and labelled "Reference snapshot" in the UI.

## Verify
- `docker compose -f docker-compose.base44.yml ps` — all healthy.
- `curl -s localhost:3000/api/health` → `{"status":"ok"}` (proxied through Vite).
- Typecheck inside the web container: `docker compose -f docker-compose.base44.yml exec web npx tsc --noEmit`.
- Auth is cookie-based; a browser that is not signed in sees signed-out states on
  `/dashboard`, `/portfolio`, `/watchlist`, `/profile`, `/settings`.
