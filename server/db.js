import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 8,
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL DEFAULT '',
      country TEXT NOT NULL DEFAULT '',
      base_currency TEXT NOT NULL DEFAULT 'USD',
      bio TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS preferences (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      currency TEXT NOT NULL DEFAULT 'USD',
      theme TEXT NOT NULL DEFAULT 'midnight',
      price_alerts BOOLEAN NOT NULL DEFAULT true,
      weekly_digest BOOLEAN NOT NULL DEFAULT true,
      risk_profile TEXT NOT NULL DEFAULT 'balanced',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS watchlist (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      symbol TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_id, symbol)
    );

    CREATE TABLE IF NOT EXISTS holdings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      symbol TEXT NOT NULL,
      quantity DOUBLE PRECISION NOT NULL CHECK (quantity > 0),
      avg_cost DOUBLE PRECISION NOT NULL CHECK (avg_cost >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS holdings_user_idx ON holdings(user_id);
    CREATE INDEX IF NOT EXISTS watchlist_user_idx ON watchlist(user_id);

    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}
