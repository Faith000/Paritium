import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy Policy | Paritium",
  description:
    "Learn how Paritium handles analytics, currency preferences, surveys, external links, and personal information."
};

const sections = [
  ["information", "Information we collect"],
  ["use", "How we use information"],
  ["cookies", "Cookies and local storage"],
  ["sharing", "When information is shared"],
  ["retention", "Data retention"],
  ["rights", "Your privacy rights"],
  ["security", "Security"],
  ["contact", "Contact us"]
] as const;

export default function PrivacyPage() {
  return (
    <main>
      <SiteHeader />

      <header className="legal-hero section-pad">
        <div>
          <p className="eyebrow">Privacy at Paritium</p>
          <h1>Clear information about your data.</h1>
          <p>
            Paritium helps you compare provider-published exchange rates. This
            policy explains what information may be collected when you use the
            website, why it is used, and the choices available to you.
          </p>
          <span>Effective 20 June 2026</span>
        </div>
      </header>

      <section className="legal-layout section-pad">
        <aside className="legal-navigation" aria-label="Privacy policy contents">
          <strong>On this page</strong>
          <nav>
            {sections.map(([id, label]) => (
              <a href={`#${id}`} key={id}>
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="legal-content">
          <section className="legal-introduction" aria-labelledby="privacy-overview">
            <h2 id="privacy-overview">Our approach to privacy</h2>
            <p>
              Paritium is an exchange-rate comparison and discovery platform
              developed by Greenvine Technologies and Eccentric LLC. We do not
              execute money transfers, hold customer funds, or ask for provider
              account credentials, payment card details, or bank account details.
            </p>
            <p>
              This policy applies to the Paritium website and its comparison
              features. When you follow a link to a transfer provider, app store,
              survey platform, or another third-party service, that service&apos;s
              privacy policy applies to your activity there.
            </p>
          </section>

          <section id="information">
            <p className="legal-section-number">01</p>
            <h2>Information we collect</h2>
            <h3>Information you choose to provide</h3>
            <p>
              If you take a survey, contact us, or use a future app-launch
              notification service, you may provide details such as your email
              address, currency interests, transfer frequency, preferred
              providers, satisfaction ratings, and written feedback. The current
              launch-notification form is a product preview and does not yet store
              or transmit email addresses.
            </p>

            <h3>Currency preferences</h3>
            <p>
              The site stores your selected currency pair in your browser so the
              comparison experience can remember your route between pages and
              visits. This preference does not identify your transfer account or
              reveal whether you completed a transfer.
            </p>

            <h3>Analytics information</h3>
            <p>
              If you accept analytics cookies, Google Analytics may collect
              information such as pages viewed, approximate location, device and
              browser type, traffic source, session activity, currency pairs
              selected, and interactions with provider, app-store, or survey
              links. We do not intentionally send names, email addresses, or
              financial details to Google Analytics.
            </p>

            <h3>Technical information</h3>
            <p>
              Our hosting and security providers may process standard request
              data such as IP address, browser information, request time, and
              error or security logs to deliver, protect, and troubleshoot the
              website.
            </p>
          </section>

          <section id="use">
            <p className="legal-section-number">02</p>
            <h2>How we use information</h2>
            <ul>
              <li>Provide and remember your selected comparison route.</li>
              <li>Measure website performance and improve navigation after consent.</li>
              <li>Understand which currency pairs and provider links are useful.</li>
              <li>Review survey feedback and prioritise product improvements.</li>
              <li>Respond to questions, feedback, or privacy requests.</li>
              <li>Protect the website, investigate errors, and prevent abuse.</li>
              <li>Meet applicable legal and regulatory obligations.</li>
            </ul>
            <p>
              Where privacy law requires a legal basis, we rely on your consent
              for optional analytics and voluntary submissions, and on legitimate
              interests to operate, secure, and improve the service where those
              interests do not override your rights.
            </p>
          </section>

          <section id="cookies">
            <p className="legal-section-number">03</p>
            <h2>Cookies and local storage</h2>
            <div className="legal-table-wrap">
              <table>
                <caption>Browser storage currently used by Paritium</caption>
                <thead>
                  <tr>
                    <th scope="col">Purpose</th>
                    <th scope="col">Type</th>
                    <th scope="col">Choice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Remember your selected currency pair</td>
                    <td>Functional cookie and local storage</td>
                    <td>Required for preference continuity</td>
                  </tr>
                  <tr>
                    <td>Remember your analytics decision</td>
                    <td>Local storage</td>
                    <td>Required to respect your choice</td>
                  </tr>
                  <tr>
                    <td>Measure website usage with Google Analytics</td>
                    <td>Analytics cookies</td>
                    <td>Optional; disabled until accepted</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              You can accept or reject analytics through the consent notice and
              change your decision using the <strong>Cookie preferences</strong>
              control. You can also clear browser storage in your browser
              settings. Rejecting analytics does not prevent you from comparing
              rates.
            </p>
          </section>

          <section id="sharing">
            <p className="legal-section-number">04</p>
            <h2>When information is shared</h2>
            <p>We may use or disclose limited information to:</p>
            <ul>
              <li>
                <strong>Google Analytics</strong>, only after consent, to measure
                website use and interaction trends.
              </li>
              <li>
                <strong>Survey providers</strong>, such as SurveyPlanet, when you
                choose to open or submit a Paritium survey.
              </li>
              <li>
                <strong>Hosting, infrastructure, and security providers</strong>
                that help deliver and protect the website.
              </li>
              <li>
                <strong>Authorities or professional advisers</strong> where
                disclosure is reasonably necessary to comply with law, protect
                rights, or investigate misuse.
              </li>
            </ul>
            <p>
              Provider websites and app stores receive information according to
              their own practices when you choose to follow an external link.
              Paritium does not sell personal information or use it for targeted
              advertising.
            </p>
          </section>

          <section id="retention">
            <p className="legal-section-number">05</p>
            <h2>Data retention</h2>
            <p>
              We retain personal information only for as long as reasonably
              needed for the purpose described in this policy, to resolve
              disputes, maintain security, or meet legal requirements. Currency
              preferences remain in your browser until they expire or you clear
              them. Analytics retention is controlled through the Paritium Google
              Analytics property. Survey responses are retained according to the
              applicable survey configuration and platform terms.
            </p>
          </section>

          <section id="rights">
            <p className="legal-section-number">06</p>
            <h2>Your privacy rights</h2>
            <p>
              Depending on where you live, you may have rights to request access,
              correction, deletion, restriction, objection, portability, or
              information about how your personal data is used. You may withdraw
              consent at any time, without affecting processing that occurred
              before withdrawal.
            </p>
            <p>
              To exercise a right, contact us using the address below. We may need
              to verify your request and may retain limited information where the
              law permits or requires it. You may also complain to the relevant
              data protection authority in your location.
            </p>
          </section>

          <section id="security">
            <p className="legal-section-number">07</p>
            <h2>Security and international processing</h2>
            <p>
              We use reasonable technical and organisational safeguards designed
              to protect information, including HTTPS and restricted handling of
              service credentials. No internet service can guarantee absolute
              security.
            </p>
            <p>
              Some service providers may process information in countries other
              than your own. Where required, we use appropriate safeguards for
              international data transfers. Paritium is not intended for children
              under 18, and we do not knowingly collect their personal information.
            </p>
          </section>

          <section id="contact">
            <p className="legal-section-number">08</p>
            <h2>Changes and contact</h2>
            <p>
              We may update this policy as Paritium adds providers, analytics,
              surveys, or other features. Material changes will be reflected on
              this page with a revised effective date.
            </p>
            <div className="legal-contact">
              <span>Privacy questions and requests</span>
              <a href="mailto:hello@paritium.com">hello@paritium.com</a>
              <p>Paritium | Greenvine Technologies &amp; Eccentric LLC</p>
            </div>
          </section>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
