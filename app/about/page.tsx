import type { Metadata } from "next";
import Image from "next/image";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TrackedLink from "@/components/TrackedLink";
import { getAllRates } from "@/lib/rates";
import type { ProviderLogo as ProviderLogoType, ProviderRate } from "@/lib/rates";

export const metadata: Metadata = {
  title: "About | Paritium",
  description:
    "Learn about Paritium's mission to bring more transparency to foreign exchange rate comparison."
};

const allProviders = uniqueProviders(Object.values(getAllRates()).flat());

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />

      <section className="about-hero section-pad">
        <div className="about-hero-copy">
          <p className="eyebrow">About Paritium</p>
          <h1>Bringing transparency and fairness to foreign exchange.</h1>
          <p>
            Paritium exists to help consumers, travellers, diaspora communities,
            and small businesses compare published exchange rates before
            choosing a transfer provider.
          </p>
        </div>
        <div className="about-hero-media" aria-label="People comparing exchange providers">
          <Image
            alt="Product team reviewing global exchange rate comparison data"
            height={900}
            priority
            sizes="(max-width: 960px) calc(100vw - 40px), 48vw"
            src="/about-team-hero.webp"
            width={1200}
          />
        </div>
      </section>

      <section className="mission-section section-pad" aria-labelledby="mission-title">
        <div className="section-heading">
          <p className="eyebrow">Our mission</p>
          <h2 id="mission-title">
            &quot;Paritium exists to bring{" "}
            <span className="hero-title-accent">transparency</span> and{" "}
            <span className="hero-title-accent">fairness</span> to foreign
            exchange.&quot;
          </h2>
        </div>

        <div className="mission-grid">
          <article>
            <h3>Who is behind Paritium?</h3>
            <p>
              Paritium is led by Greenvine Technologies and EccentricLLC, with
              Faith driving the technical build, API architecture, and product
              delivery.
            </p>
            <div className="mission-illustration mission-team" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>
          <article>
            <h3>Why it was built</h3>
            <p>
              International senders often compare providers manually across
              multiple tabs. Paritium reduces that effort by presenting
              published rates side by side.
            </p>
            <div className="mission-illustration mission-compare" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>
          <article>
            <h3>What Paritium does not do</h3>
            <p>
              Paritium does not process transfers, hold customer funds, or
              replace provider checkout. Transfers happen directly with the
              provider selected by the user.
            </p>
            <div className="mission-illustration mission-boundary" aria-hidden="true">
              <span />
              <span />
            </div>
          </article>
        </div>
      </section>

      <section className="providers-section section-pad" aria-labelledby="providers-title">
        <div className="section-heading">
          <p className="eyebrow">Integrated providers</p>
          <h2 id="providers-title">Providers currently represented in rate data.</h2>
          <p>
            These providers are shown for comparison and product development
            purposes. Provider coverage can expand as API access and data
            quality improve.
          </p>
        </div>

        <div className="provider-logo-grid">
          {allProviders.map((provider) => (
            <article key={provider.provider}>
              <ProviderLogo
                logo={provider.logo}
                provider={provider.provider}
                shortName={provider.shortName}
              />
              <strong>{provider.provider}</strong>
            </article>
          ))}
        </div>

        <div className="independence-note">
          Paritium has no commercial relationship with listed providers in this
          prototype. Rates and provider links are presented independently for
          comparison.
        </div>
      </section>

      <section className="contact-cta" aria-labelledby="contact-title">
        <div>
          <p className="eyebrow">Contact and feedback</p>
          <h2 id="contact-title">Help shape better rate comparison.</h2>
          <p>
            Share provider feedback, suggest currency routes, or contact the
            Paritium team as the platform moves toward live integrations.
          </p>
        </div>
        <div className="contact-actions">
          <TrackedLink
            className="button button-invert"
            eventName="paritium_survey_clicked"
            eventParameters={{ page_origin: "about_contact_cta" }}
            href="/survey"
          >
            Take the survey
          </TrackedLink>
          <a className="button button-secondary" href="mailto:hello@paritium.com">
            hello@paritium.com
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function uniqueProviders(providers: ProviderRate[]) {
  return Array.from(
    new Map(providers.map((provider) => [provider.provider, provider])).values()
  ).sort((a, b) => a.provider.localeCompare(b.provider));
}

function ProviderLogo({
  logo,
  provider,
  shortName
}: {
  logo: ProviderLogoType;
  provider: string;
  shortName: string;
}) {
  return (
    <span className="provider-logo about-provider-logo">
      {logo.type === "svg" ? (
        <svg
          aria-label={`${provider} logo`}
          role="img"
          viewBox={logo.viewBox}
          style={{ color: logo.color }}
        >
          <path d={logo.path} fill="currentColor" />
        </svg>
      ) : logo.type === "image" ? (
        <img
          src={logo.src}
          alt={logo.alt || `${provider} logo`}
          decoding="async"
          loading="lazy"
        />
      ) : (
        <span className="provider-wordmark" aria-label={`${provider} logo`}>
          {logo.text || shortName}
        </span>
      )}
    </span>
  );
}
