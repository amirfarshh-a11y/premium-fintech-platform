/**
 * Asset catalogue. `demo*` values are used only when no live market feed can be
 * reached, and every response carrying them is flagged `source: "demo"`.
 */
export const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', rank: 1, color: '#f7931a', demoPrice: 96420.35, demoChange24h: 1.84, demoChange7d: 4.12, demoChange30d: 9.61, demoMcap: 1_908_000_000_000, demoVol: 34_200_000_000, about: 'The original decentralised digital currency and the benchmark for the entire digital-asset market. Bitcoin settles value on a public ledger secured by proof-of-work mining and is increasingly treated as a macro-sensitive store of value.' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', rank: 2, color: '#627eea', demoPrice: 3284.72, demoChange24h: 2.61, demoChange7d: 6.08, demoChange30d: 12.4, demoMcap: 395_000_000_000, demoVol: 18_700_000_000, about: 'A programmable settlement layer for decentralised applications, tokenised assets and smart contracts. Ether is the native asset used to pay for computation and to secure the network through staking.' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', rank: 3, color: '#26a17b', demoPrice: 1.0, demoChange24h: 0.02, demoChange7d: -0.01, demoChange30d: 0.03, demoMcap: 138_000_000_000, demoVol: 62_800_000_000, about: 'The largest dollar-denominated stablecoin by circulating supply, used as the primary quote asset and settlement rail across centralised and decentralised crypto venues.' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', rank: 4, color: '#f3ba2f', demoPrice: 682.14, demoChange24h: 1.12, demoChange7d: -1.86, demoChange30d: 5.2, demoMcap: 99_400_000_000, demoVol: 1_920_000_000, about: 'The utility asset of the BNB Chain ecosystem, used for network fees, on-chain governance and as collateral across a broad set of decentralised applications.' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', rank: 5, color: '#14f195', demoPrice: 214.86, demoChange24h: 4.42, demoChange7d: 11.73, demoChange30d: 18.9, demoMcap: 101_200_000_000, demoVol: 4_410_000_000, about: 'A high-throughput smart-contract network built for low-latency trading, payments and consumer applications, with a fast-growing ecosystem of on-chain markets.' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', rank: 6, color: '#23292f', demoPrice: 2.31, demoChange24h: -1.35, demoChange7d: 3.4, demoChange30d: -2.1, demoMcap: 132_000_000_000, demoVol: 5_120_000_000, about: 'A settlement asset for cross-border payments on the XRP Ledger, designed for fast, low-cost value transfer between financial institutions and market makers.' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', rank: 7, color: '#2775ca', demoPrice: 1.0, demoChange24h: -0.01, demoChange7d: 0.02, demoChange30d: 0.0, demoMcap: 42_600_000_000, demoVol: 8_940_000_000, about: 'A regulated dollar stablecoin issued against cash and short-duration Treasuries, widely used as the collateral and settlement unit of on-chain finance.' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', rank: 8, color: '#0033ad', demoPrice: 0.964, demoChange24h: 0.62, demoChange7d: -2.44, demoChange30d: 7.31, demoMcap: 34_100_000_000, demoVol: 980_000_000, about: 'A research-driven proof-of-stake network focused on formal verification, on-chain governance and long-lived financial infrastructure.' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', rank: 9, color: '#c2a633', demoPrice: 0.382, demoChange24h: 3.18, demoChange7d: 8.02, demoChange30d: -4.6, demoMcap: 56_200_000_000, demoVol: 3_640_000_000, about: 'The most widely held memecoin by wallet count, with deep retail liquidity and a strong sensitivity to social sentiment and payments-adjacent news.' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', rank: 10, color: '#e84142', demoPrice: 41.28, demoChange24h: -0.74, demoChange7d: 2.19, demoChange30d: 11.2, demoMcap: 16_900_000_000, demoVol: 610_000_000, about: 'A subnet-based smart-contract platform used by institutions and gaming teams that need dedicated, configurable execution environments.' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', rank: 11, color: '#2a5ada', demoPrice: 24.86, demoChange24h: 1.94, demoChange7d: 5.66, demoChange30d: 14.8, demoMcap: 15_600_000_000, demoVol: 720_000_000, about: 'The dominant oracle network connecting smart contracts to market data, cross-chain messaging and external computation.' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', rank: 12, color: '#e6007a', demoPrice: 7.42, demoChange24h: -2.06, demoChange7d: -3.85, demoChange30d: 1.4, demoMcap: 11_200_000_000, demoVol: 340_000_000, about: 'A multichain protocol where parachains share security through a central relay chain, aimed at interoperable institutional infrastructure.' },
];

export const COIN_BY_ID = new Map(COINS.map((c) => [c.id, c]));
export const COIN_BY_SYMBOL = new Map(COINS.map((c) => [c.symbol, c]));

/** Deterministic pseudo-random walk so demo charts are stable between requests. */
export function seededSeries(seed, points, start, drift = 0.004, vol = 0.012) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const out = [];
  let value = start;
  for (let i = 0; i < points; i += 1) {
    value = Math.max(start * 0.55, value * (1 + drift + (rand() - 0.5) * vol));
    out.push(Number(value.toFixed(start < 5 ? 4 : 2)));
  }
  return out;
}

const hashSeed = (text) =>
  [...text].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 2147483647, 7);

export function demoMarkets() {
  const now = Date.now();
  return COINS.map((coin) => ({
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    rank: coin.rank,
    color: coin.color,
    price: coin.demoPrice,
    change24h: coin.demoChange24h,
    change7d: coin.demoChange7d,
    change30d: coin.demoChange30d,
    marketCap: coin.demoMcap,
    volume24h: coin.demoVol,
    sparkline: seededSeries(hashSeed(coin.id), 48, coin.demoPrice, coin.demoChange7d / 4800, 0.014),
    updatedAt: new Date(now).toISOString(),
  }));
}

export function demoHistory(coin, days) {
  const points = days <= 1 ? 96 : days <= 7 ? 168 : days <= 30 ? 180 : 240;
  const spanMs = days * 86_400_000;
  const series = seededSeries(hashSeed(coin.id + days), points, coin.demoPrice * (1 - coin.demoChange30d / 260), coin.demoChange30d / 24_000, 0.012);
  const now = Date.now();
  return series.map((price, i) => ({
    t: now - spanMs + (spanMs * i) / (points - 1),
    price,
    volume: Number((coin.demoVol / points) * (0.6 + ((i * 37) % 80) / 100)).toFixed(0),
  }));
}

export function demoCandles(coin, days) {
  const series = demoHistory(coin, days);
  const step = Math.max(1, Math.floor(series.length / 48));
  const candles = [];
  for (let i = 0; i < series.length; i += step) {
    const chunk = series.slice(i, i + step);
    if (chunk.length < 2) break;
    const prices = chunk.map((p) => p.price);
    candles.push({
      t: chunk[0].t,
      o: prices[0],
      c: prices[prices.length - 1],
      h: Math.max(...prices) * 1.002,
      l: Math.min(...prices) * 0.998,
    });
  }
  return candles;
}

/**
 * Global market reference snapshot. No stable, key-free institutional feed for
 * indices/commodities/FX is available to this deployment, so these are clearly
 * served as illustrative reference values and labelled as such in the UI.
 */
export const REFERENCE_INDICES = [
  { id: 'spx', name: 'S&P 500', symbol: 'SPX', group: 'Equities', region: 'United States', value: 6212.8, change: 0.42, unit: 'pts' },
  { id: 'ndx', name: 'NASDAQ Composite', symbol: 'IXIC', group: 'Equities', region: 'United States', value: 20412.55, change: 0.86, unit: 'pts' },
  { id: 'dji', name: 'Dow Jones', symbol: 'DJI', group: 'Equities', region: 'United States', value: 44910.12, change: -0.18, unit: 'pts' },
  { id: 'dax', name: 'DAX', symbol: 'DAX', group: 'Equities', region: 'Germany', value: 19842.6, change: 0.31, unit: 'pts' },
  { id: 'n225', name: 'Nikkei 225', symbol: 'N225', group: 'Equities', region: 'Japan', value: 39284.4, change: -0.64, unit: 'pts' },
  { id: 'xau', name: 'Gold Spot', symbol: 'XAU', group: 'Commodities', region: 'Global', value: 2684.4, change: 0.55, unit: 'USD/oz' },
  { id: 'xag', name: 'Silver Spot', symbol: 'XAG', group: 'Commodities', region: 'Global', value: 31.42, change: -0.24, unit: 'USD/oz' },
  { id: 'brent', name: 'Brent Crude', symbol: 'BRENT', group: 'Commodities', region: 'Global', value: 74.86, change: 0.91, unit: 'USD/bbl' },
  { id: 'eurusd', name: 'EUR / USD', symbol: 'EURUSD', group: 'Forex', region: 'Euro Area', value: 1.0724, change: -0.12, unit: 'rate' },
  { id: 'usdjpy', name: 'USD / JPY', symbol: 'USDJPY', group: 'Forex', region: 'Japan', value: 152.36, change: 0.22, unit: 'rate' },
  { id: 'dxy', name: 'US Dollar Index', symbol: 'DXY', group: 'Forex', region: 'Global', value: 104.12, change: 0.08, unit: 'index' },
  { id: 'gbpusd', name: 'GBP / USD', symbol: 'GBPUSD', group: 'Forex', region: 'United Kingdom', value: 1.2586, change: 0.16, unit: 'rate' },
].map((row, index) => ({
  ...row,
  spark: seededSeries(hashSeed(row.id), 32, row.value, row.change / 3200, 0.004),
  order: index,
}));
