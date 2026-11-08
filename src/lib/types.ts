export type MarketSource = 'live' | 'demo';

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  rank: number | null;
  color: string;
  price: number;
  change24h: number;
  change7d: number;
  change30d: number;
  marketCap: number;
  volume24h: number;
  sparkline: number[];
  updatedAt: string;
};

export type MarketsResponse = {
  source: MarketSource;
  provider: string;
  updatedAt: string;
  assets: Asset[];
};

export type IndexRow = {
  id: string;
  name: string;
  symbol: string;
  group: 'Equities' | 'Commodities' | 'Forex';
  region: string;
  value: number;
  change: number;
  unit: string;
  spark: number[];
};

export type GlobalsResponse = {
  crypto: {
    marketCap: number;
    volume24h: number;
    btcDominance: number;
    ethDominance: number;
    activeAssets: number;
    marketCapChange24h: number;
  };
  indices: IndexRow[];
  indicesSource: 'reference';
  source: MarketSource;
  provider: string;
  updatedAt: string;
};

export type HistoryPoint = { t: number; price: number; volume: number };
export type HistoryResponse = {
  source: MarketSource;
  updatedAt: string;
  days: number;
  points: HistoryPoint[];
};

export type Candle = { t: number; o: number; h: number; l: number; c: number };
export type CandlesResponse = { source: MarketSource; updatedAt: string; days: number; candles: Candle[] };

export type CoinProfile = {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  color: string;
  about: string;
};

export type AssetDetailResponse = {
  asset: Asset;
  profile: CoinProfile;
  source: MarketSource;
  provider: string;
  updatedAt: string;
};

export type ArticleBlock = { type: 'p' | 'h2' | 'quote'; text: string };

export type Article = {
  slug: string;
  title: string;
  category?: string;
  type?: string;
  dek: string;
  author: string;
  role: string;
  date: string;
  readMinutes: number;
  art: string;
  featured?: boolean;
  body?: ArticleBlock[];
};

export type User = {
  id: string;
  email: string;
  fullName: string;
  country: string;
  baseCurrency: string;
  bio: string;
  createdAt: string;
  preferences: {
    currency: string;
    theme: string;
    priceAlerts: boolean;
    weeklyDigest: boolean;
    riskProfile: string;
  } | null;
};

export type Holding = {
  id: string;
  symbol: string;
  quantity: number;
  avgCost: number;
  createdAt: string;
  updatedAt: string;
};

export type RangeKey = '1d' | '7d' | '30d' | '1y';
