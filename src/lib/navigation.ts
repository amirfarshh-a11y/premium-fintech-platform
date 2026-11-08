export type NavChild = { to: string; label: string; desc: string };
export type NavItem = { label: string; to: string; children?: NavChild[] };

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Markets',
    to: '/markets',
    children: [
      { to: '/markets', label: 'Cryptocurrency markets', desc: 'Live prices, volume and 24h performance' },
      { to: '/global-markets', label: 'Global markets', desc: 'Indices, commodities and foreign exchange' },
      { to: '/analytics', label: 'Market analytics', desc: 'Interactive charts and range analytics' },
    ],
  },
  { label: 'Cryptocurrencies', to: '/markets' },
  {
    label: 'Trading',
    to: '/dashboard',
    children: [
      { to: '/dashboard', label: 'Dashboard', desc: 'Your market overview at a glance' },
      { to: '/portfolio', label: 'Portfolio tracker', desc: 'Positions, allocation and performance' },
      { to: '/watchlist', label: 'Watchlist', desc: 'The assets you are tracking' },
    ],
  },
  {
    label: 'Analysis',
    to: '/insights',
    children: [
      { to: '/insights', label: 'Market insights', desc: 'Technical, fundamental and macro commentary' },
      { to: '/analytics', label: 'Performance analytics', desc: 'Compare ranges across the major assets' },
    ],
  },
  { label: 'News', to: '/news' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const FOOTER_GROUPS = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About Aurum' },
      { to: '/contact', label: 'Contact us' },
      { to: '/insights', label: 'Research desk' },
      { to: '/news', label: 'Newsroom' },
    ],
  },
  {
    title: 'Markets',
    links: [
      { to: '/markets', label: 'Cryptocurrencies' },
      { to: '/global-markets', label: 'Global markets' },
      { to: '/analytics', label: 'Market analytics' },
      { to: '/markets/bitcoin', label: 'Bitcoin' },
      { to: '/markets/ethereum', label: 'Ethereum' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/portfolio', label: 'Portfolio tracker' },
      { to: '/watchlist', label: 'Watchlist' },
      { to: '/settings', label: 'Settings' },
      { to: '/register', label: 'Create an account' },
    ],
  },
];
