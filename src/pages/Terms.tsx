import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">Legal</span>
          <h1 className="h1">Terms &amp; Conditions</h1>
          <p className="lede">
            The agreement that governs your use of Aurum, including the limits of what our market information can
            be used for.
          </p>
          <p className="muted" style={{ fontSize: '0.8rem' }}>Last updated 8 November 2026</p>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="prose">
            <h2>1. About these terms</h2>
            <p>
              These terms form a binding agreement between you and Aurum Global Markets (&ldquo;Aurum&rdquo;,
              &ldquo;we&rdquo;) covering your access to this platform, its market data and its research content.
              By creating an account or using the service you accept them.
            </p>

            <h2>2. What Aurum is — and is not</h2>
            <p>
              Aurum is an information and analytics platform. We are not a broker, an exchange, a custodian or an
              investment adviser. We do not hold client assets, execute orders or route trades. Nothing on the
              platform is investment advice, a recommendation, or an offer to buy or sell any instrument.
            </p>

            <h2>3. Market data</h2>
            <ul>
              <li>Digital-asset prices come from third-party market data providers and may be delayed.</li>
              <li>Values labelled &ldquo;demo data&rdquo; are sample values shown when a live feed is unavailable.</li>
              <li>Indices, commodities and FX shown as a &ldquo;reference snapshot&rdquo; are illustrative.</li>
              <li>You are responsible for verifying prices at your execution venue before trading.</li>
            </ul>

            <h2>4. Accounts and security</h2>
            <p>
              You must provide accurate registration details and keep your password confidential. You are
              responsible for activity under your account. Notify us immediately if you believe your credentials
              have been compromised.
            </p>

            <h2>5. Acceptable use</h2>
            <p>
              You may not scrape the platform at volume, attempt to bypass authentication or rate limits, resell
              our data, or use the service to manipulate any market. We may suspend accounts that put the service
              or other users at risk.
            </p>

            <h2>6. Your content</h2>
            <p>
              Portfolio entries, watchlists and profile details you submit remain yours. You grant us the limited
              licence needed to store and display them back to you as part of the service.
            </p>

            <h2>7. Research and intellectual property</h2>
            <p>
              Articles, analysis and the design of the platform are owned by Aurum. You may read and quote short
              extracts with attribution; you may not republish research in full without written permission.
            </p>

            <h2>8. Risk warning</h2>
            <blockquote>
              Digital assets and leveraged instruments are volatile and you can lose your entire capital. Past
              performance is not indicative of future results. Only commit capital you can afford to lose.
            </blockquote>

            <h2>9. Limitation of liability</h2>
            <p>
              To the extent permitted by law, Aurum is not liable for indirect or consequential losses, or for
              losses arising from decisions made using the platform&apos;s information. Our aggregate liability is
              limited to the amount you have paid us in the twelve months preceding the claim.
            </p>

            <h2>10. Changes and governing law</h2>
            <p>
              We may update these terms; material changes will be announced in the product before they take
              effect. These terms are governed by the laws of England and Wales, and the courts of London have
              exclusive jurisdiction.
            </p>

            <h2>11. Contact</h2>
            <p>
              Questions about these terms: <a href="mailto:legal@aurum.markets">legal@aurum.markets</a> or via our{' '}
              <Link to="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
