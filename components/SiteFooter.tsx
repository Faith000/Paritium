export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <a className="logo footer-logo" href="/">
            Paritium
          </a>
          <p>
            Transparent exchange-rate comparison for consumers, travellers,
            diaspora communities, and small businesses.
          </p>
        </div>
        <div>
          <h2>Quick links</h2>
          <a href="/">Home</a>
          <a href="/compare">Compare Rates</a>
          <a href="/how-it-works">How It Works</a>
          <a href="/about">About</a>
          <a href="/survey">Survey</a>
        </div>
        <div>
          <h2>Legal</h2>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/privacy#cookies">Cookie notice</a>
        </div>
        <div>
          <h2>Connect</h2>
          <a href="https://x.com" target="_blank" rel="noreferrer">
            Twitter/X
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            Instagram
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          Paritium is a rate comparison service. We are not a money transfer
          provider.
        </p>
        <p>© 2026 Paritium | Greenvine Technologies & EccentricLLC</p>
      </div>
    </footer>
  );
}
