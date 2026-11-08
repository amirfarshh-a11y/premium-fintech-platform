import {
  COINS,
  COIN_BY_ID,
  demoMarkets,
  demoHistory,
  demoCandles,
  REFERENCE_INDICES,
} from './catalog.js';

const BASE = 'https://api.coingecko.com/api/v3';
const cache = new Map();
const inflight = new Map();

async function cached(key, ttlMs, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value;
  // Share one upstream request per key so concurrent page loads do not each
  // spend one of the provider's rate-limit credits.
  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    try {
      const value = await loader();
      cache.set(key, { at: Date.now(), value });
      return value;
    } catch (error) {
      if (hit) {
        console.warn(`[market] serving cached ${key}:`, error.message);
        return { ...hit.value, stale: true };
      }
      throw error;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}

async function cg(path, attempt = 0) {
  const headers = { accept: 'application/json' };
  if (process.env.COINGECKO_API_KEY) headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  const res = await fetch(BASE + path, { signal: AbortSignal.timeout(7000), headers });
  if (res.status === 429 && attempt < 2) {
    await new Promise((resolve) => setTimeout(resolve, 900 * (attempt + 1)));
    return cg(path, attempt + 1);
  }
  if (!res.ok) throw new Error(`CoinGecko ${res.status} for ${path}`);
  return res.json();
}

const downsample = (arr, size) => {
  if (!Array.isArray(arr) || arr.length <= size) return arr || [];
  const step = arr.length / size;
  return Array.from({ length: size }, (_, i) => arr[Math.floor(i * step)]);
};

const num = (value, fallback = 0) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);

function shapeMarket(row, coin) {
  return {
    id: row.id,
    symbol: (row.symbol || coin?.symbol || '').toUpperCase(),
    name: row.name || coin?.name || row.id,
    rank: row.market_cap_rank ?? coin?.rank ?? null,
    color: coin?.color || '#d4af37',
    price: num(row.current_price),
    change24h: num(row.price_change_percentage_24h),
    change7d: num(row.price_change_percentage_7d_in_currency),
    change30d: num(row.price_change_percentage_30d_in_currency),
    marketCap: num(row.market_cap),
    volume24h: num(row.total_volume),
    sparkline: downsample(row.sparkline_in_7d?.price, 48),
    updatedAt: row.last_updated || new Date().toISOString(),
  };
}

export async function getMarkets() {
  try {
    const ids = COINS.map((c) => c.id).join(',');
    const rows = await cached('markets', 60_000, () =>
      cg(`/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h,7d,30d`),
    );
    if (!Array.isArray(rows) || rows.length === 0) throw new Error('empty market response');
    return {
      source: 'live',
      provider: 'CoinGecko',
      updatedAt: new Date().toISOString(),
      assets: rows.map((row) => shapeMarket(row, COIN_BY_ID.get(row.id))),
    };
  } catch (error) {
    console.warn('[market] live feed unavailable:', error.message);
    return {
      source: 'demo',
      provider: 'Demo dataset',
      updatedAt: new Date().toISOString(),
      assets: demoMarkets(),
    };
  }
}

export async function getGlobals() {
  const [markets, global] = await Promise.all([
    getMarkets(),
    cached('global', 120_000, () => cg('/global')).catch(() => null),
  ]);
  const fallbackCap = markets.assets.reduce((sum, a) => sum + a.marketCap, 0);

  return {
    crypto: {
      marketCap: num(global?.data?.total_market_cap?.usd, fallbackCap),
      volume24h: num(global?.data?.total_volume?.usd, markets.assets.reduce((s, a) => s + a.volume24h, 0)),
      btcDominance: num(global?.data?.market_cap_percentage?.btc, 52.4),
      ethDominance: num(global?.data?.market_cap_percentage?.eth, 17.8),
      activeAssets: num(global?.data?.active_cryptocurrencies, 14200),
      marketCapChange24h: num(global?.data?.market_cap_change_percentage_24h_usd, 1.2),
    },
    indices: REFERENCE_INDICES,
    indicesSource: 'reference',
    source: markets.source,
    provider: markets.provider,
    updatedAt: markets.updatedAt,
  };
}

const RANGE_DAYS = { '1d': 1, '7d': 7, '30d': 30, '1y': 365 };

export function rangeToDays(range) {
  return RANGE_DAYS[range] || 7;
}

export async function getHistory(id, days) {
  const coin = COIN_BY_ID.get(id);
  if (!coin) return null;
  try {
    const raw = await cached(`history:${id}:${days}`, days > 30 ? 600_000 : 120_000, () =>
      cg(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`),
    );
    const prices = raw.prices || [];
    if (prices.length === 0) throw new Error('empty history');
    const volumes = raw.total_volumes || [];
    return {
      source: 'live',
      provider: 'CoinGecko',
      updatedAt: new Date().toISOString(),
      points: prices.map(([t, price], i) => ({
        t,
        price,
        volume: volumes[Math.min(i, volumes.length - 1)]?.[1] ?? 0,
      })),
    };
  } catch (error) {
    console.warn(`[market] history fallback for ${id}:`, error.message);
    return {
      source: 'demo',
      provider: 'Demo dataset',
      updatedAt: new Date().toISOString(),
      points: demoHistory(coin, days),
    };
  }
}

export async function getCandles(id, days) {
  const coin = COIN_BY_ID.get(id);
  if (!coin) return null;
  const supported = [1, 7, 14, 30, 90, 180, 365].includes(days) ? days : 7;
  try {
    const raw = await cached(`ohlc:${id}:${supported}`, 300_000, () =>
      cg(`/coins/${id}/ohlc?vs_currency=usd&days=${supported}`),
    );
    if (!Array.isArray(raw) || raw.length === 0) throw new Error('empty ohlc');
    return {
      source: 'live',
      updatedAt: new Date().toISOString(),
      candles: raw.map(([t, o, h, l, c]) => ({ t, o, h, l, c })),
    };
  } catch (error) {
    console.warn(`[market] ohlc fallback for ${id}:`, error.message);
    return {
      source: 'demo',
      updatedAt: new Date().toISOString(),
      candles: demoCandles(coin, supported),
    };
  }
}

export function coinProfile(id) {
  const coin = COIN_BY_ID.get(id);
  if (!coin) return null;
  return { ...coin };
}
