import TrackedLink from "@/components/TrackedLink";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";

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
          <TrackedLink
            eventName="paritium_survey_clicked"
            eventParameters={{
              cta_name: "survey_navigation",
              page_origin: "footer_navigation"
            }}
            href="/survey"
          >
            Survey
          </TrackedLink>
        </div>
        <div>
          <h2>Legal</h2>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/privacy#cookies">Cookie notice</a>
          <CookiePreferencesButton />
        </div>
        <div>
          <h2>Contact us</h2>
          <a href="mailto:info@paritium.com">info@paritium.com</a>
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
