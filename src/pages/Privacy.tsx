import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <>
      <header className="page-head">
        <div className="page-head__bg" aria-hidden />
        <div className="container page-head__inner">
          <span className="eyebrow">Legal</span>
          <h1 className="h1">Privacy Policy</h1>
          <p className="lede">
            What we collect, why we collect it, and the choices you have. Written to be read, not to be survived.
          </p>
          <p className="muted" style={{ fontSize: '0.8rem' }}>Last updated 8 November 2026</p>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container">
          <div className="prose">
            <h2>1. Information we collect</h2>
            <p>
              We collect the information you provide when you create an account: your name, email address,
              country, base currency and, optionally, a short bio. If you use the portfolio and watchlist
              features we store the holdings and symbols you enter.
            </p>
            <p>
              We also store your preferences — display currency, interface theme, risk profile and notification
              choices — so that the product behaves consistently across devices.
            </p>

            <h2>2. What we do not collect</h2>
            <ul>
              <li>We do not collect your brokerage credentials, wallet keys or exchange API keys.</li>
              <li>We do not store payment card details; Aurum does not process payments for trading.</li>
              <li>We do not sell personal information to third parties.</li>
            </ul>

            <h2>3. How your data is used</h2>
            <p>
              Account information is used to authenticate you, render your dashboard and deliver the research and
              notifications you have asked for. Portfolio and watchlist entries are used only to display your own
              data back to you — they never appear in aggregate statistics or in another user&apos;s experience.
            </p>

            <h2>4. Market data</h2>
            <p>
              Prices and market statistics are retrieved from third-party market data providers. Those requests
              are server-side: your personal details are not shared with the data provider. Pages that show a
              data source label are telling you which feed produced the values on screen.
            </p>

            <h2>5. Security</h2>
            <ul>
              <li>Passwords are stored as salted hashes; we never store or log them in plain text.</li>
              <li>Sessions use a signed, http-only cookie that expires after seven days.</li>
              <li>Every portfolio and watchlist request is scoped to the signed-in account on the server.</li>
            </ul>

            <h2>6. Retention and deletion</h2>
            <p>
              Account data is retained for as long as your account is open. Contact messages are retained for
              twelve months so we can follow up on the request. You can request deletion of your account and its
              data at any time by writing to <a href="mailto:privacy@aurum.markets">privacy@aurum.markets</a>.
            </p>

            <h2>7. Your rights</h2>
            <p>
              Depending on where you live, you may have the right to access, correct, export or delete your
              personal data, and to object to certain processing. We respond to verified requests within 30 days.
            </p>

            <h2>8. Cookies</h2>
            <p>
              We set one essential cookie for authentication. We do not set advertising or cross-site tracking
              cookies. Clearing cookies signs you out but leaves your account data intact.
            </p>

            <h2>9. Contact</h2>
            <p>
              Privacy questions: <a href="mailto:privacy@aurum.markets">privacy@aurum.markets</a>. General
              enquiries: <Link to="/contact">contact the desk</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
