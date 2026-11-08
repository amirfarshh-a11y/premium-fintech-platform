import { Link } from 'react-router-dom';
import { Github, Linkedin, Send, Youtube } from 'lucide-react';
import { Logo } from './Logo';
import { FOOTER_GROUPS } from '../lib/navigation';

const SOCIAL = [
  { href: 'https://x.com', label: 'Aurum on X', Icon: Send },
  { href: 'https://www.linkedin.com', label: 'Aurum on LinkedIn', Icon: Linkedin },
  { href: 'https://www.youtube.com', label: 'Aurum on YouTube', Icon: Youtube },
  { href: 'https://github.com', label: 'Aurum on GitHub', Icon: Github },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo />
            <p className="footer__desc">
              Aurum is a global market intelligence platform for digital assets and traditional markets —
              combining live pricing, institutional-grade analytics and independent research in one workspace.
            </p>
            <div className="footer__social">
              {SOCIAL.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="icon-btn"
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div className="stack stack-4" style={{ fontSize: '0.8rem', color: 'var(--text-faint)' }}>
              <a href="mailto:desk@aurum.markets" className="footer__link">desk@aurum.markets</a>
              <span>One Canada Square, Canary Wharf, London</span>
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="footer__col-title">{group.title}</h3>
              <div className="footer__links">
                {group.links.map((link) => (
                  <Link key={link.to + link.label} to={link.to} className="footer__link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="footer__disclaimer">
          <strong style={{ color: 'var(--text-muted)' }}>Risk disclaimer:</strong> Digital assets and other
          markets are volatile and can lose value rapidly. Past performance is not indicative of future results.
          Nothing on Aurum constitutes investment advice, a recommendation, or an offer to buy or sell any
          financial instrument. Prices shown may be delayed; always verify with your execution venue before
          trading. Seek independent professional advice where appropriate.
        </p>

        <div className="footer__bottom">
          <span>© {year} Aurum Global Markets. All rights reserved.</span>
          <div className="footer__legal">
            <Link to="/privacy" className="footer__link">Privacy Policy</Link>
            <Link to="/terms" className="footer__link">Terms of Service</Link>
            <Link to="/contact" className="footer__link">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
