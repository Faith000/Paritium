import { getCurrencyPairs, getRates } from "@/lib/rates";
import type { ProviderLogo as ProviderLogoType } from "@/lib/rates";
import { shouldUseProductionRateData } from "@/lib/rates/environment";
import Image from "next/image";
import HeroRateSelector from "@/components/HeroRateSelector";
import NotifyMeForm from "@/components/NotifyMeForm";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TrackedLink from "@/components/TrackedLink";

const pairs = getCurrencyPairs();
const rates = getRates("GBP_NGN");
const productionRateData = shouldUseProductionRateData();

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function timeAgo(iso: string) {
  const minutes = Math.round((new Date(iso).getTime() - Date.now()) / 60_000);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  return formatter.format(Math.round(minutes / 60), "hour");
}

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero section-pad" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            Find the Best Exchange Rate <span className="hero-title-accent">Instantly</span>
          </h1>
          <p className="hero-lede">
            Compare today&apos;s live FX rates from leading transfer providers and
            pick the best deal
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#how-it-works">
              How it works
            </a>
          </div>
          <div className="trust-strip" aria-label="Trust indicators">
            <span>
              <TrustIcon type="refresh" />
              Updated every hour
            </span>
            <span>
              <TrustIcon type="providers" />
              {productionRateData ? "Wise rates only" : "3+ providers compared"}
            </span>
            <span>
              <TrustIcon type="free" />
              Free to use
            </span>
          </div>
        </div>

        <div className="hero-panel hero-rate-card" aria-label="Currency route selector">
          <HeroRateSelector pairs={pairs} />
        </div>
      </section>

      <section className="proof-strip" aria-label="Platform proof points">
        <div className="proof-strip-inner">
          {[
            ["4", "active currency routes"],
            [
              productionRateData ? "1" : "6",
              productionRateData ? "verified live provider" : "providers in comparison"
            ],
            ["0", "transfers handled by Paritium"],
            ["Hourly", "rate freshness target"]
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="how section-pad" id="how-it-works">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Designed for quick, confident FX decisions.</h2>
        </div>
        <div className="steps-grid">
          {[
            [
              "1",
              "Choose your currency pair",
              "Pick a published route such as GBP to NGN, USD to NGN, or EUR to NGN."
            ],
            [
              "2",
              "Compare providers side by side",
              "Review rates, last update time, website links, app availability, and freshness."
            ],
            [
              "3",
              "Continue with the provider",
              "Open the provider website or app store link. Paritium never handles your transfer."
            ]
          ].map(([number, title, copy]) => (
            <article className="step-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section section-pad" aria-labelledby="trust-title">
        <div className="section-heading">
          <p className="eyebrow">Trust model</p>
          <h2 id="trust-title">Clear comparison signals, not transfer promises.</h2>
          <p>
            Paritium helps you understand provider rates before you decide.
            We keep the product focused on discovery, transparency, and
            comparison integrity.
          </p>
        </div>
        <div className="trust-grid">
          <article>
            <h3>Published rate data</h3>
            <p>
              Compare provider-published rates with freshness context before
              choosing where to continue.
            </p>
            <RateDataIllustration />
          </article>
          <article>
            <h3>Neutral provider ranking</h3>
            <p>
              Providers are ordered by rate strength for the selected route,
              with stale rates clearly flagged.
            </p>
            <RankingIllustration />
          </article>
          <article>
            <h3>Checkout stays with providers</h3>
            <p>
              Paritium never receives, holds, or moves your money. Transfers
              happen on the provider platform.
            </p>
            <CheckoutIllustration />
          </article>
        </div>
      </section>

      <section className="popular-routes section-pad" aria-labelledby="routes-title">
        <div className="section-heading">
          <p className="eyebrow">Popular routes</p>
          <h2 id="routes-title">Start with the currency pairs Paritium tracks first.</h2>
        </div>
        <div className="route-grid">
          {pairs.map((pair) => (
            <TrackedLink
              eventName="currency_pair_selected"
              eventParameters={{
                cta_name: "compare_providers",
                currency_pair: pair.value,
                from_currency: pair.source,
                to_currency: pair.target
              }}
              href={`/compare?pair=${pair.value}`}
              key={pair.value}
            >
              <RoutePairLabel label={pair.label} />
              <strong>Compare providers</strong>
            </TrackedLink>
          ))}
        </div>
      </section>

      <section className="app-cta section-pad" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">Coming soon</p>
          <h2 id="app-title">The Paritium app is launching soon.</h2>
          <p>
            Leave your email and we&apos;ll notify you as soon as the app goes
            live, so you can save routes, monitor provider changes, and receive
            rate alerts on your phone.
          </p>
          <NotifyMeForm />
        </div>
        <AppComingSoonMockup />
      </section>

      <section className="faq-section faq-layout section-pad" aria-labelledby="faq-title">
        <div className="section-heading">
          <p className="eyebrow">Frequently asked questions</p>
          <h2 id="faq-title">What to know before comparing.</h2>
        </div>
        <div className="faq-list">
          {[
            [
              "Does Paritium send money?",
              "No. Paritium is a comparison and discovery platform. You complete any transfer directly with the provider you choose."
            ],
            [
              "Why can provider checkout rates differ?",
              "Rates can change quickly and provider fees may vary by amount, payment method, or destination. Always confirm on the provider checkout page."
            ],
            [
              "How should I use the best-rate badge?",
              "Use it as a starting point. The top provider has the strongest published rate in the current comparison, but you should still review fees and delivery options."
            ]
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>
                <span>{question}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="survey-banner" aria-labelledby="survey-title">
        <div>
          <p className="eyebrow">Take survey</p>
          <h2 id="survey-title">Help us improve Paritium.</h2>
          <p>
            Share your transfer habits and provider experience so Paritium can
            build richer comparison data for real users.
          </p>
        </div>
        <TrackedLink
          className="button button-invert"
          eventName="paritium_survey_clicked"
          eventParameters={{
            cta_name: "take_the_survey",
            page_origin: "homepage_survey_banner"
          }}
          href="/survey"
        >
          Take the survey
        </TrackedLink>
      </section>

      <SiteFooter />
    </main>
  );
}

function RoutePairLabel({ label }: { label: string }) {
  const [from, to] = label.split(" → ");

  return (
    <span className="route-pair">
      <span className="route-currency">
        <span className="route-flag" aria-hidden="true">
          {getCurrencyFlag(from)}
        </span>
        {from}
      </span>
      <span className="route-arrow" aria-hidden="true">
        →
      </span>
      <span className="route-currency">
        <span className="route-flag" aria-hidden="true">
          {getCurrencyFlag(to)}
        </span>
        {to}
      </span>
    </span>
  );
}

function getCurrencyFlag(code: string) {
  const flags: Record<string, string> = {
    CAD: "🇨🇦",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    NGN: "🇳🇬",
    USD: "🇺🇸"
  };

  return flags[code] ?? "";
}

function TrustIcon({ type }: { type: "refresh" | "providers" | "free" }) {
  const paths = {
    refresh: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M4 17v-5h5" />
        <path d="M6.2 9A7 7 0 0 1 18.7 6.7L20 12" />
        <path d="M17.8 15A7 7 0 0 1 5.3 17.3L4 12" />
      </>
    ),
    providers: (
      <>
        <path d="M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M17 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M12 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M2.5 20a4.5 4.5 0 0 1 6-4.2" />
        <path d="M21.5 20a4.5 4.5 0 0 0-6-4.2" />
      </>
    ),
    free: (
      <>
        <path d="M12 3 20 7v5c0 5-3.4 8.1-8 9-4.6-.9-8-4-8-9V7l8-4Z" />
        <path d="M8.5 12.2 10.8 14.5 15.8 9.5" />
      </>
    )
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        {paths[type]}
      </g>
    </svg>
  );
}

function RateDataIllustration() {
  return (
    <div className="trust-illustration rate-data-illustration" aria-hidden="true">
      <div className="mini-globe">
        <span />
        <span />
      </div>
      <div className="rate-card-visual">
        <strong>1,964.82</strong>
        <span>Updated hourly</span>
      </div>
      <div className="source-currency-cloud">
        {["GBP", "USD", "EUR", "CAD"].map((currency) => (
          <span className="currency-chip" key={currency}>
            {currency}
          </span>
        ))}
      </div>
    </div>
  );
}

function RankingIllustration() {
  return (
    <div className="trust-illustration ranking-illustration" aria-hidden="true">
      <div className="ranking-board">
        <div className="ranking-score-card">
          <span>#1</span>
          <strong>Best rate first</strong>
          <em>Freshness checked</em>
        </div>
        <div className="provider-node-cloud">
          {["W", "L", "R", "M", "T", "W"].map((provider, index) => (
            <span
              className={`provider-node provider-node-${index + 1}`}
              key={`${provider}-${index}`}
            >
              {provider}
            </span>
          ))}
        </div>
        <div className="ranking-scale">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="ranking-orbit" />
      <div className="ranking-badge">Neutral</div>
    </div>
  );
}

function AppComingSoonMockup() {
  return (
    <div className="app-mockup" aria-hidden="true">
      <Image
        alt=""
        className="app-hand-photo"
        height={990}
        sizes="(max-width: 620px) 300px, 330px"
        src="/app-coming-soon-phone-mockup-transparent.webp"
        width={660}
      />
    </div>
  );
}

function CheckoutIllustration() {
  return (
    <div className="trust-illustration checkout-illustration" aria-hidden="true">
      <div className="phone-frame">
        <div />
        <span />
      </div>
      <div className="orbit-line" />
      <div className="coin coin-one">£</div>
      <div className="coin coin-two">$</div>
      <div className="coin coin-three">₦</div>
      <div className="coin coin-four">€</div>
    </div>
  );
}

function ProviderCards() {
  return (
    <div className="provider-card-grid">
      {rates.slice(0, 4).map((rate, index) => (
        <article className="provider-card" key={rate.provider}>
          <div className="provider-card-top">
            <ProviderLogo
              logo={rate.logo}
              provider={rate.provider}
              shortName={rate.shortName}
            />
            {index === 0 ? <span>Best rate</span> : <span>Tracked</span>}
          </div>
          <h3>{rate.provider}</h3>
          <p>{rate.rateLabel}</p>
          <div className="provider-card-meta">
            <span className={rate.stale ? "stale" : ""}>
              Updated {timeAgo(rate.updatedAt)}
            </span>
            <span>{rate.supportedCurrencies.length} currencies</span>
          </div>
          <div className="provider-card-actions">
            <TrackedLink
              eventName="provider_visit_clicked"
              eventParameters={{
                cta_name: "visit_website",
                currency_pair: "GBP_NGN",
                provider_rank: index + 1,
                provider_name: rate.provider
              }}
              href={rate.websiteUrl}
            >
              Website
            </TrackedLink>
            <TrackedLink
              eventName="provider_survey_clicked"
              eventParameters={{
                cta_name: "provider_feedback",
                provider_name: rate.provider,
                provider_rank: index + 1
              }}
              href={rate.surveyUrl}
            >
              Feedback
            </TrackedLink>
          </div>
        </article>
      ))}
    </div>
  );
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
    <span className="provider-logo">
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
