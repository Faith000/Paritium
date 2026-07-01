import type { Metadata } from "next";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "How It Works | Paritium",
  description:
    "Learn how Paritium compares published exchange rates and directs users to provider platforms."
};

const steps = [
  {
    number: "1",
    title: "Select your currency pair",
    body: "Choose the published route you want to compare, such as USD to NGN, GBP to NGN, EUR to USD, or CAD to NGN."
  },
  {
    number: "2",
    title: "View today's live rates",
    body: "Paritium ranks available provider rates from best to worst and shows when each rate was last updated."
  },
  {
    number: "3",
    title: "Open the provider directly",
    body: "Click Visit Website or use the app links beside a provider to continue on that provider's own platform."
  },
  {
    number: "4",
    title: "Complete your transfer off Paritium",
    body: "Paritium does not execute transfers, hold money, or process payments. Your transaction happens with the provider you choose."
  }
];

const faqs = [
  {
    question: "Is Paritium free to use?",
    answer:
      "Yes. Paritium is free for users who want to compare published exchange rates."
  },
  {
    question: "Does Paritium execute transfers?",
    answer:
      "No. Paritium is a comparison service. We show rates and direct you to the provider's own secure website or app."
  },
  {
    question: "How often are rates updated?",
    answer:
      "The PRD target is at least every 60 minutes. The interface also flags stale rates when data is older than 2 hours."
  },
  {
    question: "Do I need to enter an amount to compare rates?",
    answer:
      "You can compare published rates without an amount, but entering an amount lets Paritium estimate what the recipient receives after the listed transfer fee."
  },
  {
    question: "How do I download a provider's app?",
    answer:
      "Use the iOS or Android app links next to each provider in the comparison table."
  }
];

export default function HowItWorksPage() {
  return (
    <main>
      <SiteHeader />

      <section className="explain-hero section-pad">
        <div className="explain-hero-copy">
          <p className="eyebrow">How it works</p>
          <h1>Compare rates clearly. Transfer with the provider you choose.</h1>
          <p>
            Paritium helps you inspect published exchange rates from multiple
            providers in one place. We do not handle transfers, hold funds, or
            replace provider checkout.
          </p>
        </div>
        <div className="explain-hero-media explain-hero-illustration" aria-label="Exchange rate comparison illustration">
          <div className="hero-compare-object" aria-hidden="true">
            <span className="hero-object-card" />
            <span className="hero-object-globe" />
            <span className="hero-object-rate" />
            <span className="hero-object-check" />
            <span className="hero-object-orbit" />
          </div>
        </div>
      </section>

      <section className="explainer section-pad" aria-labelledby="steps-title">
        <div className="explainer-copy">
          <p className="eyebrow">Step by step</p>
          <h2 id="steps-title">From currency pair to provider platform.</h2>
          <p>
            The flow stays intentionally simple: choose a route, compare
            today's rates, then continue directly with a provider.
          </p>
          <a className="button button-primary" href="/compare">
            Compare rates
          </a>
        </div>

        <div className="step-card-grid">
          {steps.map((step) => (
            <article className="explainer-step-card" key={step.number}>
              <span className="explainer-step-icon" aria-hidden="true">
                {step.number}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-note" aria-labelledby="service-note-title">
        <div>
          <p className="eyebrow">Important distinction</p>
          <h2 id="service-note-title">Paritium is not a transfer provider.</h2>
          <p>
            We compare published rates and link you out to provider websites or
            app listings. Any quote confirmation, payment, identity checks, and
            transfer completion happen on the provider's own platform.
          </p>
        </div>
        <a className="button button-invert" href="/compare">
          Compare rates
        </a>
      </section>

      <section className="faq-section faq-layout section-pad" aria-labelledby="faq-title">
        <div className="section-heading">
          <p className="eyebrow">Frequently asked questions</p>
          <h2 id="faq-title">Common questions before comparing rates.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                <span>{faq.question}</span>
                <span className="faq-toggle" aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
