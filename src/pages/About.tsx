import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Compass, Eye, Lock, Scale, Users } from 'lucide-react';

const PILLARS = [
  {
    icon: Eye,
    title: 'Transparency over theatre',
    body: 'Every market figure carries a source and a timestamp. When a feed is delayed or unavailable we label the data instead of hiding the gap.',
  },
  {
    icon: Scale,
    title: 'Editorial independence',
    body: 'Research is written by analysts and published without sponsored conclusions. No issuer pays for coverage.',
  },
  {
    icon: Lock,
    title: 'Privacy by default',
    body: 'Portfolios, watchlists and preferences belong to your account and are never shared with other users.',
  },
];

const DESKS = [
  { name: 'Digital Assets Research', focus: 'Market structure, flows and volatility regimes.' },
  { name: 'Macro & Cross-Asset', focus: 'Liquidity, dollar transmission and allocation frameworks.' },
  { name: 'Protocol Research', focus: 'Scaling, fee markets and collateral primitives.' },
  { name: 'Policy & Regulation', focus: 'Market-structure rules and venue risk.' },
];

export default function About() {
  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">About Aurum</span>
          <h1 className="h1">
            A quieter kind of <span className="serif-italic gold-text">financial platform</span>
          </h1>
          <p className="lede">
            Aurum was built for people who read markets closely: live pricing, honest labelling and research that
            explains its reasoning. No noise, no promises.
          </p>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="about-split">
            <div className="card card--pad stack stack-16">
              <span className="eyebrow">Our premise</span>
              <h2 className="h2" style={{ fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)' }}>
                Markets reward preparation, not prediction.
              </h2>
              <p style={{ color: 'var(--text-soft)', lineHeight: 1.75 }}>
                Most financial platforms compete on the number of instruments they list. We compete on how clearly
                a market is explained. That means fewer, better-labelled data surfaces; ranges that are actually
                comparable; and editorial that states its invalidation.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
                Aurum covers digital assets alongside equities, commodities and foreign exchange because capital
                does not respect asset-class boundaries. A single framework — liquidity, positioning, structure —
                travels across all of them.
              </p>
              <div className="row row--wrap" style={{ gap: 10 }}>
                <Link to="/markets" className="btn btn--gold btn--sm">
                  Explore markets <ArrowRight size={14} className="btn__icon" />
                </Link>
                <Link to="/contact" className="btn btn--ghost btn--sm">
                  Talk to the desk
                </Link>
              </div>
            </div>

            <div className="about-visual art art--gold">
              <div className="about-visual__inner">
                <span className="panel-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Est. framework</span>
                <div className="about-visual__quote">
                  “Measure the market before you measure your opinion of it.”
                </div>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>
                  Aurum research desk
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">What guides us</span>
              <h2 className="h2">Three commitments</h2>
            </div>
          </div>
          <div className="grid grid--3">
            {PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div className="card card--pad card--hover stack stack-12" key={pillar.title}>
                  <span className="why-item__icon">
                    <Icon size={19} />
                  </span>
                  <h3 className="h3" style={{ fontSize: '1.05rem' }}>{pillar.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{pillar.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="grid grid--2" style={{ alignItems: 'start' }}>
            <div className="stack stack-16">
              <span className="eyebrow">Coverage</span>
              <h2 className="h2">Four desks, one framework</h2>
              <p className="lede">
                Research is organised by question rather than by ticker, so a view on liquidity can be traced from
                the dollar through to a digital-asset allocation.
              </p>
              <div className="stack stack-4">
                {DESKS.map((desk) => (
                  <div className="metric-row" key={desk.name}>
                    <span style={{ color: 'var(--text-soft)', fontWeight: 600 }}>{desk.name}</span>
                    <b style={{ color: 'var(--text-muted)', fontWeight: 400, textAlign: 'right', maxWidth: '56%' }}>
                      {desk.focus}
                    </b>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card--pad stack stack-16">
              <span className="panel-label">How we publish</span>
              <ul className="about-list">
                <li>
                  <BookOpen size={16} /> Every article names its author, desk and publication date.
                </li>
                <li>
                  <Compass size={16} /> Analysis states what would invalidate the view.
                </li>
                <li>
                  <Users size={16} /> No sponsored research, no paid rankings.
                </li>
                <li>
                  <Eye size={16} /> Corrections are published rather than silently edited.
                </li>
              </ul>
              <div className="divider" />
              <p style={{ fontSize: '0.82rem', color: 'var(--text-faint)', lineHeight: 1.7 }}>
                Aurum does not hold client funds and does not execute trades. We are an information and analytics
                platform. Any execution happens at a venue of your choosing.
              </p>
              <Link to="/privacy" className="article-card__link">
                Read the privacy policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="cta-band">
            <div className="cta-band__rings" aria-hidden />
            <h2 className="h2" style={{ maxWidth: '26ch' }}>
              Research is better with your own <span className="serif-italic gold-text">positions</span>
            </h2>
            <p className="lede" style={{ maxWidth: '48ch' }}>
              Create an account to track a portfolio, build watchlists and keep your preferences across devices.
            </p>
            <Link to="/register" className="btn btn--gold btn--lg">
              Create an account <ArrowRight size={16} className="btn__icon" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
