import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: 'clamp(140px, 18vh, 220px)', paddingBottom: 120 }}>
      <div className="cta-band" style={{ justifyItems: 'start', textAlign: 'left' }}>
        <div className="cta-band__rings" aria-hidden />
        <span className="eyebrow">404</span>
        <h1 className="h1" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
          This page is not on the <span className="serif-italic gold-text">tape</span>
        </h1>
        <p className="lede" style={{ maxWidth: '52ch' }}>
          The route you followed does not exist. Markets, research and the newsroom are all still here.
        </p>
        <div className="row row--wrap">
          <Link to="/" className="btn btn--gold">
            Back to home
          </Link>
          <Link to="/markets" className="btn btn--ghost">
            <Compass size={15} /> Explore markets
          </Link>
        </div>
      </div>
    </div>
  );
}
