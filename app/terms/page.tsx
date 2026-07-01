import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Terms of Use | Paritium",
  description:
    "Read the terms that apply when using Paritium to compare provider-published foreign exchange rates."
};

const sections = [
  ["acceptance", "Acceptance and eligibility"],
  ["service", "The Paritium service"],
  ["rates", "Rates and rankings"],
  ["providers", "External providers"],
  ["responsibilities", "Your responsibilities"],
  ["acceptable-use", "Acceptable use"],
  ["ownership", "Ownership and feedback"],
  ["availability", "Availability and changes"],
  ["liability", "Disclaimers and liability"],
  ["general", "General terms"],
  ["contact", "Contact us"]
] as const;

export default function TermsPage() {
  return (
    <main>
      <SiteHeader />

      <header className="legal-hero section-pad">
        <div>
          <p className="eyebrow">Using Paritium</p>
          <h1>Terms built around transparent comparison.</h1>
          <p>
            These Terms explain how you may use Paritium, what our comparison
            service does, and where our responsibility ends when you continue to
            an independent transfer provider.
          </p>
          <span>Effective 20 June 2026</span>
        </div>
      </header>

      <section className="legal-layout section-pad">
        <aside className="legal-navigation" aria-label="Terms of use contents">
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
          <section className="legal-introduction" aria-labelledby="terms-overview">
            <h2 id="terms-overview">Comparison, not money transfer</h2>
            <p>
              Paritium is an exchange-rate comparison and discovery platform
              developed by Greenvine Technologies and EccentricLLC. Paritium does
              not execute transfers, receive or hold customer funds, provide
              payment accounts, or act as an agent for a transfer provider.
            </p>
            <p>
              Any transfer is arranged directly between you and the provider you
              choose. The provider&apos;s own terms, checks, fees, rate, and privacy
              practices govern that transaction.
            </p>
          </section>

          <section id="acceptance">
            <p className="legal-section-number">01</p>
            <h2>Acceptance and eligibility</h2>
            <p>
              By accessing or using the Paritium website, you agree to these
              Terms of Use and acknowledge our Privacy Policy. If you do not
              agree, do not use the service.
            </p>
            <p>
              You must be at least 18 years old and legally capable of agreeing
              to these Terms. If you use Paritium for a business or organisation,
              you confirm that you are authorised to accept these Terms on its
              behalf.
            </p>
          </section>

          <section id="service">
            <p className="legal-section-number">02</p>
            <h2>The Paritium service</h2>
            <p>
              Paritium presents exchange-rate information for supported currency
              pairs and helps users discover transfer providers. Features may
              include provider rankings, freshness information, provider website
              links, app-store links, surveys, and educational content.
            </p>
            <p>
              Paritium is provided for general information and comparison only.
              Nothing on the website is financial, investment, tax, legal, or
              other professional advice. A displayed provider or rate is not a
              recommendation that the provider or service is suitable for you.
            </p>
          </section>

          <section id="rates">
            <p className="legal-section-number">03</p>
            <h2>Rates, freshness, and rankings</h2>
            <h3>Published rates</h3>
            <p>
              We aim to display provider-published rates with a visible update
              time. Depending on integration availability, information may come
              from provider APIs, public provider sources, cached or last-known
              data, or maintained fallback data during testing and service
              interruptions.
            </p>

            <h3>Rates can change</h3>
            <p>
              Exchange rates can change at any time. A provider may apply fees,
              limits, promotions, eligibility rules, payment-method adjustments,
              or a different checkout rate. The final information shown by the
              provider before you confirm a transaction is authoritative.
            </p>

            <h3>How providers are ranked</h3>
            <p>
              For a selected currency pair, Paritium ranks providers from the
              highest displayed published rate to the lowest. Where a send
              amount and transfer fee are shown, the recipient-receives value is
              an estimate based on the displayed rate and fee. The ranking does
              not account for transfer speed, limits, service quality,
              promotions, payment-method adjustments, or individual eligibility.
              A &quot;Best Rate Today&quot; label means the highest displayed rate in
              the current comparison, not a guarantee of the best available
              transaction for every user.
            </p>
          </section>

          <section id="providers">
            <p className="legal-section-number">04</p>
            <h2>External providers and links</h2>
            <p>
              Transfer providers, app stores, survey services, and other linked
              services are independent from Paritium. External links are provided
              for convenience and discovery. Paritium does not control or endorse
              their availability, security, content, pricing, customer service,
              or transaction outcomes.
            </p>
            <p>
              Unless a commercial, affiliate, or sponsored relationship is
              clearly disclosed, the inclusion or position of a provider does not
              indicate a commercial relationship. The current Paritium prototype
              does not receive payment from listed providers for ranking them.
            </p>
            <p>
              When you leave Paritium, review the provider&apos;s current terms,
              privacy policy, fees, rate, delivery estimate, eligibility rules,
              and regulatory status before proceeding.
            </p>
          </section>

          <section id="responsibilities">
            <p className="legal-section-number">05</p>
            <h2>Your responsibilities</h2>
            <p>When using Paritium, you are responsible for:</p>
            <ul>
              <li>Checking that your selected currency pair is correct.</li>
              <li>Reviewing the displayed update time and any stale-rate warning.</li>
              <li>Confirming the final rate, fees, and terms on the provider platform.</li>
              <li>Assessing whether a provider is suitable and available in your location.</li>
              <li>Complying with applicable laws and the provider&apos;s requirements.</li>
              <li>Protecting your own device, accounts, passwords, and payment details.</li>
            </ul>
          </section>

          <section id="acceptable-use">
            <p className="legal-section-number">06</p>
            <h2>Acceptable use</h2>
            <p>You must not:</p>
            <ul>
              <li>Use Paritium for unlawful, fraudulent, or misleading activity.</li>
              <li>Attempt to bypass security, access restrictions, or rate limits.</li>
              <li>Introduce malware or interfere with the website or its infrastructure.</li>
              <li>Scrape, crawl, or harvest the service at scale without written permission.</li>
              <li>Misrepresent your relationship with Paritium or any listed provider.</li>
              <li>Copy or republish rate data in a way that is deceptive or removes freshness context.</li>
              <li>Use automated traffic that unreasonably burdens the service or provider integrations.</li>
            </ul>
          </section>

          <section id="ownership">
            <p className="legal-section-number">07</p>
            <h2>Ownership, trademarks, and feedback</h2>
            <p>
              The Paritium name, website design, software, original content, and
              comparison presentation are owned by or licensed to the Paritium
              team and are protected by applicable intellectual-property laws.
              Provider names, logos, app-store marks, and other third-party
              materials belong to their respective owners. Their appearance on
              Paritium does not transfer ownership or imply endorsement.
            </p>
            <p>
              You may use the website for personal or internal business
              comparison. You may not reproduce, sell, sublicense, or create a
              competing dataset from substantial parts of the service without
              written permission.
            </p>
            <p>
              If you submit feedback or survey responses, you allow Paritium to
              use that feedback to analyse and improve the service. We will
              handle personal information as described in our Privacy Policy.
            </p>
          </section>

          <section id="availability">
            <p className="legal-section-number">08</p>
            <h2>Availability and changes</h2>
            <p>
              We aim to keep Paritium accurate and available, but do not promise
              uninterrupted access. Provider APIs, networks, hosting services,
              or other dependencies may fail or return incomplete information.
              We may use cached or fallback data, remove a provider, suspend a
              currency route, or temporarily restrict a feature.
            </p>
            <p>
              We may update, add, suspend, or discontinue parts of the service
              without notice where reasonably necessary for maintenance,
              security, legal compliance, data quality, or product development.
            </p>
          </section>

          <section id="liability">
            <p className="legal-section-number">09</p>
            <h2>Disclaimers and limitation of liability</h2>
            <p>
              To the extent permitted by applicable law, Paritium is provided
              &quot;as is&quot; and &quot;as available.&quot; We do not warrant that
              every rate is complete, current, error-free, or available to every
              user, or that a provider will complete a transfer on particular
              terms.
            </p>
            <p>
              To the extent permitted by law, Paritium and its developers are not
              responsible for losses arising from rate movements, stale or
              unavailable data, provider fees or decisions, failed or delayed
              transfers, external websites, or a user&apos;s reliance on comparison
              information without verifying it with the provider.
            </p>
            <p>
              Nothing in these Terms excludes or limits liability that cannot
              lawfully be excluded, including liability for fraud or any
              mandatory consumer rights available in your location.
            </p>
          </section>

          <section id="general">
            <p className="legal-section-number">10</p>
            <h2>General terms</h2>
            <h3>Privacy</h3>
            <p>
              Our <a className="legal-inline-link" href="/privacy">Privacy Policy</a> explains
              how information is handled. Details about cookies and local storage
              are available in the <a className="legal-inline-link" href="/privacy#cookies">Cookie notice</a>.
            </p>

            <h3>Changes to these Terms</h3>
            <p>
              We may update these Terms when the service, provider relationships,
              or legal requirements change. The effective date above will be
              revised when changes are published. Continued use after an update
              means the revised Terms apply from the stated effective date.
            </p>

            <h3>Severability and waiver</h3>
            <p>
              If a provision is found unenforceable, the remaining provisions
              continue to apply. A delay in enforcing a provision is not a waiver
              of the right to enforce it later.
            </p>

            <h3>Applicable law</h3>
            <p>
              These Terms operate subject to applicable law and do not remove any
              mandatory consumer protections available to you. The governing law
              and forum should be confirmed against the final Paritium operating
              entity before commercial launch.
            </p>
          </section>

          <section id="contact">
            <p className="legal-section-number">11</p>
            <h2>Questions and concerns</h2>
            <p>
              Contact us if you have a question about these Terms, believe rate
              information is inaccurate, or want to report misuse. We encourage
              users to raise concerns directly so they can be reviewed promptly.
            </p>
            <div className="legal-contact">
              <span>Terms and service questions</span>
              <a href="mailto:hello@paritium.com">hello@paritium.com</a>
              <p>Paritium | Greenvine Technologies &amp; EccentricLLC</p>
            </div>
          </section>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
