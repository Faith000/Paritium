import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllRates, getCurrencyPairs } from "@/lib/rates";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CompareRatesClient from "./CompareRatesClient";

export const metadata: Metadata = {
  title: "Compare Rates | Paritium",
  description:
    "Compare published exchange rates, provider links, app download links, and provider survey links."
};

export default function CompareRatesPage() {
  return (
    <main>
      <SiteHeader ctaHref="/survey" ctaLabel="Share Feedback" />

      <section className="compare-hero section-pad">
        <div>
          <p className="eyebrow">Compare rates</p>
          <h1>Provider exchange rates, ranked by value.</h1>
        </div>
      </section>

      <Suspense fallback={null}>
        <CompareRatesClient
          pairs={getCurrencyPairs()}
          ratesByPair={getAllRates()}
        />
      </Suspense>
      <SiteFooter />
    </main>
  );
}
