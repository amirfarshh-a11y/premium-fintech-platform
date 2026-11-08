/**
 * Editorial content authored for Aurum. This is platform editorial copy, not a
 * market data feed; articles describe the themes our research desk covers.
 */

export const NEWS = [
  {
    slug: 'institutional-flows-reshape-digital-asset-markets',
    title: 'Institutional flows quietly reshape the structure of digital-asset markets',
    category: 'Crypto',
    dek: 'Spot vehicles, prime brokerage and regulated custody have changed who sets the marginal price in bitcoin — and how the market reacts to macro data.',
    author: 'Elena Marchetti',
    role: 'Head of Digital Assets Research',
    date: '2026-11-08',
    readMinutes: 6,
    art: 'aurora',
    featured: true,
    body: [
      { type: 'p', text: 'The composition of bitcoin ownership has shifted materially over the past two years. What began as a retail-led asset class is now shaped by allocators who think in mandate constraints, funding costs and risk budgets rather than in narratives.' },
      { type: 'h2', text: 'A different marginal buyer' },
      { type: 'p', text: 'When the marginal buyer is a portfolio manager, price discovery becomes more sensitive to real yields and dollar liquidity and less sensitive to social sentiment. That shows up in the data as shallower drawdowns on negative headlines and slower melt-ups on positive ones.' },
      { type: 'p', text: 'For traders this changes the shape of the opportunity set: trend persistence improves, but the amplitude of intraday moves compresses. Strategies calibrated on the 2021 volatility regime need recalibration.' },
      { type: 'h2', text: 'What to watch next' },
      { type: 'p', text: 'Three variables matter most over the coming quarter: the pace of net creations in spot vehicles, the level of stablecoin supply growth as a proxy for dry powder, and the term structure of perpetual funding as a gauge of leverage appetite.' },
      { type: 'quote', text: 'Liquidity, not narrative, is now the primary driver of short-horizon returns.' },
      { type: 'p', text: 'Aurum readers can track each of these through the analytics workspace, where market capitalisation, volume and range performance for the major assets update together.' },
    ],
  },
  {
    slug: 'ethereum-scaling-roadmap-fee-market',
    title: 'Ethereum’s scaling roadmap meets a maturing fee market',
    category: 'Blockchain',
    dek: 'Cheaper blockspace changes the economics of on-chain applications — and the value accrual story for the assets that secure them.',
    author: 'Tomás Herrera',
    role: 'Protocol Analyst',
    date: '2026-11-07',
    readMinutes: 5,
    art: 'violet',
    body: [
      { type: 'p', text: 'Layer-two rollups have absorbed the majority of transaction growth, and the consequence is a fee market that behaves quite differently from the one the network was designed around.' },
      { type: 'h2', text: 'Cheap blockspace is a product decision' },
      { type: 'p', text: 'When marginal transaction cost approaches zero, application design changes: high-frequency settlement, micro-payments and on-chain order books become viable. That is a demand tailwind, even as it pressures fee-based revenue models.' },
      { type: 'p', text: 'For investors the question is not whether activity grows, but which layer captures the value of that activity. Sequencer economics, blob pricing and staking yield all sit on different sides of that ledger.' },
      { type: 'h2', text: 'Reading the data' },
      { type: 'p', text: 'Track net issuance against burn, validator entry queue dynamics and stablecoin transfer volume across the major rollups. Divergence between activity and fee capture is the signal worth monitoring.' },
    ],
  },
  {
    slug: 'dollar-liquidity-and-risk-assets',
    title: 'Dollar liquidity is setting the tone for risk assets again',
    category: 'Global Markets',
    dek: 'Cross-asset correlation has tightened as funding markets respond to policy expectations. Here is the transmission channel that matters.',
    author: 'Priya Raghunathan',
    role: 'Macro Strategist',
    date: '2026-11-06',
    readMinutes: 7,
    art: 'ocean',
    body: [
      { type: 'p', text: 'Equity indices, precious metals and digital assets have all become more sensitive to the same variable: the cost of dollar funding. When that cost falls, duration-sensitive assets lead; when it rises, the market pays for liquidity.' },
      { type: 'h2', text: 'The channel' },
      { type: 'p', text: 'Policy expectations move front-end yields, front-end yields move hedging demand, and hedging demand moves the dollar. Each step compresses or expands financial conditions with a lag that markets increasingly price in advance.' },
      { type: 'p', text: 'This is why a single macro release can reprice assets that share no fundamental link. Correlation regimes are a liquidity artefact more often than a narrative one.' },
      { type: 'h2', text: 'Positioning implications' },
      { type: 'p', text: 'Diversification across risk assets is weaker than headline correlation tables suggest during liquidity shocks. Sizing decisions should be made on a portfolio heat basis rather than per-position conviction.' },
    ],
  },
  {
    slug: 'stablecoin-supply-as-a-leading-indicator',
    title: 'Why stablecoin supply is the cleanest leading indicator in crypto',
    category: 'Market Updates',
    dek: 'Aggregate stablecoin float tracks the capital waiting on the sidelines better than any price chart.',
    author: 'Daniel Okonkwo',
    role: 'Markets Editor',
    date: '2026-11-05',
    readMinutes: 4,
    art: 'gold',
    body: [
      { type: 'p', text: 'Stablecoin supply behaves like dry powder. Growth in aggregate float tends to precede expansions in trading volume, and contraction tends to accompany risk reduction rather than precede it.' },
      { type: 'p', text: 'The indicator is not perfect — issuance can be driven by settlement demand rather than speculative intent — but directionally it is one of the few on-chain series with genuine predictive value for market breadth.' },
      { type: 'h2', text: 'How we use it' },
      { type: 'p', text: 'We track the seven-day change in aggregate supply alongside perpetual funding and spot volume. When supply growth turns positive while funding is neutral, breadth usually improves within a few weeks.' },
    ],
  },
  {
    slug: 'tokenised-treasuries-and-the-new-collateral',
    title: 'Tokenised treasuries are becoming the collateral layer of on-chain finance',
    category: 'Blockchain',
    dek: 'Short-duration government exposure, wrapped as a transferable token, is quietly solving the collateral problem for decentralised markets.',
    author: 'Sofia Lindqvist',
    role: 'Digital Assets Correspondent',
    date: '2026-11-04',
    readMinutes: 5,
    art: 'silver',
    body: [
      { type: 'p', text: 'The most consequential development in on-chain finance this cycle is not a new chain or a new application category. It is the arrival of yield-bearing, transferable claims on short-duration government debt.' },
      { type: 'p', text: 'Collateral that earns a risk-free rate while remaining usable in derivatives markets changes the opportunity cost of holding margin. That is a structural improvement in capital efficiency.' },
      { type: 'h2', text: 'The constraints' },
      { type: 'p', text: 'Legal enforceability, transfer restrictions and redemption mechanics vary widely by issuer. Two tokens with similar names can carry very different operational risk — due diligence remains the binding constraint.' },
    ],
  },
  {
    slug: 'regulation-converges-on-market-structure',
    title: 'Regulation converges on market structure, not on assets',
    category: 'Regulation',
    dek: 'The regulatory conversation has moved from whether digital assets exist to how their venues, custody and disclosures should work.',
    author: 'Marcus Feld',
    role: 'Policy Analyst',
    date: '2026-11-03',
    readMinutes: 6,
    art: 'navy',
    body: [
      { type: 'p', text: 'Across major jurisdictions, the legislative focus has shifted toward market-structure questions: segregation of client assets, disclosure standards for listings, and the boundary between trading venues and broker-dealers.' },
      { type: 'p', text: 'For platforms, that means compliance architecture is now a competitive moat rather than a cost centre. For investors, it means venue risk deserves the same scrutiny as asset risk.' },
      { type: 'h2', text: 'Practical consequences' },
      { type: 'p', text: 'Expect consolidation among intermediaries, clearer segmentation between retail and professional access, and a premium on audited proof-of-reserves and segregated custody.' },
    ],
  },
  {
    slug: 'volatility-regime-shift-in-majors',
    title: 'Volatility in the majors is compressing — and that has consequences',
    category: 'Crypto',
    dek: 'Realised volatility across large-cap digital assets has fallen toward equity-like levels. Option surfaces tell the story.',
    author: 'Elena Marchetti',
    role: 'Head of Digital Assets Research',
    date: '2026-11-02',
    readMinutes: 4,
    art: 'emerald',
    body: [
      { type: 'p', text: 'A market with fewer reflexive liquidations produces a lower volatility regime. As leverage migrates to regulated venues with tighter margin rules, the tails shorten.' },
      { type: 'p', text: 'Lower volatility is not the same as lower risk. It compresses the cost of carry and encourages leverage to rebuild — which is precisely how the next volatility expansion gets funded.' },
      { type: 'h2', text: 'What the surface says' },
      { type: 'p', text: 'Skew has flattened and term structure has steepened modestly, consistent with a market that expects calm in the near term and uncertainty further out.' },
    ],
  },
  {
    slug: 'gold-and-bitcoin-correlation-revisited',
    title: 'Gold and bitcoin: revisiting a correlation that keeps being rediscovered',
    category: 'Global Markets',
    dek: 'Both assets respond to debasement concerns, but they respond to different funding conditions. That distinction drives the trading.',
    author: 'Priya Raghunathan',
    role: 'Macro Strategist',
    date: '2026-10-30',
    readMinutes: 5,
    art: 'champagne',
    body: [
      { type: 'p', text: 'The gold–bitcoin relationship is regime dependent. In liquidity expansions the two assets can trade together as debasement hedges; in funding squeezes gold holds while digital assets de-risk.' },
      { type: 'p', text: 'Treating the pair as a single hedge understates the path dependency. The correlation of returns is a summary statistic; the correlation of drawdowns is the one that matters for risk management.' },
      { type: 'h2', text: 'A practical frame' },
      { type: 'p', text: 'Use gold as a policy-uncertainty hedge and digital assets as a liquidity-beta expression. Sizing the two as one sleeve obscures what each is actually doing for the portfolio.' },
    ],
  },
];

export const INSIGHTS = [
  {
    slug: 'bitcoin-range-structure-signals-accumulation',
    title: 'Bitcoin’s range structure is signalling accumulation, not distribution',
    type: 'Technical Analysis',
    dek: 'Higher lows on the weekly, declining realised volatility and neutral funding describe a market absorbing supply rather than distributing it.',
    author: 'Kwame Adjei',
    role: 'Technical Strategist',
    date: '2026-11-08',
    readMinutes: 5,
    art: 'gold',
    body: [
      { type: 'p', text: 'A range is only informative when you know who is selling into it. The current structure — higher lows, contracting range width, and funding that stays close to neutral — is characteristic of absorption.' },
      { type: 'h2', text: 'The levels that matter' },
      { type: 'p', text: 'The range midpoint has acted as a magnet, with acceptance above it followed by shallow retests. That behaviour tends to precede expansion, though the direction of the expansion is decided by the funding impulse rather than by the chart.' },
      { type: 'p', text: 'Invalidation is straightforward: a weekly close below the range low with rising open interest. Until then, the path of least resistance remains higher.' },
    ],
  },
  {
    slug: 'ethereum-fundamental-case-restaking',
    title: 'The fundamental case for ether is about yield, not fees',
    type: 'Fundamental Analysis',
    dek: 'Valuing ether on transaction fees misses the point. The asset is a claim on security budget and a collateral primitive.',
    author: 'Tomás Herrera',
    role: 'Protocol Analyst',
    date: '2026-11-06',
    readMinutes: 7,
    art: 'violet',
    body: [
      { type: 'p', text: 'Fee revenue is the most visible metric and the least useful one for valuation. As activity migrates to rollups, the base layer’s economics increasingly resemble a security budget rather than a toll booth.' },
      { type: 'h2', text: 'Three sources of demand' },
      { type: 'p', text: 'Staking demand for yield, collateral demand from on-chain credit, and reserve demand from institutional wrappers each price ether differently. The aggregate is what the market discounts.' },
      { type: 'p', text: 'The relevant risk is not declining fees; it is a change in the credible neutrality of the settlement layer.' },
    ],
  },
  {
    slug: 'portfolio-construction-for-digital-assets',
    title: 'Portfolio construction: sizing digital assets without blowing up the book',
    type: 'Investment Trends',
    dek: 'Volatility-adjusted sizing, rebalancing discipline and explicit liquidity assumptions matter more than asset selection at this stage of adoption.',
    author: 'Priya Raghunathan',
    role: 'Macro Strategist',
    date: '2026-11-05',
    readMinutes: 6,
    art: 'ocean',
    body: [
      { type: 'p', text: 'Most portfolio damage in this asset class comes from position sizing and from liquidity assumptions made in calm markets and tested in stressed ones.' },
      { type: 'p', text: 'A volatility-targeted sleeve with an explicit cap and a scheduled rebalance captures most of the diversification benefit while controlling the tail. Discretionary overweights add concentration, not edge.' },
      { type: 'h2', text: 'Operational checklist' },
      { type: 'p', text: 'Segregated custody, documented venue limits, a stablecoin counterparty policy and an explicit drawdown review trigger. Boring infrastructure is the alpha.' },
    ],
  },
  {
    slug: 'altcoin-rotation-breadth-indicators',
    title: 'Measuring rotation: breadth, not price, tells you where the cycle is',
    type: 'Market Analysis',
    dek: 'Advancing-declining breadth across the top hundred assets distinguishes a healthy rotation from a fragile one.',
    author: 'Daniel Okonkwo',
    role: 'Markets Editor',
    date: '2026-11-04',
    readMinutes: 5,
    art: 'silver',
    body: [
      { type: 'p', text: 'Price indices can rise while breadth deteriorates. In digital assets, that divergence usually resolves through a sharp rotation rather than a gradual one.' },
      { type: 'p', text: 'We monitor the share of the top hundred assets trading above their fifty-day average, alongside volume concentration in the largest names. Healthy expansions broaden; fragile ones narrow.' },
      { type: 'h2', text: 'How to act on it' },
      { type: 'p', text: 'Narrowing breadth is not a sell signal by itself, but it argues for tighter stops and reduced exposure to the least liquid tail of the market.' },
    ],
  },
  {
    slug: 'macro-commentary-liquidity-first-frameworks',
    title: 'Expert commentary: build the framework before the forecast',
    type: 'Expert Commentary',
    dek: 'In a market where narratives rotate weekly, the durable edge is a repeatable process for asking better questions.',
    author: 'Marcus Feld',
    role: 'Policy Analyst',
    date: '2026-11-02',
    readMinutes: 4,
    art: 'champagne',
    body: [
      { type: 'p', text: 'Forecasts age badly. Frameworks compound. The most useful discipline for a cross-asset investor is to write down, in advance, which variables would change your mind.' },
      { type: 'p', text: 'For digital assets the framework needs three inputs: liquidity conditions, adoption of regulated infrastructure, and the leverage embedded in the system. Everything else is commentary.' },
      { type: 'h2', text: 'A weekly review' },
      { type: 'p', text: 'Once a week, mark each input improving, stable or deteriorating. Position sizing should follow the marks, not the headlines.' },
    ],
  },
  {
    slug: 'liquidity-mapping-for-crypto-order-books',
    title: 'Liquidity mapping: reading order books across venues',
    type: 'Technical Analysis',
    dek: 'Aggregated depth is a better risk input than quoted spreads, particularly around scheduled macro events.',
    author: 'Kwame Adjei',
    role: 'Technical Strategist',
    date: '2026-10-31',
    readMinutes: 5,
    art: 'navy',
    body: [
      { type: 'p', text: 'Quoted spreads flatter a fragmented market. Depth within one percent of mid, aggregated across venues, is the number that matters when a position needs to be reduced quickly.' },
      { type: 'p', text: 'Depth is procyclical: it appears when it is least needed and evaporates exactly when it is required. Sizing should assume a discount to current depth, not the current depth itself.' },
      { type: 'h2', text: 'Event risk' },
      { type: 'p', text: 'Around scheduled macro releases, assume depth contracts meaningfully for several minutes. Stops placed inside that window are liquidity, not protection.' },
    ],
  },
];

export const NEWS_CATEGORIES = ['All', 'Crypto', 'Global Markets', 'Market Updates', 'Blockchain', 'Regulation'];
export const INSIGHT_TYPES = ['All', 'Market Analysis', 'Technical Analysis', 'Fundamental Analysis', 'Investment Trends', 'Expert Commentary'];

export function findArticle(slug) {
  return (
    NEWS.find((a) => a.slug === slug) ||
    INSIGHTS.find((a) => a.slug === slug) ||
    null
  );
}

export function listNews({ category, q } = {}) {
  const needle = (q || '').trim().toLowerCase();
  return NEWS.filter((a) => {
    const inCategory = !category || category === 'All' || a.category === category;
    const inSearch =
      !needle ||
      a.title.toLowerCase().includes(needle) ||
      a.dek.toLowerCase().includes(needle) ||
      a.category.toLowerCase().includes(needle);
    return inCategory && inSearch;
  }).map(({ body, ...meta }) => meta);
}

export function listInsights({ type } = {}) {
  return INSIGHTS.filter((a) => !type || type === 'All' || a.type === type).map(({ body, ...meta }) => meta);
}
